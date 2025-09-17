import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sprout, Package, Clock, Beaker } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { advisoryAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';

const Fertilizer = () => {
  const [cropStage, setCropStage] = useState('');
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleGetAdvice = async () => {
    if (!cropStage) {
      toast({
        title: "Missing Information",
        description: "Please select crop stage",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await advisoryAPI.getFertilizerAdvice('farm_1', cropStage);
      setAdvice(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get fertilizer advice",
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Fertilizer Advisory</h1>
          <p className="text-muted-foreground">Get optimal fertilizer recommendations for your crop stage</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sprout className="h-5 w-5 text-primary" />
              <span>Crop Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Crop Stage</label>
              <Select value={cropStage} onValueChange={setCropStage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop growth stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="germination">Germination</SelectItem>
                  <SelectItem value="vegetative">Vegetative Growth</SelectItem>
                  <SelectItem value="flowering">Flowering</SelectItem>
                  <SelectItem value="fruit-development">Fruit Development</SelectItem>
                  <SelectItem value="maturity">Maturity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGetAdvice} disabled={loading} className="w-full">
              {loading ? 'Analyzing Nutrient Needs...' : 'Get Fertilizer Recommendation'}
            </Button>
          </CardContent>
        </Card>

        {advice && (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Fertilizer Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Fertilizer Type</h3>
                  <p className="text-lg font-bold text-primary">{advice.fertilizer}</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Beaker className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Quantity</h3>
                  <p className="text-lg font-bold text-primary">{advice.quantity} kg/acre</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Best Timing</h3>
                  <p className="text-lg font-bold text-primary">{advice.timing}</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Sprout className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Application Method</h3>
                  <p className="text-sm font-bold text-primary">{advice.method}</p>
                </div>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold mb-2">Why this recommendation?</h4>
                <p className="text-muted-foreground">{advice.reasoning}</p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips:</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Apply fertilizer when soil is moist for better absorption</li>
                  <li>• Avoid application during peak sunlight hours</li>
                  <li>• Water lightly after application to activate nutrients</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Fertilizer;