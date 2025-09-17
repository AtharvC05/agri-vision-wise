import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Droplets, Calendar as CalendarIcon, Clock, Gauge } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { advisoryAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Navbar from '@/components/layout/Navbar';

const Irrigation = () => {
  const [irrigationType, setIrrigationType] = useState('');
  const [lastIrrigation, setLastIrrigation] = useState<Date>();
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleGetAdvice = async () => {
    if (!lastIrrigation || !irrigationType) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await advisoryAPI.getIrrigationAdvice('farm_1', format(lastIrrigation, 'yyyy-MM-dd'));
      setAdvice(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get irrigation advice",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Irrigation Advisory</h1>
          <p className="text-muted-foreground">Get AI-powered irrigation recommendations for your crops</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-primary" />
              <span>Irrigation Parameters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Irrigation Type</label>
                <Select value={irrigationType} onValueChange={setIrrigationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select irrigation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drip">Drip Irrigation</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                    <SelectItem value="flood">Flood Irrigation</SelectItem>
                    <SelectItem value="manual">Manual Watering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Last Irrigation Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {lastIrrigation ? format(lastIrrigation, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={lastIrrigation}
                      onSelect={setLastIrrigation}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button onClick={handleGetAdvice} disabled={loading} className="w-full">
              {loading ? 'Analyzing...' : 'Get Irrigation Advice'}
            </Button>
          </CardContent>
        </Card>

        {advice && (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Irrigation Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Next Irrigation</h3>
                  <p className="text-lg font-bold text-primary">{advice.nextIrrigation}</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Gauge className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Water Amount</h3>
                  <p className="text-lg font-bold text-primary">{advice.waterAmount}L/sq.m</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Droplets className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Status</h3>
                  <p className="text-lg font-bold text-primary">{advice.recommendation}</p>
                </div>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold mb-2">Reasoning:</h4>
                <p className="text-muted-foreground">{advice.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Irrigation;