import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/ui/stat-card';
import AlertCard from '@/components/ui/alert-card';
import Navbar from '@/components/layout/Navbar';
import { 
  Thermometer, 
  Droplets, 
  Sprout, 
  TrendingUp, 
  Cloud, 
  AlertTriangle,
  Droplet,
  Bug,
  CloudRain,
  Wind,
  Eye,
  Gauge
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getForecast, alertsAPI, yieldAPI, type Alert, type WeatherData, type YieldPrediction } from '@/services/api';

const Dashboard = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [yieldData, setYieldData] = useState<YieldPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [weatherData, yieldPrediction] = await Promise.all([
          getForecast('Hinjewadi, Pune, Maharashtra'),
          yieldAPI.predictYield('farm_1')
        ]);
        
        setWeather(weatherData);
        setAlerts([]); // No alerts until user has farms
        setYieldData(yieldPrediction);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'irrigation': return Droplet;
      case 'pest': return Bug;
      case 'weather': return CloudRain;
      default: return AlertTriangle;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">Monitor your farm's health and get AI-powered insights</p>
        </div>

        {/* Agricultural Weather Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Temperature"
            value={`${weather?.current.temperature || 28}°C`}
            icon={Thermometer}
            description="Current temperature"
            variant="default"
          />
          
          <StatCard
            title="Humidity"
            value={`${weather?.current.humidity || 65}%`}
            icon={Droplets}
            description="Air humidity"
            variant="default"
          />
          
          <StatCard
            title="Rainfall"
            value={`${weather?.current.rainfall || 0} mm`}
            icon={CloudRain}
            description="Today's precipitation"
            variant="default"
          />
          
          <StatCard
            title="Wind Speed"
            value={`${weather?.current.windSpeed || 12} km/h`}
            icon={Wind}
            description="Current wind"
            variant="default"
          />
          
          <StatCard
            title="Evapotranspiration"
            value={`${weather?.current.evapotranspiration || 4.2} mm/day`}
            icon={Eye}
            description="Water loss rate"
            variant="warning"
          />
        </div>

        {/* Crop Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Predicted Yield"
            value={`${yieldData?.predictedYield || 22.5} tons/ha`}
            icon={TrendingUp}
            description={`${yieldData?.confidence || 87}% confidence`}
            trend={{
              value: yieldData ? ((yieldData.predictedYield - yieldData.comparison.lastSeason) / yieldData.comparison.lastSeason * 100) : 23.6,
              isPositive: yieldData ? yieldData.predictedYield > yieldData.comparison.lastSeason : true
            }}
            variant="success"
          />
          
          <StatCard
            title="Soil Health"
            value="Good"
            icon={Sprout}
            description="pH 6.8 | NPK: Balanced"
            variant="success"
          />
          
          <StatCard
            title="Pressure"
            value={`${weather?.current.pressure || 1013} hPa`}
            icon={Gauge}
            description="Atmospheric pressure"
            variant="default"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather Forecast */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  <span>{t('dashboard.weather')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weather && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Today</p>
                        <p className="text-lg font-semibold text-foreground">
                          {weather.current.temperature}°C
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Humidity: {weather.current.humidity}% | Wind: {weather.current.windSpeed} km/h
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-lg font-semibold text-foreground">
                          {weather.current.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ET: {weather.current.evapotranspiration} mm/day | UV: {weather.current.uvIndex}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-3">
                      {weather.forecast.map((day, index) => (
                        <div key={index} className="text-center p-3 bg-accent/10 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            {day.date}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {day.temperature}°C
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {day.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            H: {day.humidity}% | W: {day.windSpeed}km/h
                          </p>
                          {day.rainfall > 0 && (
                            <p className="text-xs text-primary mt-1">
                              {day.rainfall}mm rain
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/irrigation" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Droplets className="h-4 w-4 mr-2" />
                    Irrigation Advice
                  </Button>
                </Link>
                
                <Link to="/fertilizer" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Sprout className="h-4 w-4 mr-2" />
                    Fertilizer Guide
                  </Button>
                </Link>
                
                <Link to="/pest" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Bug className="h-4 w-4 mr-2" />
                    Pest Detection
                  </Button>
                </Link>
                
                <Link to="/yield" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Yield Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Recent Alerts</h2>
            <Link to="/alerts">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                message={alert.message}
                priority={alert.priority}
                type={alert.type}
                icon={getAlertIcon(alert.type)}
                date={alert.date}
                actionRequired={alert.actionRequired}
                onAction={() => {
                  // Navigate to relevant page based on alert type
                  const routes = {
                    irrigation: '/irrigation',
                    fertilizer: '/fertilizer',
                    pest: '/pest',
                    weather: '/dashboard'
                  };
                  window.location.href = routes[alert.type] || '/dashboard';
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;