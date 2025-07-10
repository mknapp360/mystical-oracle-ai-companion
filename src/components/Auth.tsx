import { supabase } from '../lib/supabaseClient'; // ✅ Use existing instance

export async function loginWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
}

export const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = '/'; // ✅ redirect to home/login
};