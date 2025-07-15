
import { useState, useEffect } from 'react';
import { CardLibrary } from '../components/CardLibrary';
import { CardReader } from '../components/CardReader';
import SkyCard from "../components/SkyCard";
import { allCards } from '../data/tarotCards';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { supabase } from '../lib/supabaseClient';
import { loginWithGoogle, logout } from '../components/Auth';
import { NavBar } from '../components/NavBar';
import React from "react";
import CurrentSky from "@/components/CurrentSky";

type ActiveTab = 'reading' | 'library';

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reading');

  const [user, setUser] = useState<any>(null);

    useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);
  
  return (
    <>
    <NavBar user={user} />
    
    <div className="min-h-screen bg-background relative overflow-hidden">
      

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-background backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <h1 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Tarot Pathwork
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Discover the wisdom of the cards
                </p>
              </div>
            </div>           
          </div>
        </header>

      
        <div className="text-center py-12">
          <img
            src="/images/sunburst.png"
            alt="Sunburst"
            className="w-32 h-32 mb-6 mx-auto"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <h2 className="font-serif text-2xl text-headerText mb-4">Welcome to Your Tarot Reading</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Focus on your question and draw a card to receive guidance from the mystical realm.
          </p>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          { <CurrentSky /> }
          {activeTab === 'reading' && <CardReader cards={allCards} user={user} />}    
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 bg-background backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground text-sm">
              🔮 Let the cards guide your journey through the mysteries of life 🔮
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              For entertainment purposes only
            </p>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
};

export default Index;
