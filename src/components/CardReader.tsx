
import { useState } from 'react';
import { TarotCard as TarotCardType } from '../types/tarot';
import { TarotCard } from './TarotCard';
import { CardMeaning } from './CardMeaning';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Shuffle, RotateCcw } from 'lucide-react';

interface CardReaderProps {
  cards: TarotCardType[];
}

export const CardReader = ({ cards }: CardReaderProps) => {
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<TarotCardType[]>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [isReversed, setIsReversed] = useState<boolean[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const drawSingleCard = async () => {
    if (isDrawing) return;

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
    if (isDrawing) return;

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
  };

  const getThreeCardLabels = () => ['Past / Situation', 'Present / Challenge', 'Future / Outcome'];

const handleAskTheCards = async () => {
  if (drawnCards.length === 0 || !question.trim()) return;

  setLoading(true);

  const formattedCards = drawnCards.map((card, index) => ({
    card,
    orientation: isReversed[index] ? 'reversed' : 'upright',
  }));

  try {
    const response = await fetch('/api/interpret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, cards: formattedCards }),
    });

    const data = await response.json();
    setAiResponse(data.interpretation);
  } catch (err) {
    console.error('Error fetching AI interpretation:', err);
    setAiResponse('There was an error connecting to the mystical servers. Try again.');
  } finally {
    setLoading(false);
  }
};

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
              disabled={isDrawing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Draw Single Card
            </Button>
            
            <Button 
              onClick={drawThreeCards} 
              disabled={isDrawing}
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

      {aiResponse && (
        <Card className="border-purple-500/30 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-2">Interpretation:</h3>
            <div className="font-serif text-lg text-purple-200 text-center mb-2">
              <p>{aiResponse}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {drawnCards.length > 0 && !aiResponse && (
        <div className="text-center">
          <Button
            onClick={handleAskTheCards}
            disabled={loading || !question.trim()}
            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? 'Consulting the Oracle…' : 'Interpret My Reading'}
          </Button>
        </div>
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
                <div className={`mx-auto max-w-[200px] ${revealedCards[index] ? 'card-flip' : ''}`}>
                  <TarotCard
                    card={card}
                    isRevealed={revealedCards[index]}
                    className={isReversed[index] && revealedCards[index] ? 'rotate-180' : ''}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Card Meanings */}
          {revealedCards.some(revealed => revealed) && (
            <div className="space-y-6">
              {drawnCards.map((card, index) => (
                revealedCards[index] && (
                  <CardMeaning 
                    key={`meaning-${card.id}-${index}`} 
                    card={card} 
                    isReversed={isReversed[index]}
                  />
                )
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {drawnCards.length === 0 && (
        <div className="text-center py-12">
          <img
            src="/images/sunburst.png"
            alt="Sunburst"
            className="w-32 h-32 mb-6 mx-auto"
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
