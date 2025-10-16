// src/components/NatalAspectsDisplay.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type PlanetaryAspect } from '@/lib/aspect-calculator';
import { Sparkles, Zap, Triangle, Square as SquareIcon, Star } from 'lucide-react';

interface NatalAspectsDisplayProps {
  aspects: PlanetaryAspect[];
}

export const NatalAspectsDisplay: React.FC<NatalAspectsDisplayProps> = ({ aspects }) => {
  const getAspectIcon = (type: string) => {
    switch (type) {
      case 'conjunction': return <Sparkles className="w-4 h-4" />;
      case 'opposition': return <Zap className="w-4 h-4" />;
      case 'trine': return <Triangle className="w-4 h-4" />;
      case 'square': return <SquareIcon className="w-4 h-4" />;
      case 'sextile': return <Star className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'harmonious': return 'bg-green-100 text-green-800 border-green-300';
      case 'challenging': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const groupedAspects = {
    harmonious: aspects.filter(a => a.quality === 'harmonious'),
    challenging: aspects.filter(a => a.quality === 'challenging'),
    neutral: aspects.filter(a => a.quality === 'neutral'),
  };

  const aspectCounts = {
    conjunction: aspects.filter(a => a.type === 'conjunction').length,
    opposition: aspects.filter(a => a.type === 'opposition').length,
    trine: aspects.filter(a => a.type === 'trine').length,
    square: aspects.filter(a => a.type === 'square').length,
    sextile: aspects.filter(a => a.type === 'sextile').length,
    quincunx: aspects.filter(a => a.type === 'quincunx').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Natal Aspects Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(aspectCounts).map(([type, count]) => (
              <div key={type} className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{type}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="font-semibold text-green-600">{groupedAspects.harmonious.length}</p>
              <p className="text-muted-foreground">Harmonious</p>
            </div>
            <div>
              <p className="font-semibold text-red-600">{groupedAspects.challenging.length}</p>
              <p className="text-muted-foreground">Challenging</p>
            </div>
            <div>
              <p className="font-semibold text-blue-600">{groupedAspects.neutral.length}</p>
              <p className="text-muted-foreground">Neutral</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aspects by Quality */}
      {Object.entries(groupedAspects).map(([quality, qualityAspects]) => (
        qualityAspects.length > 0 && (
          <Card key={quality}>
            <CardHeader>
              <CardTitle className="capitalize">{quality} Aspects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {qualityAspects.map((aspect, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="mt-1">
                    {getAspectIcon(aspect.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{aspect.planet1}</span>
                      <Badge className={getQualityColor(aspect.quality)}>
                        {aspect.symbol} {aspect.type}
                      </Badge>
                      <span className="font-semibold">{aspect.planet2}</span>
                      <span className="text-xs text-muted-foreground">
                        {aspect.orb.toFixed(2)}° orb
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {aspect.meaning}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <Badge variant="outline" className="text-xs">
                        {aspect.sephirah1}
                      </Badge>
                      <span>↔</span>
                      <Badge variant="outline" className="text-xs">
                        {aspect.sephirah2}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          aspect.pathIllumination === 'full' 
                            ? 'bg-yellow-50 border-yellow-300' 
                            : aspect.pathIllumination === 'shadow'
                            ? 'bg-gray-50 border-gray-300'
                            : ''
                        }`}
                      >
                        {aspect.pathIllumination} illumination
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground italic mt-2">
                      {aspect.type === 'conjunction' && '✨ Energies merge into unified expression'}
                      {aspect.type === 'opposition' && '⚖️ Dynamic polarity seeking balance'}
                      {aspect.type === 'trine' && '🌊 Harmonious flow of energy'}
                      {aspect.type === 'square' && '⚡ Creative tension and growth'}
                      {aspect.type === 'sextile' && '🌟 Opportunities waiting to be activated'}
                      {aspect.type === 'quincunx' && '🔄 Adjustment and adaptation needed'}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      ))}
    </div>
  );
};