// src/components/DivineMessageDisplayEnhanced.tsx
// Enhanced display with pathway diagnostics

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  Book, 
  Compass, 
  Eye, 
  Heart, 
  Star, 
  Sun, 
  Moon, 
  Flame, 
  Droplets,
  AlertCircle,
  GitBranch,
  Zap,
  Link
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DivineMessage {
  title: string;
  opening: string;
  shefaFlow: string;
  pathwayGuidance: string;
  aspectGuidance: string;
  illuminatedSpheres: string;
  shadowWork: string;
  worldManifestation: string;
  practicalWisdom: string;
  closingBlessing: string;
  // Enhanced sections:
  isolatedEnergy?: string;
  ungroundedManifestations?: string;
  integrationWork?: string;
}

interface DivineMessageDisplayEnhancedProps {
  message: DivineMessage;
}

export const DivineMessageDisplayEnhanced: React.FC<DivineMessageDisplayEnhancedProps> = ({ message }) => {
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
                <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                The Shefa Flow
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
                <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-indigo-900 dark:text-indigo-100">
                Active Pathways
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.pathwayGuidance}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEW: Isolated Energy Section */}
      {message.isolatedEnergy && (
        <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-gray-900">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold mb-2 text-orange-900 dark:text-orange-100">
                  Isolated Energy: Stranded Sephiroth
                </h3>
                <Alert className="mb-3 border-orange-300 bg-orange-50 dark:bg-orange-950/30">
                  <AlertDescription className="text-sm text-orange-800 dark:text-orange-200">
                    ⚠️ These spheres have planets but no connecting pathways—energy operating in isolation
                  </AlertDescription>
                </Alert>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 whitespace-pre-line">
                  {message.isolatedEnergy}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NEW: Ungrounded Manifestations Section */}
      {message.ungroundedManifestations && (
        <Card className="border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-gray-900">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold mb-2 text-red-900 dark:text-red-100">
                  Ungrounded Pathways: Energy Seeking Vessels
                </h3>
                <Alert className="mb-3 border-red-300 bg-red-50 dark:bg-red-950/30">
                  <AlertDescription className="text-sm text-red-800 dark:text-red-200">
                    ⚡ These pathways are illuminated but connect to inactive spheres—manifestation blocked
                  </AlertDescription>
                </Alert>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 whitespace-pre-line">
                  {message.ungroundedManifestations}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aspect Guidance */}
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
                Planetary Aspects
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.aspectGuidance}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Illuminated Spheres */}
      <Card className="border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                Illuminated Spheres ✨
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.illuminatedSpheres}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shadow Work */}
      <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">
                Shadow Work 🌑
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.shadowWork}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEW: Integration Work */}
      {message.integrationWork && (
        <Card className="border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-white dark:from-teal-950 dark:to-gray-900">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                  <Link className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold mb-2 text-teal-900 dark:text-teal-100">
                  Your Integration Work 🔗
                </h3>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {message.integrationWork}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* World Manifestation */}
      <Card className="border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                <Eye className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-cyan-900 dark:text-cyan-100">
                How Energy Manifests Today
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.worldManifestation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practical Wisdom */}
      <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-green-900 dark:text-green-100">
                Practical Wisdom 🙏
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {message.practicalWisdom}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Closing Blessing */}
      <Card className="border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-purple-950 flex items-center justify-center">
                <Flame className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-purple-900 dark:text-purple-100">
                Blessing
              </h3>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed italic">
                {message.closingBlessing}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DivineMessageDisplayEnhanced;