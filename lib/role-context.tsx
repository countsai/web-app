"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const GUEST_USER: User = {
  id: '',
  email: '',
  full_name: 'Guest',
  role: 'jobseeker',
  subscription_tier: 'free',
  ai_risk_score: 0,
  profile_completeness: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

type RoleContextType = {
  user: User;
  setRole: (role: UserRole) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(GUEST_USER);

  useEffect(() => {
    const loadProfile = async (authUser: { id: string; email?: string }) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setUser({
        ...GUEST_USER,
        id: authUser.id,
        email: profile?.email ?? authUser.email ?? '',
        full_name: profile?.full_name ?? GUEST_USER.full_name,
        role: profile?.account_type === 'business' ? 'employer' : 'jobseeker',
      });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setUser(GUEST_USER);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const setRole = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
  };

  return (
    <RoleContext.Provider value={{ user, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
