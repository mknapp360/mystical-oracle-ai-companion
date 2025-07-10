import { createClient } from '@supabase/supabase-js';


export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export async function loginWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
}

export const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = '/'; // force redirect
};
