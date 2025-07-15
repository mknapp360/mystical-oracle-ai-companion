import React, { useEffect, useState } from "react";

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

const API_BASE_URL = "https://ephemeris-api-jmjjqa-production.up.railway.app";

const CurrentSky: React.FC = () => {
  const [data, setData] = useState<CurrentSkyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Extract a cleaner location name from OpenStreetMap response
  const extractLocationName = (geocodeResponse: any): string => {
    const { address } = geocodeResponse;
    if (!address) return geocodeResponse.display_name;

    console.log("Available address fields:", Object.keys(address));
    
    // Get the most appropriate locality - prioritize town/city over village
    const locality = address.town || address.city || address.village || address.hamlet;
    
    // Get region (prefer state, then county, avoid district)
    const region = address.state || address.county;
    const country = address.country;

    console.log(`Locality: ${locality}, Region: ${region}, Country: ${country}`);

    // Build clean name: Town, State/County, Country
    if (locality && region && country) {
      return `${locality}, ${region}, ${country}`;
    } else if (locality && region) {
      return `${locality}, ${region}`;
    } else if (locality && country) {
      return `${locality}, ${country}`;
    } else if (locality) {
      return locality;
    }

    // Last resort fallback
    return geocodeResponse.display_name;
  };

  // Fetch location name from lat/lon
  const fetchLocationNameAndSky = async (lat: number, lon: number) => {
    try {
      console.log(`Fetching location for coordinates: ${lat}, ${lon}`);
      
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      
      if (!res.ok) {
        throw new Error(`Geocoding failed: ${res.status} ${res.statusText}`);
      }
      
      const json = await res.json();
      console.log("Full geocode response:", json);
      console.log("Address object:", json.address);
      
      const location = extractLocationName(json);
      
      console.log(`Original display_name: ${json.display_name}`);
      console.log(`Extracted location: ${location}`);
      
      await fetchSkyData(location);
    } catch (err) {
      console.error("Location fetch error:", err);
      setError("Could not determine your location.");
      setLoading(false);
    }
  };

  // Fetch ephemeris data
  const fetchSkyData = async (location: string) => {
    try {
      console.log(`Fetching sky data for: ${location}`);
      
      // Properly encode the location parameter
      const params = new URLSearchParams({ location: location.trim() });
      const url = `${API_BASE_URL}/current-sky?${params.toString()}`;
      
      console.log(`API URL: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
      });

      console.log(`API Response status: ${response.status}`);

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorBody = await response.text();
          if (errorBody) {
            errorMessage += ` - ${errorBody}`;
          }
        } catch (e) {
          // If we can't read the error body, just use the status
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("API Response:", result);
      console.log("API returned location:", result.location);
      
      setData(result);
    } catch (err) {
      console.error("Sky data fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchLocationNameAndSky(latitude, longitude);
        },
        error => {
          console.error("Geolocation error:", error);
          let errorMessage = "Location access denied.";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please allow location access and refresh.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          
          setError(errorMessage);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setError("Geolocation not supported in this browser.");
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading current sky...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="p-4 border rounded-xl shadow-lg bg-white max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2 text-black">Current Sky over {data.location}</h2>
      <p className="text-black"><strong>Moon Phase:</strong> {data.sun_moon.moon_phase}</p>
      <p className="text-black"><strong>Sunrise:</strong> {new Date(data.sun_moon.sunrise).toLocaleTimeString()}</p>
      <p className="text-black"><strong>Sunset:</strong> {new Date(data.sun_moon.sunset).toLocaleTimeString()}</p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-black">Planets</h3>
        <ul className="grid grid-cols-2 gap-2 mt-2 text-black">
          {Object.entries(data.planets).map(([planet, details]) => (
            <li key={planet}>
              <strong>{planet}:</strong> {details.sign} {details.degree_in_sign}° ({details.house})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurrentSky;