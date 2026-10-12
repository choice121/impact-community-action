import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, sendMagicLink, signInWithGoogle, signOutUser } from '../lib/supabase';

export type UserRole =
  | 'admin'
  | 'finance'
  | 'program_manager'
  | 'volunteer_coordinator'
  | 'content_editor'
  | 'donor'
  | 'volunteer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  sendMagicLink: (email: string, redirectTo?: string) => Promise<{ error: Error | null; isDemo?: boolean }>;
  signInWithGoogle: () => Promise<{ error: Error | null; isDemo?: boolean }>;
  signOut: () => Promise<void>;
  simulateDemoLogin: (role?: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isConfigured: false,
  sendMagicLink: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
  simulateDemoLogin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // If Supabase is not configured, check for local demo session
    if (!isSupabaseConfigured) {
      const demoUser = localStorage.getItem('ica_demo_user');
      if (demoUser) {
        try {
          const parsed = JSON.parse(demoUser);
          setProfile(parsed);
          setUser({ id: parsed.id, email: parsed.email } as User);
        } catch {
          // ignore
        }
      }
      setLoading(false);
      return;
    }

    // Supabase is configured
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: data.email || email || '',
          fullName: data.full_name || 'Supporter',
          role: data.role || 'donor',
          avatarUrl: data.avatar_url,
        });
      } else {
        setProfile({
          id: userId,
          email: email || '',
          fullName: 'Supporter',
          role: 'donor',
        });
      }
    } catch {
      setProfile({
        id: userId,
        email: email || '',
        fullName: 'Supporter',
        role: 'donor',
      });
    }
  };

  const handleSendMagicLink = async (email: string, redirectTo?: string) => {
    const res = await sendMagicLink(email, redirectTo);
    return {
      error: res.error as Error | null,
      isDemo: 'isDemo' in res ? Boolean(res.isDemo) : false,
    };
  };

  const handleSignInWithGoogle = async () => {
    const res = await signInWithGoogle();
    return {
      error: res.error as Error | null,
      isDemo: 'isDemo' in res ? Boolean(res.isDemo) : false,
    };
  };

  const handleSignOut = async () => {
    localStorage.removeItem('ica_demo_user');
    setUser(null);
    setProfile(null);
    setSession(null);
    await signOutUser();
  };

  const simulateDemoLogin = (role: UserRole = 'donor') => {
    const mockProfile: UserProfile = {
      id: 'demo-user-123',
      email: 'supporter@impactaction.org',
      fullName: 'Sarah Miller',
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
    localStorage.setItem('ica_demo_user', JSON.stringify(mockProfile));
    setProfile(mockProfile);
    setUser({ id: mockProfile.id, email: mockProfile.email } as User);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        sendMagicLink: handleSendMagicLink,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut,
        simulateDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
