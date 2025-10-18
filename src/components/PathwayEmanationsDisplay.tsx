// src/components/PathwayEmanationsDisplay.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { generateAllActivePathwayInterpretations } from '@/lib/pathway-interpretations';
import { generateAllTransitInterpretations } from '@/lib/pathInterpretationEngine';

interface PathwayEmanationsDisplayProps {
  activePlanets: Record<string, { sign: string; house: string; sephirah: string; world: string }>;
}

export const PathwayEmanationsDisplay: React.FC<PathwayEmanationsDisplayProps> = ({ 
  activePlanets 
}) => {
  // NEW: Use the deep interpretation engine
  const deepInterpretations = generateAllTransitInterpretations(activePlanets);

  return (
    <div className="space-y-4">
      {deepInterpretations.map((interp, index) => (
        <Card key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">{interp.hebrewLetter}</span>
              <div>
                <div className="text-purple-900">{interp.pathName}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {interp.transitingPlanet} transiting this path
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Current Transit Meaning */}
            <div className="bg-white/50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold uppercase">
                  Current Transit Meaning
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-800">
                {interp.currentTransitMeaning}
              </p>
            </div>

            {/* Guidance Points */}
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <p className="text-xs font-semibold mb-2">Guidance:</p>
              <ul className="text-xs space-y-1">
                {interp.guidancePoints.map((point, i) => (
                  <li key={i}>• {point}</li>
                ))}
              </ul>
            </div>

            {/* Shadow Warning */}
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <p className="text-xs text-red-900">
                {interp.shadowWarning}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};