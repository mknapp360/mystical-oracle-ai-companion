import { ReactNode, useEffect, useState } from 'react';
import { NavBar } from './NavBar';


interface LayoutProps {
  children: ReactNode;
  user: any;
}

const Layout = ({ children, user }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar user={user} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;