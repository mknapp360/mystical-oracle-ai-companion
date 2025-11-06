// src/components/NatalTreeVisualization.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PLANETARY_SEPHIROT } from '@/lib/sephirotic-correspondences';

interface NatalTreeVisualizationProps {
  birthChart: any;
  pathActivations: any[];
}

// Sephirot positions on the Tree
const SEPHIROT_POSITIONS: Record<string, { x: number; y: number }> = {
  Kether: { x: 250, y: 60 },
  Chokmah: { x: 380, y: 140 },
  Binah: { x: 120, y: 140 },
  Daath: { x: 250, y: 200 },
  Chesed: { x: 380, y: 280 },
  Geburah: { x: 120, y: 280 },
  Tiphereth: { x: 250, y: 360 },
  Netzach: { x: 380, y: 480 },
  Hod: { x: 120, y: 480 },
  Yesod: { x: 250, y: 560 },
  Malkuth: { x: 250, y: 650 }
};

// All possible paths on the Tree
const TREE_PATHS: [string, string][] = [
  ['Kether', 'Chokmah'],
  ['Kether', 'Binah'],
  ['Kether', 'Tiphereth'],
  ['Chokmah', 'Binah'],
  ['Chokmah', 'Tiphereth'],
  ['Chokmah', 'Chesed'],
  ['Binah', 'Tiphereth'],
  ['Binah', 'Geburah'],
  ['Chesed', 'Geburah'],
  ['Chesed', 'Tiphereth'],
  ['Chesed', 'Netzach'],
  ['Geburah', 'Tiphereth'],
  ['Geburah', 'Hod'],
  ['Tiphereth', 'Netzach'],
  ['Tiphereth', 'Hod'],
  ['Tiphereth', 'Yesod'],
  ['Netzach', 'Yesod'],
  ['Netzach', 'Malkuth'],
  ['Hod', 'Yesod'],
  ['Hod', 'Malkuth'],
  ['Yesod', 'Malkuth'],
  ['Chokmah', 'Daath'],
  ['Binah', 'Daath'],
  ['Daath', 'Tiphereth']
];

