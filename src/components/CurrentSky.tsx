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

  // Fetch location name from lat/lon
  const fetchLocationNameAndSky = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const json = await res.json();
      const location = json.display_name;

      fetchSkyData(location);
    } catch (err) {
      setError("Could not determine your location.");
      setLoading(false);
    }
  };

  // Fetch ephemeris data
  const fetchSkyData = async (location: string) => {
    try {
      const params = new URLSearchParams({ location });
      const url = `${API_BASE_URL}/current-sky?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch current sky: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
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
          setError("Location access denied.");
          setLoading(false);
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
    <div className="p-4 border rounded-xl shadow-lg bg-card max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2 text-black">Current Sky over {data.location}</h2>
      <p className="text-black"><strong>Moon Phase:</strong> {data.sun_moon.moon_phase}</p>
      <p className="text-black"><strong>Sunrise:</strong> {new Date(data.sun_moon.sunrise).toLocaleTimeString()}</p>
      <p className="text-black"><strong>Sunset:</strong> {new Date(data.sun_moon.sunset).toLocaleTimeString()}</p>

      <div className="mt-4">
        <h3 className="text-l font-semibold mb-2 text-black">Planets</h3>
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