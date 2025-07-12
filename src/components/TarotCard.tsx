import { useState } from 'react';
import { TarotCard as TarotCardType } from '../types/tarot';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface TarotCardProps {
  card: TarotCardType;
  isRevealed?: boolean;
  onClick?: () => void;
  className?: string;
  reversed?: boolean;
}

export const TarotCard = ({ card, isRevealed = false, onClick, className = "", reversed = false }: TarotCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-purple-500/30 ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-0 aspect-[2/3] relative">
        {!isRevealed ? (
          // Card back
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <p className="font-serif text-sm opacity-80">Tarot Pathwork</p>
            </div>
          </div>
        ) : (
          // Card front
          <div className="w-full h-full relative">
            {/* Card image - only this gets rotated if reversed */}
            <img
              src={card.imageUrl}
              alt={card.name}
              className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${reversed ? 'rotate-180' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 shimmer" />
            )}
            
            {/* Card overlay with gradient - stays upright */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Card info - stays upright */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-purple-600/80 text-white text-xs">
                  {card.type === 'major' ? 'Major Arcana' : 'Minor Arcana'}
                </Badge>
                {card.number !== undefined && (
                  <Badge variant="outline" className="border-white/30 text-white text-xs">
                    {card.number}
                  </Badge>
                )}
                {reversed && (
                  <Badge variant="outline" className="border-red-400/50 text-red-300 text-xs">
                    Reversed
                  </Badge>
                )}
              </div>
              <h3 className="font-serif text-lg font-semibold mb-1">{card.name}</h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {card.keywords.slice(0, 3).map((keyword) => (
                  <span key={keyword} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
