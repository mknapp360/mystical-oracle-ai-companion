
import { TarotCard } from '../types/tarot';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface CardMeaningProps {
  card: TarotCard;
  isReversed?: boolean;
}

export const CardMeaning = ({ card, isReversed = false }: CardMeaningProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto border-border bg-input backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-purple-600/80 text-white">
            {card.type === 'major' ? 'Major Arcana' : 'Minor Arcana'}
          </Badge>
          {card.number !== undefined && (
            <Badge variant="outline" className="border-purple-500/50 text-black">
              {card.number}
            </Badge>
          )}
          {isReversed && (
            <Badge variant="destructive" className="bg-red-600/80 text-white">
              Reversed
            </Badge>
          )}
        </div>
        <CardTitle className="font-serif text-2xl text-black">{card.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Keywords */}
        <div>
          <h3 className="font-semibold text-black mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {card.keywords.map((keyword) => (
              <span 
                key={keyword} 
                className="bg-input text-black px-3 py-1 rounded-full text-sm border border-border"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <Separator className="bg-purple-500/20" />

        {/* Description */}
        <div>
          <h3 className="font-semibold text-black mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">{card.description}</p>
        </div>

        <Separator className="bg-purple-500/20" />

        {/* Meanings */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg border ${!isReversed ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/50 border-border'}`}>
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <span>⬆️</span> Upright Meaning
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.uprightMeaning}</p>
          </div>
          
          <div className={`p-4 rounded-lg border ${isReversed ? 'bg-red-500/10 border-red-500/30' : 'bg-muted/50 border-border'}`}>
            <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
              <span>⬇️</span> Reversed Meaning
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.reversedMeaning}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
