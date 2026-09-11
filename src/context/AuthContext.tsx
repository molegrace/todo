import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";
import { ensureUserProfileDoc } from "../api/firestoreUsersApi";
import { logoutFirebase } from "../api/firebaseAuthApi";
import {
  clearAuthSession,
  getAuthSessionExpiry,
  hasAuthSession,
  isAuthSessionExpired,
  SESSION_STORAGE_KEY,
  startAuthSession,
} from "../services/auth/sessionExpiry";

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (nextUser && isAuthSessionExpired(nextUser.uid)) {
        clearAuthSession();
        setUser(null);
        setInitializing(false);
        void logoutFirebase();
        return;
      }

      if (nextUser && !hasAuthSession(nextUser.uid)) {
        // Existing sessions from before the 24-hour limit start their timer now.
        startAuthSession(nextUser.uid);
      }

      setUser(nextUser);
      setInitializing(false);

      if (nextUser) {
        void ensureUserProfileDoc(nextUser).catch((error) => {
          if (import.meta.env.DEV) {
            console.error("Failed to ensure user profile doc:", error);
          }
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const expiry = getAuthSessionExpiry(user.uid);
    if (!expiry) return;

    const timeoutId = window.setTimeout(() => {
      void logoutFirebase();
    }, Math.max(expiry - Date.now(), 0));

    return () => window.clearTimeout(timeoutId);
  }, [user]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SESSION_STORAGE_KEY && !event.newValue) {
        void logoutFirebase();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, initializing }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

