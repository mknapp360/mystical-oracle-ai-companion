import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Book, Compass, Eye, Heart, Star } from 'lucide-react';

interface DivineMessage {
  title: string;
  opening: string;
  shefaFlow: string;
  pathwayGuidance: string;
  worldManifestation: string;
  practicalWisdom: string;
  closingBlessing: string;
}

interface DivineMessageDisplayProps {
  message: DivineMessage;
}

export const DivineMessageDisplay: React.FC<DivineMessageDisplayProps> = ({ message }) => {
  return (
    <div className="space-y-6">
      {/* Title Card */}
      <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white border-purple-500">
        <CardHeader className="text-center pb-3">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <CardTitle className="font-serif text-2xl">
            {message.title}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Opening */}
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Book className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-purple-900 dark:text-purple-100">
                The Pattern Today
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.opening}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shefa Flow */}
      <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                The Shefa Flow (שפע)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.shefaFlow}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pathway Guidance */}
      <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-indigo-900 dark:text-indigo-100">
                The Sacred Pathways
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.pathwayGuidance}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* World Manifestation */}
      <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                <Heart className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-violet-900 dark:text-violet-100">
                How to Work With This Energy
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.worldManifestation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practical Wisdom */}
      <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-amber-900 dark:text-amber-100">
                Practical Guidance
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.practicalWisdom}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Closing Blessing */}
      <Card className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white border-purple-500">
        <CardContent className="pt-6 pb-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <p className="font-serif text-lg leading-relaxed italic">
              {message.closingBlessing}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};