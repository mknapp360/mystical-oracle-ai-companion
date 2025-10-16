// src/components/PlanetaryPositionsDisplay.tsx
// Beautiful display of complete planetary data

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type PlanetaryPosition } from '@/lib/birthChartService';
import { ArrowLeftRight, MapPin, Globe } from 'lucide-react';

interface PlanetaryPositionsDisplayProps {
  planetaryPositions: Record<string, PlanetaryPosition>;
}

const PLANET_EMOJI: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
};

const PLANET_COLORS: Record<string, string> = {
  Sun: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  Moon: 'bg-blue-100 border-blue-300 text-blue-900',
  Mercury: 'bg-orange-100 border-orange-300 text-orange-900',
  Venus: 'bg-pink-100 border-pink-300 text-pink-900',
  Mars: 'bg-red-100 border-red-300 text-red-900',
  Jupiter: 'bg-purple-100 border-purple-300 text-purple-900',
  Saturn: 'bg-gray-100 border-gray-300 text-gray-900',
  Uranus: 'bg-cyan-100 border-cyan-300 text-cyan-900',
  Neptune: 'bg-indigo-100 border-indigo-300 text-indigo-900',
  Pluto: 'bg-slate-100 border-slate-300 text-slate-900',
};

export const PlanetaryPositionsDisplay: React.FC<PlanetaryPositionsDisplayProps> = ({ 
  planetaryPositions 
}) => {
  const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const retrogradePlanets = Object.entries(planetaryPositions)
    .filter(([_, pos]) => pos.isRetrograde)
    .map(([name, _]) => name);

  return (
    <div className="space-y-4">
      {/* Retrograde Summary */}
      {retrogradePlanets.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-amber-900">
                Retrograde Planets:
              </span>
              <div className="flex gap-2 flex-wrap">
                {retrogradePlanets.map(planet => (
                  <Badge key={planet} className="bg-amber-100 border-amber-300 text-amber-900">
                    {PLANET_EMOJI[planet]} {planet} ℞
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planetary Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Complete Planetary Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {planetOrder.map(planetName => {
              const pos = planetaryPositions[planetName];
              if (!pos) return null;

              return (
                <div
                  key={planetName}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {/* Planet Icon */}
                  <div className="text-3xl pt-1">
                    {PLANET_EMOJI[planetName]}
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-lg">{planetName}</span>
                      {pos.isRetrograde && (
                        <Badge className="bg-amber-100 border-amber-300 text-amber-900">
                          ℞ Retrograde
                        </Badge>
                      )}
                      <Badge className={PLANET_COLORS[planetName]}>
                        {pos.sign} {pos.degreeInSign.toFixed(2)}°
                      </Badge>
                      <Badge variant="outline">
                        {pos.house}
                      </Badge>
                    </div>

                    {/* Detailed Position */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Absolute:</span>
                        <span className="ml-1 font-mono">{pos.absoluteDegree.toFixed(2)}°</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ecliptic Lat:</span>
                        <span className="ml-1 font-mono">{pos.eclipticLatitude.toFixed(4)}°</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="ml-1 font-mono">{pos.distanceAU.toFixed(3)} AU</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Coordinates:</span>
                        <span className="ml-1 font-mono text-[10px]">
                          ({pos.geocentricPosition.x.toFixed(2)}, {pos.geocentricPosition.y.toFixed(2)}, {pos.geocentricPosition.z.toFixed(2)})
                        </span>
                      </div>
                    </div>

                    {/* Visual Position Bar */}
                    <div className="relative h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white border-2 border-black"
                        style={{ left: `${(pos.absoluteDegree / 360) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="font-semibold">Absolute Degree:</span>
              <p className="text-muted-foreground">Position 0-360° around zodiac</p>
            </div>
            <div>
              <span className="font-semibold">Ecliptic Latitude:</span>
              <p className="text-muted-foreground">Degrees above/below ecliptic plane</p>
            </div>
            <div>
              <span className="font-semibold">Distance (AU):</span>
              <p className="text-muted-foreground">Astronomical Units from Earth</p>
            </div>
            <div>
              <span className="font-semibold">℞ Retrograde:</span>
              <p className="text-muted-foreground">Apparent backward motion</p>
            </div>
            <div>
              <span className="font-semibold">Coordinates:</span>
              <p className="text-muted-foreground">3D geocentric position (X,Y,Z)</p>
            </div>
            <div>
              <span className="font-semibold">Position Bar:</span>
              <p className="text-muted-foreground">Visual zodiac position (Aries→Pisces)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};