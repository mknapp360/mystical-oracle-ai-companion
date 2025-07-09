
import { useState } from 'react';
import { TarotCard as TarotCardType } from '../types/tarot';
import { TarotCard } from './TarotCard';
import { CardMeaning } from './CardMeaning';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Search, X } from 'lucide-react';

interface CardLibraryProps {
  cards: TarotCardType[];
}

export const CardLibrary = ({ cards }: CardLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<TarotCardType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSuit, setActiveSuit] = useState<string>('major');

  const suits = ['major', 'wands', 'cups', 'swords', 'pentacles'];

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSuit =
      (activeSuit === 'major' && card.type === 'major') || card.suit === activeSuit;

    return matchesSearch && matchesSuit;
  });

  const handleCardClick = (card: TarotCardType) => {
    setSelectedCard(card);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search cards by name or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card/50 border-purple-500/30"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Suit Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {suits.map((suit) => (
          <Button
            key={suit}
            variant={activeSuit === suit ? 'default' : 'secondary'}
            onClick={() => setActiveSuit(suit)}
            className="capitalize"
          >
            {suit}
          </Button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredCards.map((card) => (
          <TarotCard
            key={card.id}
            card={card}
            isRevealed={true}
            onClick={() => handleCardClick(card)}
            className="float"
            style={{ animationDelay: `${Math.random() * 2}s` }}
          />
        ))}
      </div>

      {/* No Cards Found */}
      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔮</div>
          <h3 className="text-xl font-serif text-purple-200 mb-2">No cards found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or suit filter</p>
        </div>
      )}

      {/* Card Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-purple-500/30 bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-center text-purple-200">Card Meaning</DialogTitle>
          </DialogHeader>
          {selectedCard && <CardMeaning card={selectedCard} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};
