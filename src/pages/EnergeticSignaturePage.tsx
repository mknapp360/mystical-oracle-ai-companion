// src/pages/EnergeticSignaturePage.tsx
// ENHANCED with Tree of Life Visualization and Four Worlds Display

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Calendar, MapPin, Flame, Droplet, Wind, Mountain } from 'lucide-react';
import { PLANETARY_SEPHIROT, ZODIAC_PATHS, FOUR_WORLDS, determineWorld } from '@/lib/sephirotic-correspondences';
import { getUserBirthChart, type BirthChartData } from '@/lib/birthChartService';
import { BirthChartForm } from '@/components/BirthChartForm';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  calculatePathActivations, 
  identifyRetrogradeThemes, 
  detectAspectPatterns 
} from '@/lib/pathActivationCalculator';
import { 
  PathActivationSection, 
  RetrogradeThemesSection, 
  AspectPatternsSection 
} from '@/components/PathActivationDisplay';
import { NatalTreeVisualization } from '@/components/NatalTreeVisualization';
import { NatalSignatureReport } from '@/components/NatalSignatureReport';


interface PlanetaryDetail {
  planet: string;
  sephirah: string;
  sign: string;
  degree: string;
  element: string;
  primaryWorld: string;
}

const getPillar = (sephirahName: string): string => {
  const leftPillar = ['Binah', 'Geburah', 'Hod'];
  const rightPillar = ['Chokmah', 'Chesed', 'Netzach'];
  const middlePillar = ['Kether', 'Tiphereth', 'Yesod', 'Malkuth', 'Daath'];
  
  if (leftPillar.includes(sephirahName)) return 'Left';
  if (rightPillar.includes(sephirahName)) return 'Right';
  if (middlePillar.includes(sephirahName)) return 'Middle';
  return 'Middle';
};

const EnergeticSignaturePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        
        if (data.user) {
          // FIXED: Complete the getUserBirthChart call with user ID
          const chart = await getUserBirthChart(data.user.id);
          setBirthChart(chart);
        }
      } catch (error) {
        console.error('Error fetching user or birth chart:', error);
      } finally {
        // FIXED: Always set loading to false
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const calculateSignature = (chart: BirthChartData) => {
    const activeSephirot = new Set<string>();
    const worldScores = { Atziluth: 0, Briah: 0, Yetzirah: 0, Assiah: 0 };
    const planetaryDetails: PlanetaryDetail[] = [];
    const pillarCount = { Left: 0, Right: 0, Middle: 0 };

    Object.entries(chart.natal_planets).forEach(([planet, data]) => {
      const sephirah = PLANETARY_SEPHIROT[planet];
      const path = ZODIAC_PATHS[data.sign];
      
      if (!sephirah) return;

      const worlds = determineWorld(planet, data.sign, data.house);
      activeSephirot.add(sephirah.name);
      
      worldScores[worlds.primary] += 3;
      worldScores[worlds.influences[0]] += 2;

      const pillar = getPillar(sephirah.name);
      pillarCount[pillar as 'Left' | 'Right' | 'Middle']++;

      planetaryDetails.push({
        planet,
        sephirah: sephirah.name,
        sign: data.sign,
        degree: data.degree_in_sign.toFixed(1),
        element: path?.hebrewLetter ? getSignElement(data.sign) : 'unknown',
        primaryWorld: worlds.primary
      });
    });

    const totalScore = Object.values(worldScores).reduce((a, b) => a + b, 0);
    const worldPercentages = Object.fromEntries(
      Object.entries(worldScores).map(([world, score]) => [
        world,
        ((score / totalScore) * 100).toFixed(1)
      ])
    );

    const dominantWorld = Object.entries(worldScores).sort((a, b) => b[1] - a[1])[0][0];
    const spread = Math.max(...Object.values(worldScores)) - Math.min(...Object.values(worldScores));
    const isBalanced = spread <= (totalScore * 0.15);

    return {
      activeSephirot: Array.from(activeSephirot),
      worldPercentages,
      dominantWorld,
      planetaryDetails,
      pillarCount,
      isBalanced
    };
  };

  const getSignElement = (sign: string): string => {
    const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
    const airSigns = ['Gemini', 'Libra', 'Aquarius'];
    const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
    
    if (fireSigns.includes(sign)) return 'Fire';
    if (waterSigns.includes(sign)) return 'Water';
    if (airSigns.includes(sign)) return 'Air';
    if (earthSigns.includes(sign)) return 'Earth';
    return 'Air';
  };

  const worldIcons = {
    Atziluth: <Flame className="w-5 h-5 text-white" />,
    Briah: <Wind className="w-5 h-5 text-white" />,
    Yetzirah: <Droplet className="w-5 h-5 text-white" />,
    Assiah: <Mountain className="w-5 h-5 text-white" />
  };

  const worldColors = {
    Atziluth: 'from-amber-500 to-orange-600',
    Briah: 'from-sky-400 to-blue-500',
    Yetzirah: 'from-purple-400 to-indigo-500',
    Assiah: 'from-emerald-600 to-green-700'
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pb-24 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please sign in to view your natal energetic signature.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!birthChart) {
    return (
      <div className="container mx-auto px-4 py-8 pb-24">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-7 h-7 text-purple-600" />
              Natal Energetic Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Enter your birth information to calculate your natal energetic signature.
            </p>
            <BirthChartForm 
              userId={user.id}
              onSave={(chart) => setBirthChart(chart)} 
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const signature = calculateSignature(birthChart);
  const { formattedDate, formattedTime } = formatBirthDateTime(
  birthChart.birth_date_time,
  birthChart.birth_timezone
);

  // Calculate enhanced features
  console.log('=== BIRTH CHART DATA ===');
  console.log('Has natal_aspects?', !!birthChart.natal_aspects);
  console.log('natal_aspects length:', birthChart.natal_aspects?.length || 0);
  console.log('natal_aspects:', birthChart.natal_aspects);
  
  const pathActivations = birthChart.natal_aspects 
    ? calculatePathActivations(birthChart.natal_aspects) 
    : [];
  const retrogradeThemes = identifyRetrogradeThemes(birthChart);
  const aspectPatterns = birthChart.natal_aspects 
    ? detectAspectPatterns(birthChart.natal_aspects, birthChart) 
    : [];
  
  console.log('Path activations calculated:', pathActivations.length);

  return (
    <div className="container mx-auto px-4 py-8 pb-24 space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-7 h-7 text-purple-600" />
            Natal Energetic Signature
          </CardTitle>
          <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formattedDate} at {formattedTime}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {birthChart.birth_city}, {birthChart.birth_country}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tree">Tree of Life</TabsTrigger>
          <TabsTrigger value="patterns">Life Patterns</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Four Worlds Activation - Similar to CurrentSky */}
          <Card>
            <CardHeader>
              <CardTitle>Four Worlds Activation</CardTitle>
              {signature.isBalanced && (
                <p className="text-sm text-muted-foreground mt-2">
                  ⚖️ <strong>Quaternary Balance:</strong> All worlds nearly equal—balanced access to all levels.
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* World Percentage Bars */}
              <div className="space-y-3">
                {Object.entries(signature.worldPercentages).map(([world, percentage]) => {
                  const worldInfo = FOUR_WORLDS[world as keyof typeof FOUR_WORLDS];
                  return (
                    <div key={world} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-black flex items-center gap-2">
                          {worldIcons[world as keyof typeof worldIcons]}
                          {worldInfo.name} {worldInfo.hebrew}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(Number(percentage))}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: worldInfo.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Planetary Details */}
              <div className="space-y-2 mt-6">
                <h4 className="font-semibold text-sm mb-3">Planetary Placements</h4>
                {signature.planetaryDetails.map((detail) => (
                  <div key={detail.planet} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold w-20">{detail.planet}</div>
                      <div className="text-muted-foreground">{detail.sign} {detail.degree}°</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div><span className="font-medium">{detail.sephirah}</span></div>
                      <div className={`px-2 py-1 rounded text-xs bg-gradient-to-r ${
                        worldColors[detail.primaryWorld as keyof typeof worldColors]
                      } text-white`}>
                        {detail.primaryWorld}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pillar Balance */}
          <Card>
            <CardHeader>
              <CardTitle>Pillar Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(signature.pillarCount).map(([pillar, count]) => (
                  <div key={pillar} className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{count}</div>
                    <div className="text-sm font-medium mt-1">{pillar}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {pillar === 'Left' && 'Severity'}
                      {pillar === 'Right' && 'Mercy'}
                      {pillar === 'Middle' && 'Balance'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm space-y-2">
                {signature.pillarCount.Middle >= 4 && (
                  <p>🎯 <strong>Middle Pillar:</strong> Natural integrator—soul work involves bridging polarities.</p>
                )}
                {signature.pillarCount.Left > signature.pillarCount.Right + 1 && (
                  <p>⚖️ <strong>Left Emphasis:</strong> Structure & discipline. Builder archetype.</p>
                )}
                {signature.pillarCount.Right > signature.pillarCount.Left + 1 && (
                  <p>💫 <strong>Right Emphasis:</strong> Grace & expansion. Visionary archetype.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tree of Life Tab */}
        <TabsContent value="tree" className="mt-6">
          <NatalTreeVisualization 
            birthChart={birthChart} 
            pathActivations={pathActivations} 
          />
          
          {/* Path Activation Details */}
          {pathActivations.length > 0 && (
            <div className="mt-6">
              <PathActivationSection paths={pathActivations} />
            </div>
          )}
        </TabsContent>

        {/* Life Patterns Tab */}
        <TabsContent value="patterns" className="space-y-6 mt-6">
          {/* Aspect Patterns */}
          {aspectPatterns.length > 0 && (
            <AspectPatternsSection patterns={aspectPatterns} />
          )}

          {/* Retrograde Themes */}
          <RetrogradeThemesSection themes={retrogradeThemes} />
        </TabsContent>

        {/* NEW: Report Tab */}
        <TabsContent value="report" className="mt-6">
          <NatalSignatureReport
            birthChart={birthChart}
            signature={signature}
            pathActivations={pathActivations}
            retrogradeThemes={retrogradeThemes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnergeticSignaturePage;

function formatBirthDateTime(birth_date_time: string, birth_timezone: string): { formattedDate: any; formattedTime: any; } {
  throw new Error('Function not implemented.');
}
