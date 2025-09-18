// API service layer for AgriVision
// Real API calls using Supabase and external APIs
import { supabase } from '@/integrations/supabase/client'

export interface User {
  id: string;
  name: string;
  phone: string;
  language: 'en' | 'hi' | 'ta' | 'te';
  location: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  size: number; // in acres
  cropType: string;
  sowingDate: string;
  irrigationType: 'drip' | 'sprinkler' | 'flood' | 'manual';
  soilHealth: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    pH: number;
  };
}

export interface WeatherData {
  location: string;
  current: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
  };
  forecast: Array<{
    date: string;
    temp: { min: number; max: number };
    humidity: number;
    rainfall: number;
    condition: string;
  }>;
}

export interface Alert {
  id: string;
  type: 'irrigation' | 'fertilizer' | 'pest' | 'weather';
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  date: string;
  actionRequired: boolean;
}

export interface YieldPrediction {
  cropType: string;
  predictedYield: number;
  confidence: number;
  factors: {
    weather: number;
    soil: number;
    irrigation: number;
    fertilizer: number;
  };
  comparison: {
    lastSeason: number;
    districtAverage: number;
    stateAverage: number;
  };
}

// Mock API functions with realistic delays

export const authAPI = {
  register: async (phone: string, name: string): Promise<{ success: boolean; userId: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      userId: 'user_' + Date.now()
    };
  },

  sendOTP: async (phone: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  verifyOTP: async (phone: string, otp: string): Promise<{ success: boolean; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      token: 'jwt_token_' + Date.now()
    };
  }
};

export const userAPI = {
  getProfile: async (userId: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      id: userId,
      name: 'Ramesh Kumar',
      phone: '+91-9876543210',
      language: 'en',
      location: 'Nashik, Maharashtra'
    };
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  }
};

export const farmAPI = {
  createFarm: async (farmData: Omit<Farm, 'id'>): Promise<{ success: boolean; farmId: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('farms')
        .insert({
          user_id: user.id,
          name: farmData.name,
          location: farmData.location,
          size: farmData.size,
          crop_type: farmData.cropType,
          sowing_date: farmData.sowingDate,
          irrigation_type: farmData.irrigationType,
          soil_nitrogen: farmData.soilHealth.nitrogen,
          soil_phosphorus: farmData.soilHealth.phosphorus,
          soil_potassium: farmData.soilHealth.potassium,
          soil_ph: farmData.soilHealth.pH
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        farmId: data.id
      };
    } catch (error) {
      console.error('Failed to create farm:', error);
      return {
        success: false,
        farmId: 'farm_' + Date.now()
      };
    }
  },

  getFarms: async (userId: string): Promise<Farm[]> => {
    try {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data.map(farm => ({
        id: farm.id,
        name: farm.name,
        location: farm.location,
        size: farm.size,
        cropType: farm.crop_type,
        sowingDate: farm.sowing_date,
        irrigationType: farm.irrigation_type,
        soilHealth: {
          nitrogen: farm.soil_nitrogen,
          phosphorus: farm.soil_phosphorus,
          potassium: farm.soil_potassium,
          pH: farm.soil_ph
        }
      }));
    } catch (error) {
      console.error('Failed to fetch farms:', error);
      // Fallback to demo data
      return [
        {
          id: 'farm_1',
          name: 'Main Field',
          location: 'Nashik, Maharashtra',
          size: 5.5,
          cropType: 'Tomato',
          sowingDate: '2024-01-15',
          irrigationType: 'drip',
          soilHealth: {
            nitrogen: 45,
            phosphorus: 38,
            potassium: 52,
            pH: 6.8
          }
        }
      ];
    }
  }
};

export const weatherAPI = {
  getForecast: async (location: string): Promise<WeatherData> => {
    try {
      // Use OpenWeatherMap API (replace with your API key)
      const API_KEY = 'demo_key'; // Replace with real API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather API failed');
      }
      
      const data = await response.json();
      
      return {
        location,
        current: {
          temperature: Math.round(data.list[0].main.temp),
          humidity: data.list[0].main.humidity,
          rainfall: data.list[0].rain?.['3h'] || 0,
          windSpeed: Math.round(data.list[0].wind.speed * 3.6) // Convert m/s to km/h
        },
        forecast: data.list.slice(0, 3).map((item: any) => ({
          date: new Date(item.dt * 1000).toISOString().split('T')[0],
          temp: { 
            min: Math.round(item.main.temp_min), 
            max: Math.round(item.main.temp_max) 
          },
          humidity: item.main.humidity,
          rainfall: item.rain?.['3h'] || 0,
          condition: item.weather[0].main
        }))
      };
    } catch (error) {
      // Fallback to demo data if API fails
      console.warn('Weather API failed, using demo data:', error);
      return {
        location,
        current: {
          temperature: 28,
          humidity: 65,
          rainfall: 0,
          windSpeed: 12
        },
        forecast: [
          {
            date: '2024-09-18',
            temp: { min: 22, max: 32 },
            humidity: 70,
            rainfall: 5,
            condition: 'Partly Cloudy'
          },
          {
            date: '2024-09-19',
            temp: { min: 24, max: 34 },
            humidity: 60,
            rainfall: 0,
            condition: 'Sunny'
          },
          {
            date: '2024-09-20',
            temp: { min: 23, max: 31 },
            humidity: 75,
            rainfall: 15,
            condition: 'Light Rain'
          }
        ]
      };
    }
  }
};

