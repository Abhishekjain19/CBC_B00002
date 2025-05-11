import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const WebcamMonitoring = () => {
  const [monitoring, setMonitoring] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const [model, setModel] = useState<any>(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load COCO-SSD model on mount
  useEffect(() => {
    setModelLoading(true);
    cocoSsd.load().then(m => {
      setModel(m);
      setModelLoading(false);
    });
  }, []);

  // Start monitoring with webcam
  const startMonitoring = async () => {
    console.log('Start Monitoring clicked');
    try {
      setVideoReady(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera stream acquired', stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          setVideoReady(true);
          videoRef.current?.play();
          console.log('Video is ready and playing');
        };
        // Fallback: if onloadeddata doesn't fire, set videoReady after a short delay
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            setVideoReady(true);
            videoRef.current.play();
            console.log('Video is ready (fallback)');
          }
        }, 1000);
        setMonitoring(true);
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
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setMonitoring(false);
    setDetections([]);
    setVideoReady(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };
  
  // Run detection using requestAnimationFrame for smoother updates
  const detectFrame = useCallback(async () => {
    if (!model || !videoRef.current || !monitoring || !videoReady) {
      console.log('Detection skipped: not ready', { model, monitoring, videoReady });
      return;
    }
    const predictions = await model.detect(videoRef.current);
    console.log('Predictions:', predictions);
    const phoneDetections = predictions.filter((d: any) => d.class === 'cell phone');
    setDetections(phoneDetections);
    drawDetections(phoneDetections);
    if (phoneDetections.length > 0) {
      toast({
        title: "Phone detected",
        description: "A student appears to be using a phone during class",
        variant: "destructive"
      });
    }
    if (monitoring) {
      requestAnimationFrame(detectFrame);
    }
  }, [model, monitoring, videoReady]);

  // Start detection loop when monitoring, model, and video are ready
  useEffect(() => {
    if (monitoring && model && videoReady) {
      detectFrame();
    }
    // Cleanup: nothing needed for requestAnimationFrame
    return () => {};
  }, [monitoring, model, videoReady, detectFrame]);

  // Draw bounding boxes on canvas
  const drawDetections = (detectionsToDraw = detections) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !detectionsToDraw.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    detectionsToDraw.forEach((detection: any) => {
      const [x, y, width, height] = detection.bbox;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = '#ff0000';
      ctx.font = '16px Arial';
      ctx.fillText(`${detection.class} (${Math.round(detection.score * 100)}%)`, x, y - 5);
    });
  };

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
                {modelLoading
                  ? 'Loading AI model for phone detection...'
                  : 'Start monitoring student webcams to detect phones and other distractions'}
              </p>
              {modelLoading ? (
                <Button
                  className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                  disabled
                >
                  Please wait until COCO-SSD is fully integrated...
                </Button>
              ) : (
                <Button
                  onClick={startMonitoring}
                  className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400 w-full"
                  disabled={!model}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Start Monitoring
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebcamMonitoring;
