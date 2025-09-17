import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { feedbackAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';

const Feedback = () => {
  const [actualYield, setActualYield] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [issues, setIssues] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const issuesList = [
    'Pest Attack',
    'Disease Outbreak',
    'Water Shortage',
    'Fertilizer Issues',
    'Weather Damage',
    'Market Price Drop',
    'Labor Shortage',
    'Equipment Problems'
  ];

  const handleIssueToggle = (issue: string) => {
    setIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const handleSubmit = async () => {
    if (!actualYield || rating === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide yield data and rating",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await feedbackAPI.submitFeedback('farm_1', {
        actualYield: parseFloat(actualYield),
        issues,
        rating,
        comments
      });
      
      setSubmitted(true);
      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-4">Thank You for Your Feedback!</h2>
              <p className="text-muted-foreground mb-6">
                Your input helps us improve our AI recommendations and serve farmers better.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Submit Another Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Season Feedback</h1>
          <p className="text-muted-foreground">Help us improve by sharing your harvest results and experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Harvest Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Actual Yield Harvested (tons)</label>
              <Input
                type="number"
                placeholder="Enter actual yield in tons"
                value={actualYield}
                onChange={(e) => setActualYield(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Our AI predicted 22.5 tons for your tomato crop
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Rate Our Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  <Star className={`h-8 w-8 ${star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Rate the accuracy and helpfulness of our AI recommendations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues Faced This Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {issuesList.map((issue) => (
                <div key={issue} className="flex items-center space-x-2">
                  <Checkbox
                    checked={issues.includes(issue)}
                    onCheckedChange={() => handleIssueToggle(issue)}
                  />
                  <label className="text-sm">{issue}</label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Additional Comments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share your experience, suggestions, or any other feedback..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            size="lg"
            className="px-8"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🎯 How Your Feedback Helps:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Improves AI prediction accuracy for future seasons</li>
              <li>• Helps other farmers in your region get better recommendations</li>
              <li>• Enables us to identify and address common farming challenges</li>
              <li>• Contributes to the development of smarter agricultural solutions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;