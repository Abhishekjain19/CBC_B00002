import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCareerAdvice } from './CareerAdviceContext';
import { useNavigate } from 'react-router-dom';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const StoryModeSection = () => {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentView, setCurrentView] = useState<'form' | 'story' | 'quiz'>('form');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const { addSearch, showCareerModal, careerPaths, topicTrend, setShowCareerModal } = useCareerAdvice();
  const navigate = useNavigate();

  // Predefined topics
  const topics = [
    "Artificial Intelligence",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Blockchain",
    "Internet of Things",
    "Game Development",
    "Cloud Computing",
    "Mobile App Development",
    "Robotics"
  ];

  // Mock function to generate story and quiz
  const generateStoryAndQuiz = async () => {
    const finalTopic = topic === 'custom' ? customTopic : topic;
    
    if (!finalTopic) {
      toast({
        title: "Topic required",
        description: "Please select or enter a topic.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock story generation
      const mockStory = `# The Rise of ${finalTopic}

In the rapidly evolving landscape of technology, ${finalTopic} has emerged as a transformative force that continues to reshape how we interact with the digital world.

## Origins

The concept of ${finalTopic} wasn't born overnight. Its foundations were laid decades ago when pioneering computer scientists envisioned a future where technology could extend human capabilities. What began as theoretical concepts in research papers gradually evolved through persistent innovation and collaboration.

## Key Developments

As computing power increased and algorithms became more sophisticated, ${finalTopic} began to show practical applications across various industries. Early adopters quickly realized its potential to solve complex problems that were previously considered impossible.

Several breakthrough moments accelerated its development:
- The introduction of novel frameworks that simplified implementation
- Increasing accessibility of computational resources
- Growing communities of developers sharing knowledge and code
- Real-world success stories demonstrating tangible benefits

## Current Impact

Today, ${finalTopic} influences countless aspects of our lives, often in ways we don't immediately recognize. From optimizing business processes to enhancing educational experiences, its applications continue to expand.

## Future Directions

Experts predict that ${finalTopic} will continue to evolve in exciting new directions. As researchers overcome current limitations and discover new approaches, we can expect even more powerful capabilities to emerge.

The journey of ${finalTopic} represents one of humanity's most fascinating technological adventures—a story that continues to be written each day by developers, researchers, and visionaries around the world.`;

      // Mock quiz generation
      const mockQuestions: Question[] = [
        {
          question: `What is one of the main factors that accelerated the development of ${finalTopic}?`,
          options: [
            "Decreasing interest from researchers",
            "Growing communities sharing knowledge",
            "Reduced computational resources",
            "Government restrictions"
          ],
          correctAnswer: "Growing communities sharing knowledge"
        },
        {
          question: `According to the story, when did ${finalTopic} begin development?`,
          options: [
            "Last year",
            "In the 21st century only",
            "Its foundations were laid decades ago",
            "It appeared suddenly without prior research"
          ],
          correctAnswer: "Its foundations were laid decades ago"
        },
        {
          question: `How does the story describe the future of ${finalTopic}?`,
          options: [
            "It has reached its maximum potential",
            "It will continue to evolve in new directions",
            "Interest is declining rapidly",
            "It will be replaced by newer technologies"
          ],
          correctAnswer: "It will continue to evolve in new directions"
        }
      ];
      
      setStory(mockStory);
      setQuestions(mockQuestions);
      setCurrentView('story');
      
      // Reset quiz state
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setScore(0);
      setQuizFinished(false);
      
      // Track topics (shared)
      addSearch(finalTopic);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate story and quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle starting quiz
  const startQuiz = () => {
    setCurrentView('quiz');
  };

  // Handle quiz answer submission
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      toast({
        title: "No answer selected",
        description: "Please select an answer before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if answer is correct
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    // Move to next question or end quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      setQuizFinished(true);
    }
  };

  // Handle starting over
  const handleReset = () => {
    setCurrentView('form');
    setStory('');
    setQuestions([]);
    setTopic('');
    setCustomTopic('');
  };

  return (
    <div className="space-y-6">
      {currentView === 'form' && (
        <Card>
          <CardHeader>
            <CardTitle>Story Mode</CardTitle>
            <CardDescription>
              Generate an educational story followed by a quiz to test your understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Select a Topic</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Topic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {topic === 'custom' && (
                <div>
                  <Label htmlFor="customTopic">Enter Custom Topic</Label>
                  <Input
                    id="customTopic"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter a custom topic..."
                  />
                </div>
              )}
              
              <Button
                onClick={generateStoryAndQuiz}
                disabled={isGenerating}
                className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Story & Quiz...
                  </>
                ) : (
                  "Generate Story & Quiz"
                )}
              </Button>
            </div>
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
      )}
      
      {currentView === 'story' && story && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                <div className="flex items-center">
                  <BookText className="mr-2 h-5 w-5 text-thinksparkPurple-400" />
                  {topic === 'custom' ? customTopic : topic} Story
                </div>
              </CardTitle>
              <CardDescription>Read the story and then take the quiz</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="prose max-w-none dark:prose-invert">
            <div className="overflow-y-auto max-h-[400px] p-2">
              {/* Render markdown-like content */}
              {story.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{paragraph.substring(2)}</h1>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i} className="text-xl font-bold mt-3 mb-2">{paragraph.substring(3)}</h2>;
                }
                if (paragraph.includes('- ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={i} className="list-disc pl-5 my-2">
                      {items.map((item, j) => item.startsWith('- ') && <li key={j}>{item.substring(2)}</li>)}
                    </ul>
                  );
                }
                return <p key={i} className="my-2">{paragraph}</p>;
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={startQuiz} 
              className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
            >
              Take Quiz
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {currentView === 'quiz' && questions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Story Quiz</CardTitle>
                {!quizFinished && (
                  <CardDescription>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardDescription>
                )}
              </div>
              {!quizFinished && (
                <div className="text-right">
                  <div className="text-sm">Score</div>
                  <div className="text-2xl font-bold">{score}/{currentQuestionIndex}</div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {quizFinished ? (
              <div className="text-center py-6">
                <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
                <div className="text-6xl font-bold text-thinksparkPurple-300 mb-4">
                  {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-lg">
                  Your score: {score} out of {questions.length}
                </p>
                <Button 
                  onClick={handleReset}
                  className="mt-6 bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                >
                  Try Another Topic
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-lg font-medium">
                  {questions[currentQuestionIndex]?.question}
                </div>
                
                <RadioGroup 
                  value={selectedAnswer} 
                  onValueChange={setSelectedAnswer}
                >
                  {questions[currentQuestionIndex]?.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <Button 
                  onClick={handleSubmitAnswer}
                  className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                  disabled={!selectedAnswer}
                >
                  Submit Answer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoryModeSection;
