import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlanetData {
  sign: string;
  degree_in_sign: number;
  house: string;
}

interface CurrentSkyData {
  location: string;
  sun_moon: {
    sunrise: string;
    sunset: string;
    moon_phase: string;
  };
  planets: {
    [key: string]: PlanetData;
  };
}

// Constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const GEOLOCATION_TIMEOUT = 10000;

const CurrentSky: React.FC = () => {
  const [data, setData] = useState<CurrentSkyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [lastLocation, setLastLocation] = useState<string>("");

  // Validate API response
  const validateSkyData = (data: any): data is CurrentSkyData => {
    return (
      data &&
      typeof data.location === 'string' &&
      data.sun_moon &&
      typeof data.sun_moon.moon_phase === 'string' &&
      data.sun_moon.sunrise &&
      data.sun_moon.sunset &&
      data.planets &&
      typeof data.planets === 'object'
    );
  };

  // Extract location name with smart hierarchy
  const extractLocationName = (geocodeResponse: any): string => {
    const { address } = geocodeResponse;
    if (!address) return geocodeResponse.display_name;

    // Priority hierarchy for locality
    const locality = address.city || address.town || address.village || 
                     address.hamlet || address.suburb;
    const region = address.state || address.county || address.region;
    const country = address.country;

    // Build clean name
    const parts = [locality, region].filter(Boolean);
    
    // Only add country if we have minimal other info
    if (parts.length < 2 && country) {
      parts.push(country);
    }
    
    return parts.join(', ') || geocodeResponse.display_name;
  };

  // Fetch with retry logic
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (response.ok) return response;
        
        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Rate limited or server error - retry with exponential backoff
        if (i < retries - 1) {
          await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
          continue;
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        if (i === retries - 1) throw err;
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    throw new Error('Max retries exceeded');
  };

  // Fetch location name from coordinates
  const fetchLocationNameAndSky = async (lat: number, lon: number) => {
    try {
      const res = await fetchWithRetry(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          method: 'GET',
          headers: {
            'User-Agent': 'TarotPathwork/1.0', // Required by Nominatim
          }
        },
        2 // Only 2 retries for geocoding
      );
      
      const json = await res.json();
      const location = extractLocationName(json);
      
      await fetchSkyData(location);
    } catch (err) {
      console.error("Location fetch error:", err);
      setError("Could not determine your location. Please try again.");
      setLoading(false);
    }
  };

  // Fetch ephemeris data with caching
  const fetchSkyData = async (location: string, forceRefresh = false) => {
    try {
      // Check cache unless force refresh
      const now = Date.now();
      if (!forceRefresh && 
          lastLocation === location && 
          now - lastFetch < CACHE_DURATION && 
          data) {
        console.log('Using cached data');
        setLoading(false);
        return;
      }

      console.log(`Fetching sky data for: ${location}`);
      
      // Build the Railway URL first
      const railwayUrl = `https://ephemeris-api-jmjjqa-production.up.railway.app/current-sky?location=${encodeURIComponent(location.trim())}`;
      
      // Then wrap it in the CORS proxy
      const url = `https://corsproxy.io/?${encodeURIComponent(railwayUrl)}`;

      const response = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      // Validate response
      if (!validateSkyData(result)) {
        throw new Error('Invalid data structure from API');
      }

      console.log("API Response:", result);
      
      setData(result);
      setLastFetch(now);
      setLastLocation(location);
      setError(null);
    } catch (err: any) {
      console.error("Sky data fetch error:", err);
      
      // Provide helpful error messages
      let errorMessage = "Failed to fetch sky data";
      if (err.message.includes('timeout')) {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.message.includes('404')) {
        errorMessage = "Location not found. Try a different location.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check geolocation permission
  const checkLocationPermission = async (): Promise<boolean> => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        return result.state !== 'denied';
      } catch {
        return true; // If we can't check, assume it's okay to try
      }
    }
    return true;
  };

  // Request geolocation
  const requestLocation = async () => {
    setLoading(true);
    setError(null);

    const canRequest = await checkLocationPermission();
    if (!canRequest) {
      setError("Location access is blocked. Please enable it in your browser settings.");
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocationNameAndSky(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Location access denied.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Manual refresh
  const handleRefresh = () => {
    if (lastLocation) {
      setLoading(true);
      fetchSkyData(lastLocation, true);
    } else {
      requestLocation();
    }
  };

  // Initial load
  useEffect(() => {
    requestLocation();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-4 border rounded-xl shadow-lg bg-card max-w-xl mx-auto mt-6">
        <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-6" />
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-5 w-1/3 mb-2" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              onClick={handleRefresh} 
              size="sm" 
              variant="outline"
              className="ml-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // No data fallback
  if (!data) return null;

  const cacheAge = Math.floor((Date.now() - lastFetch) / 1000);
  const showRefresh = cacheAge > 60; // Show refresh after 1 minute

  return (
    <div className="p-4 border rounded-xl shadow-lg bg-card max-w-xl mx-auto mt-6 relative">
      {/* Refresh button */}
      {showRefresh && (
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      )}

      <div className="flex items-center justify-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl text-center font-semibold text-black">Current Sky</h2>
      </div>
      
      <h3 className="text-lg text-center font-medium mb-4 text-black">{data.location}</h3>

      <div className="space-y-2 mb-4">
        <p className="text-black">
          <strong>Moon Phase:</strong> {data.sun_moon.moon_phase}
        </p>
        <p className="text-black">
          <strong>Sunrise:</strong> {new Date(data.sun_moon.sunrise).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
        <p className="text-black">
          <strong>Sunset:</strong> {new Date(data.sun_moon.sunset).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-black">Planets</h3>
        <ul className="grid grid-cols-2 gap-2 mt-2 text-sm text-black">
          {Object.entries(data.planets).map(([planet, details]) => (
            <li key={planet} className="p-2 bg-muted/50 rounded-md">
              <strong className="capitalize">{planet}:</strong> {details.sign} {Math.round(details.degree_in_sign)}° ({details.house})
            </li>
          ))}
        </ul>
      </div>

      {/* Cache timestamp */}
      {cacheAge > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Updated {cacheAge < 60 ? `${cacheAge}s` : `${Math.floor(cacheAge / 60)}m`} ago
        </p>
      )}
    </div>
  );
};

export default CurrentSky;