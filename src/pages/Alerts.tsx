import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Droplets, Sprout, Bug, Cloud, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { alertsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

import Navbar from '@/components/layout/Navbar';

const Alerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const result = await alertsAPI.getAlerts('farm_1');
        setAlerts(result);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load alerts",
          variant: "destructive",
        });
      }
      setLoading(false);
    };

    fetchAlerts();
  }, [toast]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'irrigation': return Droplets;
      case 'fertilizer': return Sprout;
      case 'pest': return Bug;
      case 'weather': return Cloud;
      default: return AlertTriangle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);

  const alertCounts = {
    all: alerts.length,
    irrigation: alerts.filter(a => a.type === 'irrigation').length,
    fertilizer: alerts.filter(a => a.type === 'fertilizer').length,
    pest: alerts.filter(a => a.type === 'pest').length,
    weather: alerts.filter(a => a.type === 'weather').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading alerts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Farm Alerts</h1>
          <p className="text-muted-foreground">Stay updated with important notifications for your farm</p>
        </div>

        {/* Filter Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>All ({alertCounts.all})</span>
              </Button>
              <Button
                variant={filter === 'irrigation' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('irrigation')}
                className="flex items-center space-x-2"
              >
                <Droplets className="h-4 w-4" />
                <span>Irrigation ({alertCounts.irrigation})</span>
              </Button>
              <Button
                variant={filter === 'fertilizer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('fertilizer')}
                className="flex items-center space-x-2"
              >
                <Sprout className="h-4 w-4" />
                <span>Fertilizer ({alertCounts.fertilizer})</span>
              </Button>
              <Button
                variant={filter === 'pest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pest')}
                className="flex items-center space-x-2"
              >
                <Bug className="h-4 w-4" />
                <span>Pest ({alertCounts.pest})</span>
              </Button>
              <Button
                variant={filter === 'weather' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('weather')}
                className="flex items-center space-x-2"
              >
                <Cloud className="h-4 w-4" />
                <span>Weather ({alertCounts.weather})</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-700 mb-2">All Clear!</h3>
                <p className="text-muted-foreground">No alerts for the selected category.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => {
              const IconComponent = getAlertIcon(alert.type);
              return (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${getPriorityColor(alert.priority)}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold">{alert.title}</h3>
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{alert.message}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{alert.date}</span>
                          </div>
                        </div>
                      </div>
                      {alert.actionRequired && (
                        <Button size="sm" className="ml-4">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;