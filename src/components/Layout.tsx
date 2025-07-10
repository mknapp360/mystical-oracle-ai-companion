import { ReactNode, useEffect, useState } from 'react';
import { NavBar } from './NavBar';
import { supabase } from '../lib/supabaseClient';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={user} />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;