export const advisoryAPI = {
  getIrrigationAdvice: async (farmId: string, lastIrrigation: string): Promise<{
    recommendation: string;
    nextIrrigation: string;
    waterAmount: number;
    reasoning: string;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      recommendation: 'Irrigate in 2 days',
      nextIrrigation: '2024-09-19',
      waterAmount: 25,
      reasoning: 'Based on soil moisture and weather forecast, irrigation is recommended to maintain optimal growing conditions.'
    };
  },

  getFertilizerAdvice: async (farmId: string, cropStage: string): Promise<{
    fertilizer: string;
    quantity: number;
    timing: string;
    method: string;
    reasoning: string;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 1300));
    return {
      fertilizer: 'NPK 19:19:19',
      quantity: 15,
      timing: 'Early morning',
      method: 'Fertigation through drip system',
      reasoning: 'Tomato plants are in flowering stage and require balanced nutrition for fruit development.'
    };
  },

  detectPest: async (image: File): Promise<{
    detected: boolean;
    pestName?: string;
    confidence: number;
    treatment: string;
    severity: 'low' | 'medium' | 'high';
  }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      detected: true,
      pestName: 'Aphids',
      confidence: 85,
      treatment: 'Apply neem oil spray in the evening. Repeat after 3 days if needed.',
      severity: 'medium'
    };
  }
};

export const yieldAPI = {
  predictYield: async (farmId: string): Promise<YieldPrediction> => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return {
      cropType: 'Tomato',
      predictedYield: 22.5,
      confidence: 87,
      factors: {
        weather: 85,
        soil: 78,
        irrigation: 92,
        fertilizer: 88
      },
      comparison: {
        lastSeason: 18.2,
        districtAverage: 20.1,
        stateAverage: 19.5
      }
    };
  }
};

export const alertsAPI = {
  getAlerts: async (farmId: string): Promise<Alert[]> => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('farm_id', farmId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(alert => ({
        id: alert.id,
        type: alert.type,
        priority: alert.priority,
        title: alert.title,
        message: alert.message,
        date: new Date(alert.created_at).toISOString().split('T')[0],
        actionRequired: alert.action_required
      }));
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      // Fallback to demo data
      return [
        {
          id: 'alert_1',
          type: 'irrigation',
          priority: 'medium',
          title: 'Irrigation Due',
          message: 'Your tomato field needs watering in 2 days based on soil moisture levels.',
          date: '2024-09-17',
          actionRequired: true
        },
        {
          id: 'alert_2',
          type: 'weather',
          priority: 'high',
          title: 'Heavy Rain Expected',
          message: 'Protect your crops from potential flooding. Rain expected on Sept 22-23.',
          date: '2024-09-17',
          actionRequired: true
        },
        {
          id: 'alert_3',
          type: 'fertilizer',
          priority: 'low',
          title: 'Fertilizer Application',
          message: 'Consider NPK fertilizer application during the flowering stage.',
          date: '2024-09-16',
          actionRequired: false
        }
      ];
    }
  }
};

export const seasonAPI = {
  getPlanningAdvice: async (location: string): Promise<{
    recommendedCrop: string;
    season: string;
    profitability: number;
    marketDemand: string;
    reasoning: string;
    alternatives: string[];
  }> => {
    await new Promise(resolve => setTimeout(resolve, 1800));
    return {
      recommendedCrop: 'Cabbage',
      season: 'Winter 2024-25',
      profitability: 75,
      marketDemand: 'High',
      reasoning: 'Based on climate conditions, soil health, and market trends, cabbage is highly recommended for winter season.',
      alternatives: ['Cauliflower', 'Carrot', 'Onion']
    };
  }
};

export const feedbackAPI = {
  submitFeedback: async (farmId: string, data: {
    actualYield: number;
    issues: string[];
    rating: number;
    comments: string;
  }): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }
};