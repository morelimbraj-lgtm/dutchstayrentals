import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Property, Enquiry, User, EnquiryStatus, PropertyStatus } from '../types';
import { db, storage, auth } from '../firebase';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, setDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, deleteObject } from 'firebase/storage';
import { mockProperties, mockEnquiries, mockUsers } from '../data/mock';

interface DataContextType {
  properties: Property[];
  enquiries: Enquiry[];
  users: User[];
  addProperty: (propertyData: Omit<Property, 'id' | 'ownerId' | 'createdAt'>, ownerId: string) => Promise<void>;
  updateProperty: (propertyId: string, propertyData: Partial<Omit<Property, 'id' | 'createdAt' | 'ownerId'>>) => Promise<void>;
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

  // 1. Subscribe to Properties (public read — no auth needed)
  useEffect(() => {
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setProperties(props);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Enquiries and Users only when authenticated
  useEffect(() => {
    let unsubEnquiries: (() => void) | null = null;
    let unsubUsers: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Cleanup previous listeners
      unsubEnquiries?.();
      unsubUsers?.();

      if (!firebaseUser) {
        setEnquiries([]);
        setUsers([]);
        return;
      }

      // Subscribe to Enquiries
      const eqQuery = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
      unsubEnquiries = onSnapshot(eqQuery, (snapshot) => {
        const enqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Enquiry));
        setEnquiries(enqs);
      }, (error) => {
        console.error('Enquiries listener error:', error);
      });

      // Subscribe to Users
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usrs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as User));
        setUsers(usrs);
      }, (error) => {
        console.error('Users listener error:', error);
      });
    });

    return () => {
      unsubAuth();
      unsubEnquiries?.();
      unsubUsers?.();
    };
  }, []);

  const addProperty = useCallback(async (propertyData: Omit<Property, 'id' | 'ownerId' | 'createdAt'>, ownerId: string) => {
    await addDoc(collection(db, 'properties'), {
      ...propertyData,
      ownerId,
      createdAt: new Date().toISOString(),
    });
  }, []);

  const updateProperty = useCallback(async (propertyId: string, propertyData: Partial<Omit<Property, 'id' | 'createdAt' | 'ownerId'>>) => {
    await updateDoc(doc(db, 'properties', propertyId), {
      ...propertyData,
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