export const NatalTreeVisualization: React.FC<NatalTreeVisualizationProps> = ({ 
  birthChart, 
  pathActivations 
}) => {
  // Determine which Sephiroth are active (have planets)
  const activeSephirot = new Set<string>();
  const planetsInSephirot: Record<string, string[]> = {};
  
  Object.entries(birthChart.natal_planets).forEach(([planet, data]: [string, any]) => {
    const sephirah = PLANETARY_SEPHIROT[planet];
    if (sephirah) {
      activeSephirot.add(sephirah.name);
      if (!planetsInSephirot[sephirah.name]) {
        planetsInSephirot[sephirah.name] = [];
      }
      planetsInSephirot[sephirah.name].push(planet);
    }
  });

  // Determine which paths are illuminated by aspects
  const activePaths = new Set<string>();
  const pathDetails: Record<string, any> = {};
  
  pathActivations.forEach(path => {
    const pathKey = [path.sephirah1, path.sephirah2].sort().join('-');
    activePaths.add(pathKey);
    pathDetails[pathKey] = path;
  });

  // Debug: Log path activations
  React.useEffect(() => {
    console.log('=== NATAL TREE DEBUG ===');
    console.log('Path Activations:', pathActivations);
    console.log('Path Details Keys:', Object.keys(pathDetails));
    console.log('Active Paths Set:', Array.from(activePaths));
  }, [pathActivations]);

  const isPathActive = (from: string, to: string): any | null => {
    const pathKey = [from, to].sort().join('-');
    const path = pathDetails[pathKey];
    if (path) {
      console.log(`Found active path: ${from} ↔ ${to} (${path.illumination})`);
    }
    return path || null;
  };

  const getPathColor = (illumination: string) => {
    switch (illumination) {
      case 'full': return '#bb9258'; // yellow-400
      case 'partial': return '#bb9258'; // blue-400
      case 'shadow': return '#9ca3af'; // gray-400
      default: return '#e5e7eb';
    }
  };

  return (
    <Card style={{ backgroundColor: '#1f2747' }}>
      <CardHeader>
        <CardTitle className="text-center font-serif text-white">
          The Tree of Life - Your Natal Signature
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-8">
        <svg 
          viewBox="0 0 500 760" 
          className="w-full h-auto max-h-[700px]"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
        >
          {/* Background gradient */}
          <defs>
            <radialGradient id="natalTreeGlow" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </radialGradient>
            
            {/* Glow effect for active spheres */}
            <filter id="natalGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect width="500" height="700" fill="#252f55" />

          {/* Draw paths first (so they appear behind spheres) */}
          {TREE_PATHS.map(([from, to], i) => {
            const fromPos = SEPHIROT_POSITIONS[from];
            const toPos   = SEPHIROT_POSITIONS[to];
            const pathData = isPathActive(from, to);

            // If no activation, render nothing
            if (!pathData) return null;

            return (
              <g key={`path-${i}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={getPathColor(pathData.illumination)}
                  strokeWidth={3}
                  opacity={0.95}
                />
                {pathData.hebrewLetter && (
                  <text
                    x={(fromPos.x + toPos.x) / 2}
                    y={(fromPos.y + toPos.y) / 2}
                    fill={getPathColor(pathData.illumination)}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ textShadow: '0 0 3px white' }}
                  >
                    {pathData.hebrewLetter}
                  </text>
                )}
              </g>
            );
          })}

          {/* Draw Sephiroth */}
          {Object.entries(SEPHIROT_POSITIONS).map(([name, pos]) => {
            const isActive = activeSephirot.has(name);
            const sephirahData = Object.values(PLANETARY_SEPHIROT).find(s => s.name === name);
            const color = sephirahData?.color || '#9ca3af';
            const planetsHere = planetsInSephirot[name] || [];

            return (
              <g key={name}>
                {/* Outer glow for active spheres */}
                {isActive && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={35}
                    fill={color}
                    opacity={0.3}
                    filter="url(#natalGlow)"
                  />
                )}
                
                {/* Main sphere */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={28}
                  fill={isActive ? color : '#bb9258'}
                  stroke={isActive ? color : '#d1d5db'}
                  strokeWidth={isActive ? 3 : 2}
                  opacity={isActive ? 1 : 0.5}
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: isActive ? 'pointer' : 'default'
                  }}
                />
                
                {/* Sephirah name */}
                <text
                  x={pos.x}
                  y={pos.y - 38}
                  fill={isActive ? '#bb9258' : '#9ca3af'}
                  fontSize="13"
                  fontWeight={isActive ? 'bold' : 'normal'}
                  textAnchor="middle"
                  fontFamily="serif"
                >
                  {name}
                </text>

                {/* Planet symbols if active */}
                {isActive && planetsHere.length > 0 && (
                  <>
                    {planetsHere.map((planet, idx) => (
                      <text
                        key={planet}
                        x={pos.x}
                        y={pos.y + (idx * 14) - (planetsHere.length * 7) + 7}
                        fill="white"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {planet.substring(0, 2)}
                      </text>
                    ))}
                  </>
                )}

                {/* Hebrew letter below */}
                {sephirahData && (
                  <text
                    x={pos.x}
                    y={pos.y + 45}
                    fill={isActive ? '#bb9258' : '#9ca3af'}
                    fontSize="15"
                    textAnchor="middle"
                    opacity={isActive ? 1 : 0.5}
                  >
                    {sephirahData.hebrew}
                  </text>
                )}
              </g>
            );
          })}

          {/* Three Pillars labels */}
          <text x="120" y="690" fill="#f2f2f2" fontSize="12" fontStyle="italic" textAnchor="middle">Pillar of Severity</text>
          <text x="250" y="690" fill="#f2f2f2" fontSize="12" fontStyle="italic" textAnchor="middle">Pillar of Balance</text>
          <text x="380" y="690" fill="#f2f2f2" fontSize="12" fontStyle="italic" textAnchor="middle">Pillar of Mercy</text>
        </svg>

        {/* Legend */}
        <div className="mt-4 p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-purple-600"></div>
            <span className="text-gray-700 dark:text-gray-300">Active Sephirah (planet present)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-12 h-0.5 bg-yellow-400"></div>
            <span className="text-gray-700 dark:text-gray-300">Fully illuminated path (tight aspect)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-12 h-0.5 bg-blue-400"></div>
            <span className="text-gray-700 dark:text-gray-300">Partially illuminated path</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-12 h-0.5 bg-gray-400"></div>
            <span className="text-gray-700 dark:text-gray-300">Shadow path (challenging aspect)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full bg-gray-200 border-2 border-gray-400"></div>
            <span className="text-gray-700 dark:text-gray-300">Inactive Sephirah</span>
          </div>
        </div>

        {/* Active paths list */}
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">
            Active Paths in Your Natal Chart:
          </h4>
          {pathActivations.length > 0 ? (
            <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
              {pathActivations.slice(0, 8).map((path, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span 
                    className="font-bold"
                    style={{ color: getPathColor(path.illumination) }}
                  >
                    {path.hebrewLetter || '•'}
                  </span>
                  <span className="font-medium">{path.planets[0]} {path.aspectType} {path.planets[1]}</span>
                  <span className="text-gray-500">→</span>
                  <span className="italic">{path.sephirah1} ↔ {path.sephirah2}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">
              No natal aspects found. Check the browser console for debugging information.
            </p>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
          <p className="font-mono">Debug: {pathActivations.length} path activations</p>
          <p className="font-mono">Active sephirot: {Array.from(activeSephirot).join(', ')}</p>
        </div>
      </CardContent>
    </Card>
  );
};