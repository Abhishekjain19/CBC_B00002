
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, Users, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import WebcamMonitoring from './WebcamMonitoring';

interface ClassSession {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  startTime: Date;
  status: 'scheduled' | 'live' | 'ended';
}

interface VideoClassRoomProps {
  session: ClassSession;
  onLeave: () => void;
  userType: 'student' | 'teacher' | null;
}

// Simulated participants
const participants = [
  { id: 'user-1', name: 'Alex Kim', role: 'student' },
  { id: 'user-2', name: 'Maya Patel', role: 'student' },
  { id: 'user-3', name: 'Jordan Smith', role: 'student' },
  { id: 'user-4', name: 'Taylor Johnson', role: 'student' },
];

const VideoClassRoom = ({ session, onLeave, userType }: VideoClassRoomProps) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [participantList, setParticipantList] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: string, message: string}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  // Initialize local video stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Notify when camera is ready
        toast({
          title: "Connected to class",
          description: "Your camera and microphone are now active"
        });
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          title: "Camera access error",
          description: "Could not access your camera or microphone",
          variant: "destructive"
        });
      }
    };
    
    if (cameraEnabled) {
      startCamera();
    }
    
    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [cameraEnabled]);

  // Toggle microphone
  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    
    const videoElement = localVideoRef.current;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !micEnabled;
      });
    }
    
    toast({
      title: micEnabled ? "Microphone disabled" : "Microphone enabled",
      duration: 2000
    });
  };

  // Toggle camera
  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    
    const videoElement = localVideoRef.current;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !cameraEnabled;
      });
    }
    
    toast({
      title: cameraEnabled ? "Camera disabled" : "Camera enabled",
      duration: 2000
    });
  };

  // Handle sending a chat message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim()) {
      setMessages([...messages, {
        sender: 'You',
        message: newMessage
      }]);
      setNewMessage('');
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{session.title}</h1>
            <p className="text-gray-600">{session.subject} - {session.teacher}</p>
          </div>
          <Button 
            onClick={onLeave} 
            variant="destructive"
            size="sm"
            className="bg-red-500 hover:bg-red-600"
          >
            <Phone className="h-4 w-4 mr-2" /> Leave Class
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main video section */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg aspect-video relative overflow-hidden">
              {/* Main video feed (in real app, this would be the teacher) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoPlaceholder text="Teacher's video" />
              </div>
              
              {/* Local video feed */}
              <div className="absolute bottom-4 right-4 w-1/4 aspect-video rounded overflow-hidden border-2 border-white">
                {cameraEnabled ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover bg-gray-900"
                  />
                ) : (
                  <VideoPlaceholder text="Camera off" />
                )}
              </div>
            </div>
            
            {/* Video controls */}
            <div className="flex justify-center mt-4 space-x-4">
              <Button 
                onClick={toggleMic} 
                variant={micEnabled ? "default" : "outline"}
                className={micEnabled ? "bg-thinksparkPurple-300" : ""}
              >
                {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button 
                onClick={toggleCamera} 
                variant={cameraEnabled ? "default" : "outline"}
                className={cameraEnabled ? "bg-thinksparkPurple-300" : ""}
              >
                {cameraEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button 
                onClick={() => setParticipantList(!participantList)} 
                variant={participantList ? "default" : "outline"}
                className={participantList ? "bg-thinksparkPurple-300" : ""}
              >
                <Users className="h-5 w-5" />
              </Button>
              <Button 
                onClick={() => setChatOpen(!chatOpen)} 
                variant={chatOpen ? "default" : "outline"}
                className={chatOpen ? "bg-thinksparkPurple-300" : ""}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Only show webcam monitoring for teachers */}
            {userType === 'teacher' && (
              <div className="mt-6">
                <WebcamMonitoring />
              </div>
            )}
          </div>
          
          {/* Side panel for participants or chat */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-250px)] flex flex-col">
              <div className="bg-gray-100 p-3 border-b">
                <h2 className="font-medium">
                  {participantList ? "Participants" : "Class Chat"}
                </h2>
              </div>
              
              <CardContent className="p-0 flex-1 overflow-hidden">
                {participantList ? (
                  <div className="h-full overflow-auto p-4">
                    <ul className="space-y-2">
                      {participants.map(participant => (
                        <li 
                          key={participant.id} 
                          className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md"
                        >
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{participant.role}</p>
                          </div>
                          
                          {userType === 'teacher' && (
                            <Button variant="ghost" size="sm">
                              Mute
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-auto p-4 space-y-4">
                      {messages.length > 0 ? (
                        messages.map((msg, index) => (
                          <div key={index} className="flex flex-col">
                            <p className="text-xs text-gray-500">{msg.sender}</p>
                            <p className="bg-gray-100 p-2 rounded-md">{msg.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          No messages yet
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t p-3">
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                          placeholder="Type a message..."
                        />
                        <Button 
                          type="submit"
                          className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                          disabled={!newMessage.trim()}
                        >
                          Send
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Placeholder for video elements when no actual video is available
const VideoPlaceholder = ({ text }: { text: string }) => (
  <div className="bg-gray-800 w-full h-full flex items-center justify-center text-white">
    {text}
  </div>
);

export default VideoClassRoom;
