// src/components/PathActivationDisplay.tsx
// Display components for the enhanced natal signature

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Sparkles, AlertTriangle, Star } from 'lucide-react';
import { type PathActivation, type AspectPattern, type RetrogradeTheme } from '@/lib/pathActivationCalculator';

// Path Activation Display
export const PathActivationSection: React.FC<{ paths: PathActivation[] }> = ({ paths }) => {
  const fullPaths = paths.filter(p => p.illumination === 'full');
  const partialPaths = paths.filter(p => p.illumination === 'partial');
  const shadowPaths = paths.filter(p => p.illumination === 'shadow');

  const getIlluminationColor = (illumination: string) => {
    switch (illumination) {
      case 'full': return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      case 'partial': return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'shadow': return 'bg-gray-100 border-gray-300 text-gray-900';
      default: return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'harmonious': return <Star className="w-4 h-4 text-green-600" />;
      case 'challenging': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Zap className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Path Activation: How Your Tree of Life Functions
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Aspects between planets illuminate the paths connecting Sephirot. These active pathways show how energy flows through your spiritual architecture.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{fullPaths.length}</div>
            <div className="text-xs text-yellow-600">Fully Illuminated</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{partialPaths.length}</div>
            <div className="text-xs text-blue-600">Partially Lit</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-700">{shadowPaths.length}</div>
            <div className="text-xs text-gray-600">Shadow Work</div>
          </div>
        </div>

        {/* Fully Illuminated Paths */}
        {fullPaths.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Fully Illuminated Paths (Your Natural Strengths)
            </h4>
            <div className="space-y-3">
              {fullPaths.map((path, idx) => (
                <div key={idx} className="p-4 bg-yellow-50/50 dark:bg-yellow-950/10 rounded-lg border border-yellow-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getQualityIcon(path.quality)}
                      <span className="font-medium">{path.sephirah1}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{path.sephirah2}</span>
                    </div>
                    <Badge className={getIlluminationColor(path.illumination)}>
                      {path.aspectType}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {path.planets[0]} {path.aspectType} {path.planets[1]} ({path.orb.toFixed(1)}° orb)
                  </div>
                  {path.hebrewLetter && (
                    <div className="text-xs bg-white dark:bg-gray-900 p-2 rounded border">
                      <span className="font-semibold">{path.hebrewLetter}</span> • {path.tarotCard} • {path.meaning}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partially Illuminated Paths */}
        {partialPaths.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-500" />
              Partially Illuminated Paths (Developing Strengths)
            </h4>
            <div className="space-y-3">
              {partialPaths.map((path, idx) => (
                <div key={idx} className="p-4 bg-blue-50/50 dark:bg-blue-950/10 rounded-lg border border-blue-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getQualityIcon(path.quality)}
                      <span className="font-medium">{path.sephirah1}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{path.sephirah2}</span>
                    </div>
                    <Badge className={getIlluminationColor(path.illumination)}>
                      {path.aspectType}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {path.planets[0]} {path.aspectType} {path.planets[1]} ({path.orb.toFixed(1)}° orb)
                  </div>
                  {path.hebrewLetter && (
                    <div className="text-xs bg-white dark:bg-gray-900 p-2 rounded border">
                      <span className="font-semibold">{path.hebrewLetter}</span> • {path.tarotCard} • {path.meaning}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shadow Paths */}
        {shadowPaths.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Shadow Paths (Growth Through Tension)
            </h4>
            <div className="space-y-3">
              {shadowPaths.map((path, idx) => (
                <div key={idx} className="p-4 bg-amber-50/50 dark:bg-amber-950/10 rounded-lg border border-amber-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getQualityIcon(path.quality)}
                      <span className="font-medium">{path.sephirah1}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{path.sephirah2}</span>
                    </div>
                    <Badge className={getIlluminationColor(path.illumination)}>
                      {path.aspectType}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {path.planets[0]} {path.aspectType} {path.planets[1]} • This path requires conscious work to illuminate
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Retrograde Themes Display
export const RetrogradeThemesSection: React.FC<{ themes: RetrogradeTheme[] }> = ({ themes }) => {
  if (themes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Retrograde Influence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No retrograde planets in your natal chart. All planetary energies express outwardly and directly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ℞ Retrograde Themes: Your Introspective Powers
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {themes.length} {themes.length === 1 ? 'planet' : 'planets'} retrograde at birth. These energies process internally, creating deep wisdom through reflection.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {themes.map((theme, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-bold text-lg">{theme.planet} ℞</span>
                <span className="text-sm text-muted-foreground ml-2">
                  in {theme.sign} • {theme.house}
                </span>
              </div>
              <Badge variant="outline">{theme.sephirah}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-semibold text-purple-700 dark:text-purple-300">Theme:</span>
                <span className="ml-2">{theme.theme}</span>
              </div>
              <div className="text-sm bg-purple-50 dark:bg-purple-950/30 p-3 rounded border border-purple-100 dark:border-purple-900">
                <span className="font-semibold">Guidance:</span>
                <p className="mt-1 text-muted-foreground">{theme.guidance}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Aspect Patterns Display
export const AspectPatternsSection: React.FC<{ patterns: AspectPattern[] }> = ({ patterns }) => {
  if (patterns.length === 0) {
    return null;
  }

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'grand_trine': return 'from-green-500 to-emerald-600';
      case 't_square': return 'from-orange-500 to-red-600';
      case 'grand_cross': return 'from-purple-500 to-indigo-600';
      case 'stellium': return 'from-yellow-500 to-amber-600';
      case 'yod': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'grand_trine': return '△';
      case 't_square': return '⊤';
      case 'grand_cross': return '✕';
      case 'stellium': return '✦';
      default: return '◆';
    }
  };

  const getPatternTitle = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Dominant Patterns: Your Life Themes
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Major aspect configurations that shape your destiny and define your soul's work.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {patterns.map((pattern, idx) => (
          <div key={idx} className={`p-4 rounded-lg bg-gradient-to-r ${getPatternColor(pattern.type)} text-white`}>
            <div className="flex items-start gap-3">
              <div className="text-3xl font-bold opacity-50">
                {getPatternIcon(pattern.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">
                  {getPatternTitle(pattern.type)}
                </h4>
                <p className="text-sm opacity-90 mb-2">
                  {pattern.description}
                </p>
                <div className="text-xs opacity-75 mb-3">
                  Sephirot: {pattern.sephirot.join(' • ')}
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded text-sm">
                  <p className="font-semibold mb-1">Soul Work:</p>
                  <p>{pattern.guidance}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};