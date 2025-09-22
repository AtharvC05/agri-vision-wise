import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    console.log('API Key status:', apiKey ? 'Found' : 'Not found');
    console.log('API Key first 10 chars:', apiKey ? apiKey.substring(0, 10) + '...' : 'None');
    
    if (!apiKey) {
      console.error('OPENWEATHER_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'Weather service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching weather for location: ${location}`);
    
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
    );

    if (!weatherResponse.ok) {
      console.error(`OpenWeather API error: ${weatherResponse.status} ${weatherResponse.statusText}`);
      const errorData = await weatherResponse.text();
      console.error('OpenWeather error details:', errorData);
      
      return new Response(
        JSON.stringify({ error: 'Failed to fetch weather data' }),
        { 
          status: weatherResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data fetched successfully');

    // Transform OpenWeather data for agricultural use
    const transformedData = {
      current: {
        temperature: `${Math.round(weatherData.list[0].main.temp)}°C`,
        humidity: `${weatherData.list[0].main.humidity}%`,
        condition: weatherData.list[0].weather[0].description,
        rainfall: `${weatherData.list[0].rain?.['3h'] || 0} mm`,
        windSpeed: `${Math.round(weatherData.list[0].wind.speed * 3.6)} km/h`,
        et: `${(weatherData.list[0].main.temp * 0.15).toFixed(1)} mm/day`, // Simple ET calculation
        pressure: `${weatherData.list[0].main.pressure} hPa`,
        uvIndex: "7" // OpenWeather doesn't provide UV in 5-day forecast
      },
      forecast: weatherData.list.slice(0, 40).filter((_, index) => index % 8 === 0).slice(0, 5).map((item: any, index: number) => {
        const date = new Date(item.dt * 1000);
        const dateStr = index === 0 ? "Today" : index === 1 ? "Tomorrow" : `Day ${index + 1}`;
        
        return {
          date: dateStr,
          highTemp: Math.round(item.main.temp_max),
          lowTemp: Math.round(item.main.temp_min),
          condition: item.weather[0].description,
          humidity: `${item.main.humidity}%`,
          rainfall: `${item.rain?.['3h'] || 0} mm`,
          windSpeed: `${Math.round(item.wind.speed * 3.6)} km/h`,
          pressure: `${item.main.pressure} hPa`
        };
      })
    };

    return new Response(
      JSON.stringify(transformedData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in weather function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});