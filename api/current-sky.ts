import express from 'express';
import cors from 'cors';
import { julian, planetposition, solar, moonposition, sexagesimal as sexa, sidereal, coord } from 'astronomia';

const app = express();
app.use(cors());
app.use(express.json());

// Zodiac signs
const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

type ZodiacPosition = {
  sign: string;
  degrees: number;
  minutes: number;
  decimal: number;
} | null;

type AscMc = {
  degrees: number;
  zodiac: ZodiacPosition;
} | null;

type House = {
  house: number;
  cusp: number;
  zodiac: ZodiacPosition;
};

type AstroHouses = {
  houses: House[];
  ascendant: AscMc;
  midheaven: AscMc;
};

// Convert decimal degrees to zodiac sign and degree
function degreesToZodiac(degrees: number): ZodiacPosition {
  try {
    const normalizedDegrees = ((degrees % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedDegrees / 30);
    const degreesInSign = normalizedDegrees % 30;
    
    if (signIndex >= zodiacSigns.length) {
      console.error('Invalid signIndex:', signIndex);
      return null;
    }

    const zodiacInfo = {
      sign: zodiacSigns[signIndex],
      degrees: Math.floor(degreesInSign),
      minutes: Math.floor((degreesInSign % 1) * 60),
      decimal: degreesInSign
    };
    
    return zodiacInfo;
  } catch (error) {
    console.error('Error in degreesToZodiac:', error);
    return null;
  }
}

// Convert right ascension to ecliptic longitude
function raToEclipticLongitude(ra: number, dec: number, jd: number): number {
  try {
    const obliquity = coord.obliquity(jd);
    const ecl = coord.eqToEcl(ra, dec, obliquity);
    const longitude = (ecl.lon * 180 / Math.PI + 360) % 360;
    return longitude;
  } catch (error) {
    console.error('Error in raToEclipticLongitude:', error);
    return 0;
  }
}

// Calculate basic astrological houses
function calculateAstroHouses(jd: number, lat: number, lon: number): AstroHouses {
  const housesList: House[] = [];
  
  try {
    const lst = sidereal.apparent(jd) + (lon / 15);
    const latRad = lat * Math.PI / 180;
    const obliquity = coord.obliquity(jd);
    
    const lstRad = lst * Math.PI / 12;
    const asc = Math.atan2(Math.cos(lstRad), -Math.sin(lstRad) * Math.cos(obliquity) - Math.tan(latRad) * Math.sin(obliquity));
    const ascDegrees = ((asc * 180 / Math.PI) + 360) % 360;
    
    for (let i = 0; i < 12; i++) {
      const cusp = (ascDegrees + (i * 30)) % 360;
      const cuspZodiac = degreesToZodiac(cusp);
      housesList.push({
        house: i + 1,
        cusp: cusp,
        zodiac: cuspZodiac
      });
    }
    
    const mc = (lst * 15) % 360;
    const mcZodiac = degreesToZodiac(mc);
    const ascZodiac = degreesToZodiac(ascDegrees);
    
    return {
      houses: housesList,
      ascendant: {
        degrees: ascDegrees,
        zodiac: ascZodiac
      },
      midheaven: {
        degrees: mc,
        zodiac: mcZodiac
      }
    };
  } catch (error) {
    console.error('Error in calculateAstroHouses:', error);
    return {
      houses: [],
      ascendant: null,
      midheaven: null
    };
  }
}

// Get current planetary positions
function getCurrentPlanets(lat: number, lon: number) {
  const now = new Date();
  const jd = julian.DateToJD(now);
  const earth = planetposition.earth;
  
  const result = {
    timestamp: now.toISOString(),
    location: { latitude: lat, longitude: lon },
    planets: {},
    houses: [] as House[],
    ascendant: null as AscMc,
    midheaven: null as AscMc
  };
  
  try {
    const sunPos = solar.apparentEquatorial(earth, jd);
    const sunLon = raToEclipticLongitude(sunPos.ra, sunPos.dec, jd);
    const sunZodiac = degreesToZodiac(sunLon);
    
    result.planets['Sun'] = {
      longitude: sunLon,
      zodiac: sunZodiac,
      coordinates: {
        ra: new sexa.RA(sunPos.ra).toString(2),
        dec: new sexa.Angle(sunPos.dec).toString(2)
      }
    };
    
    const moonPos = moonposition.equatorial(jd);
    const moonLon = raToEclipticLongitude(moonPos.ra, moonPos.dec, jd);
    const moonZodiac = degreesToZodiac(moonLon);
    
    result.planets['Moon'] = {
      longitude: moonLon,
      zodiac: moonZodiac,
      coordinates: {
        ra: new sexa.RA(moonPos.ra).toString(2),
        dec: new sexa.Angle(moonPos.dec).toString(2)
      }
    };
    
    const planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    
    for (const planetName of planetNames) {
      try {
        const planet = planetposition[planetName];
        if (planet && typeof planet.position === 'function') {
          const pos = planet.position(jd);
          const lon = (pos.lon * 180 / Math.PI + 360) % 360;
          const zodiac = degreesToZodiac(lon);
          const eqPos = coord.eclToEq(pos.lon, pos.lat, coord.obliquity(jd));
          
          const capitalizedName = planetName.charAt(0).toUpperCase() + planetName.slice(1);
          result.planets[capitalizedName] = {
            longitude: lon,
            zodiac: zodiac,
            coordinates: {
              ra: new sexa.RA(eqPos.ra).toString(2),
              dec: new sexa.Angle(eqPos.dec).toString(2)
            }
          };
        }
      } catch (error) {
        console.error(`Error calculating ${planetName}:`, error);
      }
    }
    
    if (lat !== 0 || lon !== 0) {
      const houses = calculateAstroHouses(jd, lat, lon);
      result.houses = houses.houses;
      result.ascendant = houses.ascendant;
      result.midheaven = houses.midheaven;
    }
  } catch (error) {
    console.error('Error in getCurrentPlanets:', error);
  }
  
  return result;
}

// API Routes
app.get('/api/current-planets', (req, res) => {
  try {
    const latStr = req.query.lat as string | undefined;
    const lonStr = req.query.lon as string | undefined;
    
    const lat = latStr ? parseFloat(latStr) : 0;
    const lon = lonStr ? parseFloat(lonStr) : 0;
    
    const planets = getCurrentPlanets(lat, lon);
    res.json(planets);
  } catch (error) {
    console.error('API Error in /api/current-planets:', error);
    res.status(500).json({ error: 'Failed to calculate planetary positions' });
  }
});

// Get simplified current sky
app.get('/api/current-sky', (req, res) => {
  try {
    const latStr = req.query.lat as string | undefined;
    const lonStr = req.query.lon as string | undefined;
    
    const lat = latStr ? parseFloat(latStr) : 0;
    const lon = lonStr ? parseFloat(lonStr) : 0;
    
    const now = new Date();
    const jd = julian.DateToJD(now);
    const earth = planetposition.earth;
    
    const sunPos = solar.apparentEquatorial(earth, jd);
    const moonPos = moonposition.equatorial(jd);
    
    const sunLon = raToEclipticLongitude(sunPos.ra, sunPos.dec, jd);
    const moonLon = raToEclipticLongitude(moonPos.ra, moonPos.dec, jd);
    
    const sunZodiac = degreesToZodiac(sunLon);
    const moonZodiac = degreesToZodiac(moonLon);
    
    const skyData = {
      timestamp: now.toISOString(),
      location: { latitude: lat, longitude: lon },
      sun: {
        ra: new sexa.RA(sunPos.ra).toString(2),
        dec: new sexa.Angle(sunPos.dec).toString(2),
        zodiac: sunZodiac
      },
      moon: {
        ra: new sexa.RA(moonPos.ra).toString(2),
        dec: new sexa.Angle(moonPos.dec).toString(2),
        zodiac: moonZodiac
      }
    };
    
    res.json(skyData);
  } catch (error) {
    console.error('API Error in /api/current-sky:', error);
    res.status(500).json({ error: 'Failed to calculate sky positions' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('API Error in /api/health:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Basic info endpoint
app.get('/api/info', (req, res) => {
  try {
    res.json({
      name: 'Astrological API',
      version: '1.0.0',
      endpoints: [
        'GET /api/current-planets?lat=40.7128&lon=-74.0060',
        'GET /api/current-sky?lat=40.7128&lon=-74.0060',
        'GET /api/health',
        'GET /api/info'
      ]
    });
  } catch (error) {
    console.error('API Error in /api/info:', error);
    res.status(500).json({ error: 'Failed to retrieve info' });
  }
});

export default app;