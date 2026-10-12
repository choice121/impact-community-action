import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://iffwljhdkzkgjeiddmqy.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZndsamhka3prZ2plaWRkbXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NzUwNjIsImV4cCI6MjEwNjA1MTA2Mn0.LM5sQGysd-o8n9Sb6miNU-8kdk8FK_X8ksl8OlZnQ9A';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://xyzcompany.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Connected Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Send passwordless Magic Link to user's email
 */
export async function sendMagicLink(email: string, redirectTo?: string) {
  if (!isSupabaseConfigured) {
    // In demo/unconfigured mode, simulate successful delivery
    return {
      data: { user: null, session: null },
      error: null,
      isDemo: true,
    };
  }

  const destination = redirectTo || `${window.location.origin}/portal`;
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: destination,
    },
  });
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    return {
      data: { provider: 'google', url: null },
      error: null,
      isDemo: true,
    };
  }

  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/portal`,
    },
  });
}

/**
 * Sign out
 */
export async function signOutUser() {
  if (!isSupabaseConfigured) {
    return { error: null };
  }
  return await supabase.auth.signOut();
}
