// api/current-sky.ts
export const config = {
  runtime: 'edge',
};

const RAILWAY_API_URL = 'https://ephemeris-api-jmjjqa-production.up.railway.app';

export default async function handler(req: Request): Promise<Response> {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Extract location from query params
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');

    if (!location) {
      return new Response(JSON.stringify({ error: 'Location parameter required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[Proxy] Fetching sky data for: ${location}`);

    // Forward request to Railway API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const apiUrl = `${RAILWAY_API_URL}/current-sky?location=${encodeURIComponent(location)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Proxy] Railway API error: ${response.status}`, errorText);
      
      return new Response(JSON.stringify({ 
        error: `Railway API error: ${response.status}`,
        details: errorText 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log(`[Proxy] Successfully fetched data for: ${data.location}`);

    // Return with proper CORS headers and caching
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes
      },
    });

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('[Proxy] Request timeout');
      return new Response(JSON.stringify({ 
        error: 'Request timeout',
        message: 'The ephemeris API took too long to respond' 
      }), {
        status: 504,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.error('[Proxy] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch ephemeris data',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}