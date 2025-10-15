import { supabase } from '../lib/supabaseClient';

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://tarotpathwork-personal-oracle.vercel.app'
    }
  });
  
  if (error) {
    console.error('Login error:', error);
  }
}

export const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = '/';
};