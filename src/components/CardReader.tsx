import { useState } from 'react';
import { TarotCard as TarotCardType } from '../types/tarot';
import { TarotCard } from './TarotCard';
import { CardMeaning } from './CardMeaning';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Shuffle, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { supabase } from '../lib/supabaseClient';

interface CardReaderProps {
  cards: TarotCardType[];
  user: any;
}

export const CardReader = ({ cards, user }: CardReaderProps) => {
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<TarotCardType[]>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [isReversed, setIsReversed] = useState<boolean[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TarotCardType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const drawSingleCard = async () => {
    if (isDrawing || !cards || cards.length === 0) return;

    setAiResponse('');
    setIsDrawing(true);
    
    // Shuffle and pick a random card
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    const selectedCard = shuffledCards[0];
    const reversed = Math.random() < 0.3; // 30% chance of reversed
    
    setDrawnCards([selectedCard]);
    setRevealedCards([false]);
    setIsReversed([reversed]);
    
    // Reveal after animation
    setTimeout(() => {
      setRevealedCards([true]);
      setIsDrawing(false);
    }, 800);
  };

  const drawThreeCards = async () => {
    if (isDrawing || !cards || cards.length < 3) return;

    setAiResponse('');
    setIsDrawing(true);
    
    // Shuffle and pick 3 random cards
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, 3);
    const reversedStates = selectedCards.map(() => Math.random() < 0.3);
    
    setDrawnCards(selectedCards);
    setRevealedCards([false, false, false]);
    setIsReversed(reversedStates);
    
    // Reveal cards one by one
    setTimeout(() => setRevealedCards([true, false, false]), 600);
    setTimeout(() => setRevealedCards([true, true, false]), 1200);
    setTimeout(() => {
      setRevealedCards([true, true, true]);
      setIsDrawing(false);
    }, 1800);
  };

  const resetReading = () => {
    setDrawnCards([]);
    setRevealedCards([]);
    setIsReversed([]);
    setQuestion('');
    setAiResponse('');
    setLoading(false);
  };

  const getThreeCardLabels = () => ['Past / Situation', 'Present / Challenge', 'Future / Outcome'];

  const handleAskTheCards = async (count: number) => {
    if (!cards || cards.length < count) return;

    const drawn = [...cards].sort(() => Math.random() - 0.5).slice(0, count);
    const reversed = drawn.map(() => Math.random() < 0.5);

    setDrawnCards(drawn);
    setIsReversed(reversed);
    setRevealedCards(new Array(count).fill(true));
    setLoading(true);

    const formattedCards = drawn.map((card, index) => ({
      card,
      orientation: reversed[index] ? 'reversed' : 'upright',
    }));

    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, cards: formattedCards }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.interpretation);

      // Only save to database if user is logged in and supabase is available
      if (user && supabase) {
        try {
          await supabase.from('readings').insert([
            {
              user_id: user.id,
              question,
              cards: JSON.stringify(formattedCards),
              interpretation: data.interpretation,
            },
          ]);
        } catch (dbError) {
          console.error('Database error:', dbError);
          // Continue without saving to database
        }
      }
    } catch (err) {
      console.error('Error interpreting reading:', err);
      setAiResponse('There was an error connecting to the mystical servers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add buttons for AI interpretation
  const interpretReading = () => {
    if (drawnCards.length === 1) {
      handleAskTheCards(1);
    } else if (drawnCards.length === 3) {
      handleAskTheCards(3);
    }
  };

  // Early return if no cards provided
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tarot cards available. Please check your card data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Question Input */}
      <Card className="border-purple-500/30 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-serif text-center text-purple-200">
            Ask the Cards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What question would you like to ask the cards? (optional)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="bg-muted/50 border-purple-500/30 min-h-[80px]"
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={drawSingleCard} 
              disabled={isDrawing || cards.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Draw Single Card
            </Button>
            
            <Button 
              onClick={drawThreeCards} 
              disabled={isDrawing || cards.length < 3}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Draw Three Cards
            </Button>
            
            {drawnCards.length > 0 && (
              <Button 
                onClick={resetReading} 
                variant="ghost"
                className="text-muted-foreground hover:text-purple-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Reading
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Display */}
      {question && drawnCards.length > 0 && (
        <Card className="border-purple-500/30 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h3 className="font-serif text-lg text-purple-200 text-center mb-2">Your Question</h3>
            <p className="text-muted-foreground text-center italic">"{question}"</p>
          </CardContent>
        </Card>
      )}

      {/* AI Interpretation Button */}
      {drawnCards.length > 0 && revealedCards.every(Boolean) && !loading && !aiResponse && (
        <div className="text-center">
          <Button 
            onClick={interpretReading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Get AI Interpretation
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="border-purple-500/30 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Consulting the mystical realm...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Response */}
      {aiResponse && (
        <Card className="border-purple-500/30 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4 text-purple-200">Interpretation:</h3>
            <div className="prose prose-purple max-w-none">
              <p className="text-muted-foreground leading-relaxed">{aiResponse}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drawn Cards */}
      {drawnCards.length > 0 && (
        <div className="space-y-6">
          <div className={`grid gap-6 ${drawnCards.length === 3 ? 'md:grid-cols-3' : 'justify-center'}`}>
            {drawnCards.map((card, index) => (
              <div key={`${card.id}-${index}`} className="space-y-3">
                {drawnCards.length === 3 && (
                  <h3 className="font-serif text-center text-purple-300 text-sm">
                    {getThreeCardLabels()[index]}
                  </h3>
                )}
                <div
                  onClick={() => {
                    if (revealedCards[index]) {
                      setSelectedCard(card);
                      setIsDialogOpen(true);
                    }
                  }}
                  className={`cursor-pointer mx-auto max-w-[200px] ${
                    revealedCards[index] ? 'card-flip' : ''
                  } ${revealedCards[index] ? 'hover:scale-105 transition-transform' : ''}`}
                >
                  <TarotCard
                    card={card}
                    isRevealed={revealedCards[index]}
                    className={isReversed[index] && revealedCards[index] ? 'rotate-180' : ''}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Card Meaning Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-purple-500/30 bg-background/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="font-serif text-center text-purple-200">Card Meaning</DialogTitle>
              </DialogHeader>
              {selectedCard && (
                <CardMeaning 
                  card={selectedCard} 
                  isReversed={isReversed[drawnCards.findIndex(c => c.id === selectedCard.id)]} 
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Initial State */}
      {drawnCards.length === 0 && (
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
          <h2 className="font-serif text-2xl text-purple-200 mb-4">Welcome to Your Tarot Reading</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Focus on your question and draw a card to receive guidance from the mystical realm.
          </p>
        </div>
      )}
    </div>
  );
};