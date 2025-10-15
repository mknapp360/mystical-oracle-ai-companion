import { supabase } from '../lib/supabaseClient'; // ✅ Use existing instance


export async function loginWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`, // or any specific route like '/journey'
    }
  });
}