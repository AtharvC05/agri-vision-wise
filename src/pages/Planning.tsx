import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, DollarSign, BarChart3, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { seasonAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/layout/Navbar';

const Planning = () => {
  const [location, setLocation] = useState('Nashik, Maharashtra');
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleGetAdvice = async () => {
    setLoading(true);
    try {
      const result = await seasonAPI.getPlanningAdvice(location);
      setAdvice(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get seasonal planning advice",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetAdvice();
  }, []);

  const profitabilityData = advice ? [
    { crop: advice.recommendedCrop, profitability: advice.profitability },
    ...advice.alternatives.map((crop: string, index: number) => ({
      crop,
      profitability: advice.profitability - (index + 1) * 10
    }))
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Seasonal Crop Planning</h1>
          <p className="text-muted-foreground">Get AI-powered recommendations for optimal crop selection</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Location & Season</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Farm Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your farm location"
              />
            </div>
            <Button onClick={handleGetAdvice} disabled={loading} className="w-full">
              {loading ? 'Analyzing Market & Climate Data...' : 'Get Seasonal Recommendations'}
            </Button>
          </CardContent>
        </Card>

        {advice && (
          <>
            {/* Main Recommendation */}
            <Card className="bg-gradient-agricultural text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Lightbulb className="h-6 w-6" />
                  <span>Recommended for {advice.season}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold">{advice.recommendedCrop}</h3>
                    <p className="opacity-80">Best Crop Choice</p>
                  </div>
                  
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold">{advice.profitability}%</h3>
                    <p className="opacity-80">Profitability Score</p>
                  </div>
                  
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold">{advice.marketDemand}</h3>
                    <p className="opacity-80">Market Demand</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reasoning */}
            <Card>
              <CardHeader>
                <CardTitle>Why {advice.recommendedCrop}?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{advice.reasoning}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Profitability Score</span>
                    <span className="text-primary font-bold">{advice.profitability}%</span>
                  </div>
                  <Progress value={advice.profitability} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Crop Profitability Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitabilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="crop" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="profitability" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alternative Crops */}
            <Card>
              <CardHeader>
                <CardTitle>Alternative Crop Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {advice.alternatives.map((crop: string, index: number) => (
                    <div key={crop} className="p-4 bg-muted rounded-lg text-center">
                      <h3 className="font-semibold text-lg mb-2">{crop}</h3>
                      <div className="text-sm text-muted-foreground">
                        Profitability: {advice.profitability - (index + 1) * 10}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Planning Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Planning Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-700">✅ Do's</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Start seed preparation 2-3 weeks early</li>
                      <li>• Check soil pH and nutrient levels</li>
                      <li>• Arrange for quality seeds and inputs</li>
                      <li>• Plan irrigation infrastructure</li>
                      <li>• Research local market prices</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-700">❌ Don'ts</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Don't plant without soil testing</li>
                      <li>• Avoid monoculture if possible</li>
                      <li>• Don't ignore weather forecasts</li>
                      <li>• Avoid late season planting</li>
                      <li>• Don't plant without market research</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Planning;