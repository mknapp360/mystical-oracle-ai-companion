// src/App.tsx
// FIXED: Proper OAuth callback handling with getSession()

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Layout from './components/Layout';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EnergeticSignaturePage from "./pages/EnergeticSignaturePage";
import AccountSettings from "./pages/AccountSettings";
import JourneyPage from "./pages/Journey";
import { CardLibrary } from './components/CardLibrary';
import { allCards } from './data/tarotCards';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const queryClient = new QueryClient();

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // FIXED: Use getSession() instead of getUser() to handle OAuth callback
    const initializeAuth = async () => {
      try {
        // getSession() properly handles OAuth callback exchange
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
        }
        
        setUser(session?.user ?? null);
        
        // If we have a session and we're on the root path, redirect to journey
        if (session?.user && window.location.pathname === '/') {
          navigate('/journey');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      setUser(session?.user ?? null);
      
      // Handle different auth events
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, redirecting to journey');
        navigate('/journey');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to home');
        navigate('/');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/library" element={<CardLibrary cards={allCards} />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signature" element={<EnergeticSignaturePage />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/journey" element={<JourneyPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;