import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PLANETARY_SEPHIROT, ZODIAC_PATHS, FOUR_WORLDS, type World } from '@/lib/sephirotic-correspondences';

interface TreeOfLifeProps {
  activePlanets: Record<string, { sign: string; house: string; sephirah: string; world: World }>;
}

// Sephirot positions on the Tree (x, y coordinates in SVG viewBox 0 0 500 700)
// LEFT = Severity, RIGHT = Mercy, MIDDLE = Balance
const SEPHIROT_POSITIONS: Record<string, { x: number; y: number }> = {
  // Middle Pillar (Balance)
  Kether: { x: 250, y: 50 },
  Daath: { x: 250, y: 160 },
  Tiphereth: { x: 250, y: 340 },
  Yesod: { x: 250, y: 550 },
  Malkuth: { x: 250, y: 650 },
  
  // Right Pillar (Mercy) - Masculine/Expanding
  Chokmah: { x: 380, y: 130 },
  Chesed: { x: 380, y: 260 },
  Netzach: { x: 380, y: 450 },
  
  // Left Pillar (Severity) - Feminine/Contracting
  Binah: { x: 120, y: 130 },
  Geburah: { x: 120, y: 260 },
  Hod: { x: 120, y: 450 }
};

// Path connections between Sephiroth
const TREE_PATHS = [
  // Pillars
  ['Kether', 'Tiphereth'],
  ['Tiphereth', 'Yesod'],
  ['Yesod', 'Malkuth'],
  ['Kether', 'Chokmah'],
  ['Chokmah', 'Chesed'],
  ['Chesed', 'Netzach'],
  ['Kether', 'Binah'],
  ['Binah', 'Geburah'],
  ['Geburah', 'Hod'],
  // Horizontals
  ['Chokmah', 'Binah'],
  ['Chesed', 'Geburah'],
  ['Netzach', 'Hod'],
  // Diagonals
  ['Chokmah', 'Tiphereth'],
  ['Binah', 'Tiphereth'],
  ['Chesed', 'Tiphereth'],
  ['Geburah', 'Tiphereth'],
  ['Tiphereth', 'Netzach'],
  ['Tiphereth', 'Hod'],
  ['Netzach', 'Yesod'],
  ['Hod', 'Yesod'],
  ['Netzach', 'Malkuth'],
  ['Hod', 'Malkuth'],
  // Daath connections
  ['Kether', 'Daath'],
  ['Daath', 'Tiphereth']
];

export const TreeOfLifeVisualization: React.FC<TreeOfLifeProps> = ({ activePlanets }) => {
  // Determine which Sephiroth are active
  const activeSephirot = new Set(Object.values(activePlanets).map(p => p.sephirah));
  
  // Get active zodiac signs to highlight paths
  const activeSigns = new Set(Object.values(activePlanets).map(p => p.sign));

  useEffect(() => {
    console.log('=== TREE OF LIFE DEBUG ===');
    console.log('Active Planets:', activePlanets);
    console.log('Active Sephirot:', Array.from(activeSephirot));
    console.log('Active Signs:', Array.from(activeSigns));
    
    // Check each sign for its path
    Array.from(activeSigns).forEach(sign => {
      const pathInfo = ZODIAC_PATHS[sign];
      if (pathInfo) {
        console.log(`✓ ${sign} (${pathInfo.letterName}): ${pathInfo.connects[0]} ↔ ${pathInfo.connects[1]}`);
      } else {
        console.warn(`✗ ${sign}: NO PATH DEFINED`);
      }
    });
  
  console.log('=========================');
}, [activePlanets, activeSephirot, activeSigns]);
  
  // Determine which paths are active based on zodiac signs
  const getPathsForSign = (sign: string) => {
    const pathInfo = ZODIAC_PATHS[sign];
    if (!pathInfo) return null;
    return pathInfo.connects;
  };

  const isPathActive = (from: string, to: string): string | null => {
    for (const sign of activeSigns) {
      const connects = getPathsForSign(sign);
      if (connects && 
          ((connects[0] === from && connects[1] === to) || 
           (connects[0] === to && connects[1] === from))) {
        return sign;
      }
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      <CardHeader>
        <CardTitle className="text-center font-serif">
          The Tree of Life - Current Activation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <svg 
          viewBox="0 0 500 700" 
          className="w-full h-auto max-h-[700px]"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
        >
          {/* Background gradient */}
          <defs>
            <radialGradient id="treeGlow" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </radialGradient>
            
            {/* Glow effect for active spheres */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect width="500" height="700" fill="url(#treeGlow)" />

          {/* Draw paths first (so they appear behind spheres) */}
        
          {TREE_PATHS.map(([from, to], i) => {
            console.log('Checking Chesed-Tiphereth path:', isPathActive('Chesed', 'Tiphereth'));
            const fromPos = SEPHIROT_POSITIONS[from];
            const toPos = SEPHIROT_POSITIONS[to];
            const activeSign = isPathActive(from, to);
            const isActive = activeSign !== null;
            
            return (
              <g key={`path-${i}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={isActive ? '#a855f7' : '#e0e7ff'}
                  strokeWidth={isActive ? 3 : 1.5}
                  opacity={isActive ? 0.8 : 0.3}
                  strokeDasharray={isActive ? '0' : '5,5'}
                />
                {/* Label active paths with zodiac sign */}
                {isActive && activeSign && (
                  <text
                    x={(fromPos.x + toPos.x) / 2}
                    y={(fromPos.y + toPos.y) / 2}
                    fill="#7c3aed"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ textShadow: '0 0 3px white' }}
                  >
                    {ZODIAC_PATHS[activeSign]?.letterName}
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
            const planetsHere = Object.entries(activePlanets)
              .filter(([_, data]) => data.sephirah === name)
              .map(([planet, _]) => planet);

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
                    filter="url(#glow)"
                  />
                )}
                
                {/* Main sphere */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={28}
                  fill={isActive ? color : '#f3f4f6'}
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
                  fill={isActive ? '#1f2937' : '#9ca3af'}
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
                    fill={isActive ? '#7c3aed' : '#9ca3af'}
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
          <text x="120" y="690" fill="#6b7280" fontSize="12" fontStyle="italic" textAnchor="middle">Pillar of Severity</text>
          <text x="250" y="690" fill="#6b7280" fontSize="12" fontStyle="italic" textAnchor="middle">Pillar of Balance</text>
          <text x="380" y="690" fill="#6b7280" fontSize="12" fontStyle="italic" textAnchor="middle">Pillar of Mercy</text>
        </svg>

        {/* Legend */}
        <div className="mt-4 p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-purple-600"></div>
            <span className="text-gray-700 dark:text-gray-300">Active Sephirah (planet present)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-12 h-0.5 bg-purple-400"></div>
            <span className="text-gray-700 dark:text-gray-300">Active Path (zodiac sign connection)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full bg-gray-200 border-2 border-gray-400"></div>
            <span className="text-gray-700 dark:text-gray-300">Inactive Sephirah</span>
          </div>
        </div>

        {/* Active paths list */}
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">
            Active Paths Today:
          </h4>
          <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
            {Array.from(activeSigns).map(sign => {
              const pathInfo = ZODIAC_PATHS[sign];
              if (!pathInfo) return null;
              return (
                <div key={sign} className="flex items-center gap-2">
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {pathInfo.hebrewLetter} {pathInfo.letterName}
                  </span>
                  <span>({sign})</span>
                  <span className="text-gray-500">→</span>
                  <span className="italic">{pathInfo.meaning}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};