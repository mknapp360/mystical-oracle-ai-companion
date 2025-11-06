// src/App.tsx
// FIXED: Proper OAuth callback handling + safe redirects + last-page persistence

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Layout from './components/Layout';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EnergeticSignaturePage from "./pages/EnergeticSignaturePage";
import AccountSettings from "./pages/AccountSettings";
import JourneyPage from "./pages/Journey";
import { CardLibrary } from './components/CardLibrary';
import { allCards } from './data/tarotCards';
import { useEffect, useRef, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const queryClient = new QueryClient();
const LAST_PATH_KEY = 'tp:lastPath';

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const didInitialRedirect = useRef(false);

  // Persist every location change (per-tab)
  useEffect(() => {
    const blockList = new Set(['/login', '/logout', '/callback']);
    if (!blockList.has(location.pathname)) {
      const full = location.pathname + location.search + location.hash;
      sessionStorage.setItem(LAST_PATH_KEY, full);
    }
  }, [location]);

  // Initialize auth safely and avoid overeager redirects
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error('Session error:', error);

        setUser(session?.user ?? null);

        // Only send freshly-signed-in users from "/" to "/journey"
        if (!didInitialRedirect.current && session?.user && window.location.pathname === '/') {
          didInitialRedirect.current = true;
          navigate('/journey', { replace: true });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes with guarded redirects
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setUser(session?.user ?? null);

      // Ignore non-navigational events that can happen on focus/refresh
      if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        // Redirect to /journey only if user is on "/" (typical post-login)
        if (window.location.pathname === '/') {
          navigate('/journey', { replace: true });
        }
        return;
      }

      if (event === 'SIGNED_OUT') {
        navigate('/', { replace: true });
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Restore to last page if something bounced you to a default route
  useEffect(() => {
    if (loading) return;
    const last = sessionStorage.getItem(LAST_PATH_KEY);
    const current = window.location.pathname + window.location.search + window.location.hash;
    const isDefault = window.location.pathname === '/' || window.location.pathname === '/journey';
    if (last && isDefault && last !== current) {
      navigate(last, { replace: true });
    }
    // run once after loading completes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
        <Route path="/signature" element={<EnergeticSignaturePage />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="*" element={<NotFound />} />
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
