import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Layout from './components/Layout';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
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
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      // Redirect to journey page after successful login
      if (event === 'SIGNED_IN' && session?.user) {
        navigate('/journey');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Layout user={user}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/library" element={<CardLibrary cards={allCards} />} />
        <Route path="*" element={<NotFound />} />
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