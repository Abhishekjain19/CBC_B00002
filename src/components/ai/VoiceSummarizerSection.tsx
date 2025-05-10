import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Mic, VolumeX, Volume2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Add type definitions for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionAlternative {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

// Type for our Speech Recognition
type SpeechRecognitionType = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

const VoiceSummarizerSection = () => {
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');
  const [kannadaSummary, setKannadaSummary] = useState('');
  const [activeTab, setActiveTab] = useState('english');
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Predefined topics
  const topics = [
    "Machine Learning Basics",
    "Web Development Fundamentals",
    "Data Structures",
    "Algorithms",
    "Cloud Computing",
    "DevOps Practices",
    "Mobile App Development",
    "Database Design",
    "Network Security",
    "Software Testing"
  ];

  // Mock function to generate summaries
  const generateSummary = async () => {
    if (!text && !topic) {
      toast({
        title: "Input required",
        description: "Please enter text or select a topic for summarization.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const inputForSummary = text || `Generate a comprehensive summary about ${topic}`;
      
      // Mock English summary
      const mockEnglishSummary = `This is a summary of "${text || topic}". The key points include understanding the core concepts, applying best practices, and continuing to learn as the field evolves. This technology is constantly changing, and staying updated with the latest developments is crucial for success.`;
      
      // Mock Kannada summary
      const mockKannadaSummary = `ಇದು "${text || topic}" ದ ಸಾರಾಂಶವಾಗಿದೆ. ಪ್ರಮುಖ ಅಂಶಗಳಲ್ಲಿ ಮೂಲ ಪರಿಕಲ್ಪನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು, ಉತ್ತಮ ಅಭ್ಯಾಸಗಳನ್ನು ಅನ್ವಯಿಸುವುದು ಮತ್ತು ಕ್ಷೇತ್ರವು ವಿಕಸನಗೊಳ್ಳುತ್ತಿರುವಂತೆ ಕಲಿಯುವುದನ್ನು ಮುಂದುವರಿಸುವುದು ಸೇರಿವೆ. ಈ ತಂತ್ರಜ್ಞಾನವು ನಿರಂತರವಾಗಿ ಬದಲಾಗುತ್ತಿದೆ, ಮತ್ತು ಇತ್ತೀಚಿನ ಬೆಳವಣಿಗೆಗಳೊಂದಿಗೆ ನವೀಕರಿಸಿಕೊಂಡಿರುವುದು ಯಶಸ್ಸಿಗೆ ನಿರ್ಣಾಯಕವಾಗಿದೆ.`;
      
      setSummary(mockEnglishSummary);
      setKannadaSummary(mockKannadaSummary);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Speech recognition function
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // Properly handle browser compatibility
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI() as SpeechRecognitionType;
        
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
          setIsListening(true);
          toast({
            title: "Listening...",
            description: "Please speak clearly.",
          });
        };
        
        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          setText(speechResult);
          setIsListening(false);
        };
        
        recognition.onerror = (event) => {
          setIsListening(false);
          toast({
            title: "Error",
            description: "Speech recognition error. Please try again.",
            variant: "destructive"
          });
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      }
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
    }
  };

  // Text-to-speech function
  const speak = (text: string, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      utterance.onstart = () => {
        setIsPlaying(true);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "Error",
          description: "Speech synthesis error. Please try again.",
          variant: "destructive"
        });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in this browser.",
        variant: "destructive"
      });
    }
  };

  // Stop speech
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice Summarizer</CardTitle>
          <CardDescription>
            Enter text or select a topic to generate a summary in English and Kannada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Enter Text (or use voice input)</Label>
              <div className="flex mt-1.5">
                <Textarea
                  id="text"
                  placeholder="Enter the text you want to summarize..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 min-h-[100px] resize-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={startListening}
                  disabled={isListening}
                  className={`ml-2 ${isListening ? "bg-red-100" : ""}`}
                >
                  <Mic className={`h-5 w-5 ${isListening ? "text-red-500" : ""}`} />
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <span className="text-sm text-gray-500">OR</span>
            </div>
            
            <div>
              <Label htmlFor="topic">Select a Topic</Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={generateSummary}
              disabled={isGenerating}
              className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {(summary || kannadaSummary) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="kannada">ಕನ್ನಡ (Kannada)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="english" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="whitespace-pre-wrap">{summary}</p>
                  </CardContent>
                  <CardFooter className="justify-end gap-2">
                    {isPlaying && activeTab === "english" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={stopSpeaking}
                      >
                        <VolumeX className="h-4 w-4" />
                        <span className="ml-1">Stop</span>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => speak(summary)}
                        disabled={isPlaying}
                      >
                        <Volume2 className="h-4 w-4" />
                        <span className="ml-1">Listen</span>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="kannada" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="whitespace-pre-wrap">{kannadaSummary}</p>
                  </CardContent>
                  <CardFooter className="justify-end gap-2">
                    {isPlaying && activeTab === "kannada" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={stopSpeaking}
                      >
                        <VolumeX className="h-4 w-4" />
                        <span className="ml-1">Stop</span>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => speak(kannadaSummary, 'kn-IN')}
                        disabled={isPlaying}
                      >
                        <Volume2 className="h-4 w-4" />
                        <span className="ml-1">Listen</span>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceSummarizerSection;
