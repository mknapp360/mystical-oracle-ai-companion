// src/components/PersonalizedTransitDisplay.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Target, Zap, Heart } from 'lucide-react';

interface PersonalizedTransitProps {
  transitMessage: {
    title: string;
    personalizedOpening: string;
    keyTransits: string[];
    soulWork: string;
  };
  natalInfo: {
    sunSign: string;
    risingSign: string;
    moonSign: string;
  };
}

export const PersonalizedTransitDisplay: React.FC<PersonalizedTransitProps> = ({ 
  transitMessage, 
  natalInfo 
}) => {
  return (
    <div className="space-y-6">
      {/* Personalized Header */}
      <Card className="bg-gradient-to-br from-rose-900 to-purple-900 text-white border-rose-500">
        <CardHeader className="text-center pb-3">
          <div className="flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-rose-300" />
          </div>
          <CardTitle className="font-serif text-2xl">
            {transitMessage.title}
          </CardTitle>
          <p className="text-sm text-rose-200 mt-2">
            {natalInfo.sunSign} Sun • {natalInfo.risingSign} Rising • {natalInfo.moonSign} Moon
          </p>
        </CardHeader>
      </Card>

      {/* Personalized Opening */}
      <Card className="border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-rose-900 dark:text-rose-100">
                Your Personal Sky Today
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {transitMessage.personalizedOpening}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Transits to Your Chart */}
      {transitMessage.keyTransits.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-gray-900">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold mb-3 text-amber-900 dark:text-amber-100">
                  Transits Activating Your Natal Chart
                </h3>
                <div className="space-y-3">
                  {transitMessage.keyTransits.map((transit, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-amber-200 dark:border-amber-800"
                    >
                      <p 
                        className="text-sm text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: transit.replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>') }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Soul Work */}
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-purple-900 dark:text-purple-100">
                Your Soul Work Today
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {transitMessage.soulWork}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Note about personalization */}
      <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <CardContent className="pt-4">
          <p className="text-xs text-center text-gray-600 dark:text-gray-400 italic">
            This reading is calculated specifically for your birth chart. The transits above show how today's planetary positions activate your natal placements, creating a unique spiritual weather pattern just for you. 🌟
          </p>
        </CardContent>
      </Card>
    </div>
  );
};