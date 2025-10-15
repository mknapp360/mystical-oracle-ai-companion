import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Index from "./pages/Index";
import EnergeticSignaturePage from "./pages/EnergeticSignaturePage";
import NotFound from "./pages/NotFound";
import JourneyPage from "./pages/Journey";
import { CardLibrary } from './components/CardLibrary';
import { allCards } from './data/tarotCards';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout user={user}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<CardLibrary cards={allCards} />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/signature" element={<EnergeticSignaturePage />} />
              <Route path="/journey" element={<JourneyPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
