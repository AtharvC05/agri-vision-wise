import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Settings as SettingsIcon, User, Bell, Globe, HelpCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'Ramesh Kumar',
    phone: '+91-9876543210',
    location: 'Nashik, Maharashtra'
  });
  
  const [notifications, setNotifications] = useState({
    irrigation: true,
    weather: true,
    pest: false,
    fertilizer: true,
    market: false
  });

  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved",
    });
  };

  const faqItems = [
    {
      question: "How accurate are the yield predictions?",
      answer: "Our AI models achieve 85-90% accuracy by analyzing weather patterns, soil conditions, historical data, and farming practices. Accuracy improves with more data from your specific farm."
    },
    {
      question: "Can I use AgriVision offline?",
      answer: "Basic features like viewing cached recommendations work offline. For real-time weather updates, pest detection, and new predictions, an internet connection is required."
    },
    {
      question: "How do I add multiple farms?",
      answer: "Go to Dashboard > Add Farm and fill in the farm details. You can manage multiple farms and switch between them in the navigation menu."
    },
    {
      question: "Is my farm data secure?",
      answer: "Yes, all your data is encrypted and stored securely. We never share your personal or farm information with third parties without your consent."
    },
    {
      question: "How often should I check for alerts?",
      answer: "We recommend checking alerts daily, especially during critical crop stages. Enable push notifications to get immediate updates on urgent matters."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile, preferences, and get help</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Farm Location</label>
              <Input
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Language Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Language</label>
              <Select value={language} onValueChange={(value: 'en' | 'hi' | 'ta' | 'te') => setLanguage(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Irrigation Alerts</h4>
                  <p className="text-sm text-muted-foreground">Get notified when irrigation is needed</p>
                </div>
                <Switch
                  checked={notifications.irrigation}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, irrigation: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weather Warnings</h4>
                  <p className="text-sm text-muted-foreground">Alerts for severe weather conditions</p>
                </div>
                <Switch
                  checked={notifications.weather}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weather: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Pest & Disease Alerts</h4>
                  <p className="text-sm text-muted-foreground">Early warning for pest outbreaks</p>
                </div>
                <Switch
                  checked={notifications.pest}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pest: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Fertilizer Reminders</h4>
                  <p className="text-sm text-muted-foreground">Notifications for fertilizer application</p>
                </div>
                <Switch
                  checked={notifications.fertilizer}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, fertilizer: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Market Updates</h4>
                  <p className="text-sm text-muted-foreground">Price trends and market information</p>
                </div>
                <Switch
                  checked={notifications.market}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, market: checked }))}
                />
              </div>
            </div>
            
            <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-primary" />
              <span>Contact Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Need help? Our support team is here to assist you.
              </p>
              <div className="space-y-2">
                <p className="font-medium">📞 Helpline: 1800-123-AGRI (2474)</p>
                <p className="font-medium">📧 Email: support@agrivision.in</p>
                <p className="font-medium">⏰ Hours: 24/7 Support Available</p>
              </div>
              <Button className="mt-4">Chat with Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;