// API service layer for AgriVision
// Contains mock data that will be replaced with real API calls

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
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      farmId: 'farm_' + Date.now()
    };
  },

  getFarms: async (userId: string): Promise<Farm[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
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
};

export const weatherAPI = {
  getForecast: async (location: string): Promise<WeatherData> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
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
    await new Promise(resolve => setTimeout(resolve, 800));
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