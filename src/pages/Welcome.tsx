import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, TrendingUp, Droplets, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import agrivisionLogo from '@/assets/agrivision-logo.png';

const Welcome = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: TrendingUp,
      title: 'AI Yield Prediction',
      description: 'Predict your crop yield with 90% accuracy using advanced AI models'
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation',
      description: 'Get precise irrigation recommendations based on soil and weather data'
    },
    {
      icon: Sprout,
      title: 'Fertilizer Guidance',
      description: 'Optimize fertilizer usage for maximum crop growth and cost efficiency'
    },
    {
      icon: Shield,
      title: 'Pest Detection',
      description: 'Early pest and disease detection using image recognition technology'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img src={agrivisionLogo} alt="AgriVision" className="h-32 w-auto" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {t('welcome.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary-brown font-semibold mb-4">
              {t('welcome.subtitle')}
            </p>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t('welcome.description')}
            </p>
            
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link to="/onboarding">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-agricultural text-white font-semibold px-8 py-3 hover:opacity-90 transition-opacity"
                >
                  {t('welcome.getStarted')}
                </Button>
              </Link>
              
              <Link to="/dashboard">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card/90 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-brown/10 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
      </div>
    </div>
  );
};

export default Welcome;