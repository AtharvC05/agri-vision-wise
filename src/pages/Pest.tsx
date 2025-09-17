import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bug, Upload, Camera, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { advisoryAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';

const Pest = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detection, setDetection] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDetection(null);
    }
  };

  const handleDetectPest = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await advisoryAPI.detectPest(selectedFile);
      setDetection(result);
      if (result.detected) {
        toast({
          title: "Pest Detected",
          description: `Found ${result.pestName} with ${result.confidence}% confidence`,
        });
      } else {
        toast({
          title: "No Pest Detected",
          description: "Your crop appears healthy!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <Bug className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pest & Disease Detection</h1>
          <p className="text-muted-foreground">Upload crop images for AI-powered pest and disease identification</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-primary" />
              <span>Upload Crop Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload Image for Analysis</h3>
                <p className="text-muted-foreground">
                  Take a clear photo of affected leaves, stems, or fruits
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="max-w-xs mx-auto"
                />
              </div>
            </div>

            {selectedFile && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Selected: {selectedFile.name}</p>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected crop"
                  className="max-w-sm mx-auto rounded-lg border"
                />
              </div>
            )}

            <Button 
              onClick={handleDetectPest} 
              disabled={!selectedFile || loading} 
              className="w-full"
            >
              {loading ? 'Analyzing Image...' : 'Detect Pest & Disease'}
            </Button>
          </CardContent>
        </Card>

        {detection && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-primary">Detection Results</span>
                <Badge className={`${getSeverityColor(detection.severity)} flex items-center space-x-1`}>
                  {getSeverityIcon(detection.severity)}
                  <span>{detection.severity.toUpperCase()}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {detection.detected ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Bug className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">Detected Pest</h3>
                      <p className="text-lg font-bold text-primary">{detection.pestName}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">Confidence Level</h3>
                      <p className="text-lg font-bold text-primary">{detection.confidence}%</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Recommended Treatment:</span>
                    </h4>
                    <p className="text-muted-foreground">{detection.treatment}</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🔍 Prevention Tips:</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Regular crop monitoring and inspection</li>
                      <li>• Maintain proper plant spacing for air circulation</li>
                      <li>• Remove affected plant parts immediately</li>
                      <li>• Use organic neem oil as preventive spray</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Crop Looks Healthy!</h3>
                  <p className="text-muted-foreground">No pests or diseases detected in the uploaded image.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Pest;