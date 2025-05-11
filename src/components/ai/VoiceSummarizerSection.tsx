import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, StopCircle, RefreshCw } from 'lucide-react';
import { SpeechRecognitionType } from '@/types/speechRecognition';
import { getAIResponse, AIMessage } from '@/utils/openRouterApi';
import { toast } from '@/hooks/use-toast';
import { useCareerAdvice } from './CareerAdviceContext';
import { useNavigate } from 'react-router-dom';

const VoiceSummarizerSection = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const { addSearch, showCareerModal, careerPaths, topicTrend, setShowCareerModal } = useCareerAdvice();
  const navigate = useNavigate();
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event) => {
          const last = event.results.length - 1;
          const result = event.results[last][0].transcript;
          setTranscript((prev) => prev + ' ' + result);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event);
          setIsListening(false);
          toast({
            title: "Error",
            description: "There was an error with speech recognition",
            variant: "destructive"
          });
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
  };
  
  const generateSummary = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty text",
        description: "Please record or enter some text to summarize",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const messages: AIMessage[] = [
        { role: "system" as const, content: `You are a helpful AI that creates concise and informative summaries. Respond with a well-structured summary ${language === 'english' ? 'only' : `in ${language} language only`}. Please provide a detailed summary of at least 7-8 lines.` },
        { role: "user" as const, content: `Create a summary ${language !== 'english' ? `in ${language} language ` : ''}of the following text: ${transcript}` }
      ];
      
      const response = await getAIResponse(messages);
      setSummary(response);
      // Track topics (shared)
      addSearch(transcript);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetAll = () => {
    setTranscript('');
    setSummary('');
    setLoading(false);
    if (isListening) {
      recognitionRef.current?.stop();
    }
  };

  // Play summary using speech synthesis
  const playSummary = () => {
    if (!summary) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utter = new window.SpeechSynthesisUtterance(summary);
      utter.lang = language === 'english' ? 'en-US' : language;
      window.speechSynthesis.speak(utter);
    } else {
      toast({
        title: "Not supported",
        description: "Speech synthesis is not supported in this browser.",
        variant: "destructive"
      });
    }
  };

  // Automatically play summary when it changes
  useEffect(() => {
    if (summary) {
      playSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  // Stop speech synthesis when unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">Voice Summarizer</h2>
        <p className="text-sm text-gray-500">
          Record your voice or paste text to generate a summary.
        </p>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            onClick={toggleListening}
            disabled={loading}
          >
            {isListening ? (
              <>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Listening
              </>
            )}
          </Button>
          
          <Select value={language} onValueChange={setLanguage} disabled={loading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="arabic">Arabic</SelectItem>
              {/* Add more languages as needed */}
            </SelectContent>
          </Select>
        </div>
        
        <Textarea 
          placeholder="Paste your text here or start recording..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="min-h-[100px]"
          disabled={loading}
        />
        
        <div className="flex justify-between items-center">
          <Button 
            onClick={generateSummary}
            disabled={loading || !transcript.trim()}
          >
            {loading ? (
              <>
                Summarizing...
              </>
            ) : (
              "Generate Summary"
            )}
          </Button>
          
          <Button 
            variant="ghost"
            onClick={resetAll}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
        
        {summary && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Summary:</h3>
            <Textarea 
              value={summary}
              readOnly
              className="min-h-[100px]"
            />
            <Button onClick={playSummary} variant="secondary" className="mt-2">Play Voice</Button>
          </div>
        )}
        
        {showCareerModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <h3 className="text-lg font-bold mb-2">Career Paths Related to "{topicTrend}"</h3>
              <ul className="mb-4 list-disc pl-5">
                {careerPaths.map((path, i) => <li key={i}>{path}</li>)}
              </ul>
              <p className="mb-4">Do you want to build a resume for this path?</p>
              <div className="flex gap-2">
                <Button onClick={() => { setShowCareerModal(false); navigate('/resume-builder'); }} className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400">Yes, Build Resume</Button>
                <Button variant="outline" onClick={() => setShowCareerModal(false)}>No, Thanks</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceSummarizerSection;
