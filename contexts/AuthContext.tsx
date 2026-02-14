
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'smonu2303@gmail.com';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // 1. Check if Admin
          if (firebaseUser.email === ADMIN_EMAIL) {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || 'Admin',
              role: UserRole.ADMIN,
              status: 'ACTIVE'
            });
          } else {
            // 2. Check Firestore for whitelisted Owner
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where("email", "==", firebaseUser.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data();

              if (userData.status === 'BLOCKED') {
                throw new Error("Your account has been blocked. Please contact admin.");
              }

              setUser({
                id: userDoc.id, // Use Firestore ID
                email: userData.email,
                name: userData.name || firebaseUser.displayName || 'Owner',
                role: UserRole.OWNER, // Enforce role from DB
                status: userData.status
              });
            } else {
              // Not authorized
              await signOut(auth);
              setUser(null);
              setError("Access denied. You must be added by an administrator.");
            }
          }
        } catch (err: any) {
          console.error("Auth Error:", err);
          await signOut(auth);
          setUser(null);
          setError(err.message || "Authentication failed");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }, []);


  const value = { user, loginWithGoogle, logout, loading, error };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
