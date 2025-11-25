import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import supabase, { signIn, signOut, signUp, getUser as getSupabaseUser } from '../services/supabaseService';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUpEditor: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check session on mount
    (async () => {
      try {
        const res = await getSupabaseUser();
        const u = (res as any)?.data?.user;
        if (u) {
          const role = (u.user_metadata && u.user_metadata.role) || (import.meta.env.VITE_ADMIN_EMAIL === u.email ? 'admin' : 'editor');
          setUser({ id: u.id, name: u.email || 'User', role: role as UserRole });
        }
      } catch (e) {
        // ignore
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const role = (u.user_metadata && (u.user_metadata as any).role) || (import.meta.env.VITE_ADMIN_EMAIL === u.email ? 'admin' : 'editor');
        setUser({ id: u.id, name: u.email || 'User', role: role as UserRole });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const doSignIn = async (email: string, password: string) => {
    await signIn(email, password);
    // auth listener will set user
  };

  const doSignOut = async () => {
    await signOut();
    setUser(null);
  };

  const signUpEditor = async (email: string, password: string) => {
    // create as editor
    await signUp(email, password, 'editor');
  };

  return (
    <AuthContext.Provider value={{ user, signIn: doSignIn, signOut: doSignOut, signUpEditor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};