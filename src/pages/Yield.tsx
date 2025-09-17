import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, BarChart3, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { yieldAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Navbar from '@/components/layout/Navbar';

const Yield = () => {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const result = await yieldAPI.predictYield('farm_1');
        setPrediction(result);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load yield prediction",
          variant: "destructive",
        });
      }
      setLoading(false);
    };

    fetchPrediction();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Analyzing yield data...</p>
          </div>
        </div>
      </div>
    );
  }

  const comparisonData = prediction ? [
    { name: 'Your Farm', yield: prediction.predictedYield },
    { name: 'Last Season', yield: prediction.comparison.lastSeason },
    { name: 'District Avg', yield: prediction.comparison.districtAverage },
    { name: 'State Avg', yield: prediction.comparison.stateAverage },
  ] : [];

  const factorsData = prediction ? [
    { factor: 'Weather', score: prediction.factors.weather },
    { factor: 'Soil', score: prediction.factors.soil },
    { factor: 'Irrigation', score: prediction.factors.irrigation },
    { factor: 'Fertilizer', score: prediction.factors.fertilizer },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Yield Prediction</h1>
          <p className="text-muted-foreground">AI-powered crop yield forecasting based on current conditions</p>
        </div>

        {prediction && (
          <>
            {/* Main Prediction Card */}
            <Card className="bg-gradient-agricultural text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Target className="h-6 w-6" />
                  <span>Predicted Yield for {prediction.cropType}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold">{prediction.predictedYield} tons</h3>
                    <p className="opacity-80">Expected Yield</p>
                  </div>
                  
                  <div className="text-center">
                    <Award className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold">{prediction.confidence}%</h3>
                    <p className="opacity-80">Confidence Level</p>
                  </div>
                  
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold">+{((prediction.predictedYield - prediction.comparison.lastSeason) / prediction.comparison.lastSeason * 100).toFixed(1)}%</h3>
                    <p className="opacity-80">vs Last Season</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Factors Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Yield Factors Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {factorsData.map((factor) => (
                      <div key={factor.factor} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{factor.factor}</span>
                          <span className="font-medium">{factor.score}%</span>
                        </div>
                        <Progress value={factor.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Factors Radar Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={factorsData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar 
                        name="Score" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.3} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Yield Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="yield" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations to Maximize Yield</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Strengths</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Excellent irrigation management (92%)</li>
                      <li>• Good fertilizer application (88%)</li>
                      <li>• Weather conditions favorable</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">🔧 Areas for Improvement</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Soil health needs attention (78%)</li>
                      <li>• Consider soil testing and amendments</li>
                      <li>• Regular organic matter addition</li>
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

export default Yield;