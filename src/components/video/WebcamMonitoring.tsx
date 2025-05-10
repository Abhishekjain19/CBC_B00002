
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

// Mock detection results
const mockDetections = [
  { class: 'cell phone', confidence: 0.92, x: 0.2, y: 0.3, width: 0.1, height: 0.2 },
  { class: 'laptop', confidence: 0.85, x: 0.6, y: 0.4, width: 0.3, height: 0.2 }
];

const WebcamMonitoring = () => {
  const [monitoring, setMonitoring] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Start monitoring with webcam
  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMonitoring(true);
        
        // Mock detection process
        const detectionInterval = setInterval(() => {
          setDetections(mockDetections);
          
          // Draw bounding boxes
          drawDetections();
          
          // Check for phone detection
          const phoneDetection = mockDetections.find(d => d.class === 'cell phone');
          if (phoneDetection) {
            toast({
              title: "Phone detected",
              description: "A student appears to be using a phone during class",
              variant: "destructive"
            });
          }
        }, 5000);
        
        // Cleanup on stop
        return () => clearInterval(detectionInterval);
      }
    } catch (error) {
      console.error('Error accessing camera for monitoring:', error);
      toast({
        title: "Camera access error",
        description: "Could not access camera for monitoring",
        variant: "destructive"
      });
    }
  };
  
  // Stop monitoring
  const stopMonitoring = () => {
    const videoElement = videoRef.current;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    setMonitoring(false);
    setDetections([]);
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };
  
  // Draw bounding boxes on canvas
  const drawDetections = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !detections.length) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each detection
    detections.forEach(detection => {
      const x = detection.x * canvas.width;
      const y = detection.y * canvas.height;
      const width = detection.width * canvas.width;
      const height = detection.height * canvas.height;
      
      // Set style based on object class
      ctx.strokeStyle = detection.class === 'cell phone' ? '#ff0000' : '#00ff00';
      ctx.lineWidth = 2;
      
      // Draw rectangle
      ctx.strokeRect(x, y, width, height);
      
      // Add label
      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '16px Arial';
      ctx.fillText(`${detection.class} (${(detection.confidence * 100).toFixed(0)}%)`, x, y - 5);
    });
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitoring) {
        stopMonitoring();
      }
    };
  }, [monitoring]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="mr-2 h-5 w-5 text-thinksparkPurple-400" />
          Webcam Monitoring
        </CardTitle>
        <CardDescription>
          Monitor student webcams to detect unauthorized phone usage during class
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {monitoring ? (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
                
                {detections.length > 0 && detections.some(d => d.class === 'cell phone') && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Phone detected
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span> Monitoring active
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Detections:</span> {detections.length}
                  </p>
                </div>
                <Button
                  onClick={stopMonitoring}
                  variant="destructive"
                >
                  <EyeOff className="h-4 w-4 mr-1" />
                  Stop Monitoring
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-gray-600 mb-4">
                Start monitoring student webcams to detect phones and other distractions
              </p>
              <Button
                onClick={startMonitoring}
                className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
              >
                <Eye className="h-4 w-4 mr-1" />
                Start Monitoring
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebcamMonitoring;
