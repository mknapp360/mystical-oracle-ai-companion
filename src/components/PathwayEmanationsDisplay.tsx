// src/components/PathwayEmanationsDisplay.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { generateAllActivePathwayInterpretations } from '@/lib/pathway-interpretations';

interface PathwayEmanationsDisplayProps {
  activePlanets: Record<string, { sign: string; house: string; sephirah: string; world: string }>;
}

export const PathwayEmanationsDisplay: React.FC<PathwayEmanationsDisplayProps> = ({ activePlanets }) => {
  const pathwayInterpretations = generateAllActivePathwayInterpretations(activePlanets);

  // Group by sign to avoid duplicates (multiple planets in same sign)
  const uniquePaths = pathwayInterpretations.reduce((acc, interpretation) => {
    const key = interpretation.pathName;
    if (!acc.has(key)) {
      acc.set(key, interpretation);
    }
    return acc;
  }, new Map());

  const uniqueInterpretations = Array.from(uniquePaths.values());

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif font-bold text-purple-900 dark:text-purple-100 mb-2">
          Pathways of Emanation
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          How divine energy flows through the Tree right now
        </p>
      </div>

      {uniqueInterpretations.map((interpretation, index) => {
        // Find which planet(s) are activating this path
        const planetsOnPath = Object.entries(activePlanets)
          .filter(([_, data]) => {
            const pathName = `${data.sign} - ${interpretation.pathName.split(' - ')[1]}`;
            return pathName === interpretation.pathName;
          })
          .map(([planet, _]) => planet);

        return (
          <Card 
            key={interpretation.pathName}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-2 border-purple-200 dark:border-purple-800"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-serif flex items-center gap-2">
                    <span className="text-3xl">{interpretation.hebrewLetter}</span>
                    <div>
                      <div className="text-purple-900 dark:text-purple-100">
                        {interpretation.pathName}
                      </div>
                      <div className="text-xs font-normal text-gray-600 dark:text-gray-400 mt-1">
                        {interpretation.traditionalMeaning}
                      </div>
                    </div>
                  </CardTitle>
                </div>
                
                {/* Planet badges */}
                <div className="flex flex-wrap gap-1 ml-2">
                  {planetsOnPath.map(planet => (
                    <span 
                      key={planet}
                      className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold"
                    >
                      {planet}
                    </span>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Current Emanation - The main interpretation */}
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                    Current Emanation
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                  {interpretation.currentEmanation}
                </p>
              </div>

              {/* Practical Guidance */}
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-900 dark:text-amber-100">
                  <strong>Practice:</strong> {interpretation.practicalGuidance}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {uniqueInterpretations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            No active pathways detected. Refresh to load current sky data.
          </CardContent>
        </Card>
      )}
    </div>
  );
};