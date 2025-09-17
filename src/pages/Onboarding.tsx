import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, User, MapPin, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, setLanguage: setContextLanguage } = useLanguage();
  const { toast } = useToast();

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await authAPI.sendOTP(phone);
      setStep(2);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      await authAPI.verifyOTP(phone, otp);
      setStep(3);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await authAPI.register(phone, name);
      setContextLanguage(language as 'en' | 'hi' | 'ta' | 'te');
      toast({
        title: "Welcome to AgriVision!",
        description: "Your account has been created successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            {step === 1 && 'Welcome to AgriVision'}
            {step === 2 && 'Verify Your Phone'}
            {step === 3 && 'Complete Your Profile'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={handleSendOTP} 
                className="w-full" 
                disabled={!phone || loading}
              >
                Send OTP
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter OTP</label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full" 
                disabled={!otp || loading}
              >
                Verify OTP
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <Languages className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleComplete} 
                className="w-full" 
                disabled={!name || loading}
              >
                Complete Setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;