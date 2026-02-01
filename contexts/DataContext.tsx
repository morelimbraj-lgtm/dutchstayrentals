
import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Property, Enquiry, User, EnquiryStatus, PropertyStatus } from '../types';
import { db, storage } from '../firebase';
import { 
    collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, setDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { mockProperties, mockEnquiries, mockUsers } from '../data/mock';

interface DataContextType {
  properties: Property[];
  enquiries: Enquiry[];
  users: User[];
  addProperty: (propertyData: Omit<Property, 'id' | 'ownerId' | 'createdAt'>, ownerId: string, files: File[]) => Promise<void>;
  updateProperty: (propertyId: string, propertyData: Partial<Omit<Property, 'id' | 'createdAt' | 'ownerId'>>, newFiles: File[]) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
  addEnquiry: (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateEnquiryStatus: (enquiryId: string, status: EnquiryStatus) => Promise<void>;
  deleteEnquiry: (enquiryId: string) => Promise<void>;
  updatePropertyStatus: (propertyId: string, status: PropertyStatus) => Promise<void>;
  updateUserStatus: (userId: string, status: 'ACTIVE' | 'BLOCKED') => Promise<void>;
  addUser: (email: string, name: string) => Promise<void>;
  seedDatabase: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // 1. Subscribe to Properties
  useEffect(() => {
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setProperties(props);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Enquiries
  useEffect(() => {
    const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const enqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enquiry));
        setEnquiries(enqs);
    });
    return () => unsubscribe();
  }, []);

  // 3. Subscribe to Users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usrs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(usrs);
    });
    return () => unsubscribe();
  }, []);

  // --- Helper: Upload Images ---
  const uploadImages = async (files: File[]): Promise<string[]> => {
      const urls: string[] = [];
      for (const file of files) {
          const storageRef = ref(storage, `property-images/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          urls.push(url);
      }
      return urls;
  };

  const addProperty = useCallback(async (propertyData: Omit<Property, 'id' | 'ownerId' | 'createdAt'>, ownerId: string, files: File[]) => {
    const imageUrls = await uploadImages(files);
    // Merge manual URLs with uploaded URLs
    const finalImages = [...propertyData.images, ...imageUrls];
    
    await addDoc(collection(db, 'properties'), {
        ...propertyData,
        images: finalImages,
        ownerId,
        createdAt: new Date().toISOString(),
    });
  }, []);

  const updateProperty = useCallback(async (propertyId: string, propertyData: Partial<Omit<Property, 'id' | 'createdAt' | 'ownerId'>>, newFiles: File[]) => {
      let finalImages = propertyData.images || [];
      if (newFiles.length > 0) {
          const newUrls = await uploadImages(newFiles);
          finalImages = [...finalImages, ...newUrls];
      }

      await updateDoc(doc(db, 'properties', propertyId), {
          ...propertyData,
          images: finalImages
      });
  }, []);

  const deleteProperty = useCallback(async (propertyId: string) => {
    await deleteDoc(doc(db, 'properties', propertyId));
    // Ideally, we should also delete related enquiries and images from storage here
    // For simplicity in this demo, we just delete the doc.
  }, []);
  
  const addEnquiry = useCallback(async (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
      await addDoc(collection(db, 'enquiries'), {
          ...enquiryData,
          status: EnquiryStatus.NEW,
          createdAt: new Date().toISOString(),
      });
  }, []);

  const updateEnquiryStatus = useCallback(async (enquiryId: string, status: EnquiryStatus) => {
      await updateDoc(doc(db, 'enquiries', enquiryId), { status });
  }, []);
  
  const deleteEnquiry = useCallback(async (enquiryId: string) => {
    await deleteDoc(doc(db, 'enquiries', enquiryId));
  }, []);

  const updatePropertyStatus = useCallback(async (propertyId: string, status: PropertyStatus) => {
    await updateDoc(doc(db, 'properties', propertyId), { status });
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: 'ACTIVE' | 'BLOCKED') => {
    await updateDoc(doc(db, 'users', userId), { status });
  }, []);

  const addUser = useCallback(async (email: string, name: string) => {
      // Add a new authorized owner
      await addDoc(collection(db, 'users'), {
          email,
          name,
          role: 'OWNER',
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
      });
  }, []);

  const seedDatabase = useCallback(async () => {
    try {
        const promises = [];
        
        // Seed Users
        for (const user of mockUsers) {
            // We use setDoc to preserve IDs from mock data for relationship integrity
            promises.push(setDoc(doc(db, 'users', user.id), user));
        }

        // Seed Properties
        for (const prop of mockProperties) {
             promises.push(setDoc(doc(db, 'properties', prop.id), prop));
        }

        // Seed Enquiries
        for (const enq of mockEnquiries) {
             promises.push(setDoc(doc(db, 'enquiries', enq.id), enq));
        }

        await Promise.all(promises);
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
  }, []);

  const value = { 
      properties, 
      enquiries, 
      users,
      addProperty,
      updateProperty,
      deleteProperty,
      addEnquiry,
      updateEnquiryStatus,
      deleteEnquiry,
      updatePropertyStatus,
      updateUserStatus,
      addUser,
      seedDatabase
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
