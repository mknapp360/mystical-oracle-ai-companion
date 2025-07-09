
import { useState } from 'react';
import { CardLibrary } from '../components/CardLibrary';
import { CardReader } from '../components/CardReader';
import { allCards } from '../data/tarotCards';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { BookOpen, Sparkles, Stars, Moon } from 'lucide-react';

type ActiveTab = 'reading' | 'library';

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reading');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-purple-500/20 animate-pulse">
          <Stars className="w-8 h-8" />
        </div>
        <div className="absolute top-32 right-20 text-pink-500/20 animate-pulse delay-1000">
          <Moon className="w-6 h-6" />
        </div>
        <div className="absolute bottom-40 left-1/4 text-indigo-500/20 animate-pulse delay-2000">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="absolute bottom-20 right-1/3 text-purple-400/20 animate-pulse delay-500">
          <Stars className="w-5 h-5" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-purple-500/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
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

            {/* Navigation */}
            <nav className="flex justify-center mt-6">
              <Card className="border-purple-500/30 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-1 flex gap-1">
                  <Button
                    variant={activeTab === 'reading' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('reading')}
                    className={`gap-2 ${
                      activeTab === 'reading' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'text-muted-foreground hover:text-purple-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Card Reading
                  </Button>
                  <Button
                    variant={activeTab === 'library' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('library')}
                    className={`gap-2 ${
                      activeTab === 'library' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'text-muted-foreground hover:text-purple-300'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Card Library
                  </Button>
                </CardContent>
              </Card>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {activeTab === 'reading' && <CardReader cards={allCards} />}
          {activeTab === 'library' && <CardLibrary cards={allCards} />}
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 bg-background/80 backdrop-blur-sm mt-16">
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
  );
};

export default Index;
