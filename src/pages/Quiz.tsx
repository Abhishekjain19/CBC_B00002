import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Book, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateQuizQuestions, QuizQuestion } from '@/utils/quizGenerator';

// Enhanced domains and subjects data
const domains = [
  "Computer Science", 
  "Information Technology", 
  "AI & ML", 
  "Software Engineering",
  "Data Science",
  "Cybersecurity",
  "Computer Architecture"
];

const subjectsByDomain = {
  "Computer Science": [
    "Data Structures", 
    "Algorithms", 
    "Operating Systems", 
    "Database Systems", 
    "Compilers", 
    "Computer Networks",
    "Theory of Computation"
  ],
  "Information Technology": [
    "Web Development", 
    "Networking", 
    "Cloud Computing", 
    "IT Project Management", 
    "System Administration"
  ],
  "AI & ML": [
    "Machine Learning", 
    "Deep Learning", 
    "Natural Language Processing", 
    "Computer Vision", 
    "Reinforcement Learning"
  ],
  "Software Engineering": [
    "Software Design Patterns", 
    "Agile Methodology", 
    "DevOps", 
    "Testing & QA", 
    "Software Architecture"
  ],
  "Data Science": [
    "Statistical Analysis", 
    "Big Data Processing", 
    "Data Visualization", 
    "Data Mining", 
    "Predictive Analytics"
  ],
  "Cybersecurity": [
    "Network Security", 
    "Cryptography", 
    "Ethical Hacking", 
    "Security Compliance", 
    "Digital Forensics"
  ],
  "Computer Architecture": [
    "CPU Design", 
    "Memory Systems", 
    "Parallel Computing", 
    "Computer Organization", 
    "VLSI Design"
  ]
};

const topicsBySubject = {
  // Computer Science subjects
  "Data Structures": ["Arrays", "Linked Lists", "Trees", "Graphs", "Hash Tables", "Heaps", "Stacks & Queues"],
  "Algorithms": ["Sorting", "Searching", "Dynamic Programming", "Greedy Algorithms", "Graph Algorithms", "Divide & Conquer"],
  "Operating Systems": ["Process Management", "Memory Management", "File Systems", "Virtualization", "Concurrency"],
  "Database Systems": ["SQL", "Relational Model", "Indexing", "Transactions", "NoSQL", "Query Optimization"],
  "Compilers": ["Lexical Analysis", "Parsing", "Semantic Analysis", "Code Generation", "Optimization"],
  "Computer Networks": ["OSI Model", "TCP/IP", "Routing", "Network Security", "Wireless Networks", "Protocol Design"],
  "Theory of Computation": ["Automata Theory", "Formal Languages", "Computability", "Complexity Classes", "NP-Completeness"],

  // Information Technology subjects
  "Web Development": ["HTML/CSS", "JavaScript", "React", "Backend Development", "RESTful APIs", "Web Security"],
  "Networking": ["TCP/IP", "OSI Model", "Network Security", "Subnetting", "DNS", "DHCP", "VPN"],
  "Cloud Computing": ["AWS", "Azure", "GCP", "IaaS", "PaaS", "SaaS", "Serverless Computing"],
  "IT Project Management": ["Agile", "Scrum", "Kanban", "ITIL", "Risk Management", "Resource Allocation"],
  "System Administration": ["Linux Administration", "Windows Server", "Shell Scripting", "Virtualization", "Containerization"],

  // AI & ML subjects
  "Machine Learning": ["Supervised Learning", "Unsupervised Learning", "Feature Engineering", "Model Evaluation", "Ensemble Methods"],
  "Deep Learning": ["Neural Networks", "CNN", "RNN", "Transformers", "GANs", "Attention Mechanisms"],
  "Natural Language Processing": ["Text Processing", "Sentiment Analysis", "Language Models", "Machine Translation", "Named Entity Recognition"],
  "Computer Vision": ["Image Classification", "Object Detection", "Image Segmentation", "Feature Extraction", "Face Recognition"],
  "Reinforcement Learning": ["Markov Decision Processes", "Q-Learning", "Policy Gradients", "Deep Q Networks", "Multi-agent Systems"],

  // Software Engineering
  "Software Design Patterns": ["Creational Patterns", "Structural Patterns", "Behavioral Patterns", "Architectural Patterns", "Anti-patterns"],
  "Agile Methodology": ["Scrum", "Kanban", "Extreme Programming", "User Stories", "Sprint Planning", "Retrospectives"],
  "DevOps": ["CI/CD", "Infrastructure as Code", "Monitoring", "Docker", "Kubernetes", "Microservices"],
  "Testing & QA": ["Unit Testing", "Integration Testing", "System Testing", "Test-Driven Development", "Automated Testing"],
  "Software Architecture": ["Microservices", "Monolith", "Event-Driven", "Layered Architecture", "Service-Oriented Architecture"],

  // Additional subjects for other domains
  // ... keep existing code for the rest of the topics
};

const difficultyLevels = ["Easy", "Medium", "Hard"];

// Mock quiz questions (as backup if AI generation fails)
const mockQuizzes = {
  "Arrays": {
    "Easy": [
      {
        question: "What is the time complexity of accessing an element in an array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: "O(1)",
        explanation: "Array access is constant time as the memory location can be calculated directly."
      },
      {
        question: "Which of the following operations is not O(1) for arrays?",
        options: ["Access", "Insertion at beginning", "Insertion at end (with space)", "Update"],
        correctAnswer: "Insertion at beginning",
        explanation: "Insertion at the beginning requires shifting all elements, making it O(n)."
      }
    ],
    "Medium": [
      {
        question: "What is the output of the following code: [1,2,3,4].map(x => x*2)?",
        options: ["[1,2,3,4]", "[2,4,6,8]", "[1,4,9,16]", "Error"],
        correctAnswer: "[2,4,6,8]",
        explanation: "The map function applies the given function to each element, multiplying each by 2."
      }
    ],
    "Hard": [
      {
        question: "What algorithm would you use to find the maximum subarray sum in an array?",
        options: ["Binary Search", "Merge Sort", "Kadane's Algorithm", "Bubble Sort"],
        correctAnswer: "Kadane's Algorithm",
        explanation: "Kadane's algorithm is an efficient way to find the maximum sum subarray with O(n) time complexity."
      }
    ]
  }
};

const Quiz = () => {
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  
  // Filter subjects based on selected domain
  const availableSubjects = selectedDomain ? subjectsByDomain[selectedDomain] || [] : [];
  
  // Filter topics based on selected subject
  const availableTopics = selectedSubject ? topicsBySubject[selectedSubject] || [] : [];
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (quizFinished && score < questions.length / 2 && questions.length > 0) {
      setShowYoutubeModal(true);
    } else {
      setShowYoutubeModal(false);
    }
  }, [quizFinished, score, questions.length]);

  const handleStartQuiz = async () => {
    if (!selectedDomain || !selectedSubject || !selectedTopic || !selectedDifficulty) {
      toast({
        title: "Missing selection",
        description: "Please select all quiz parameters before starting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Try to generate questions using AI
      const generatedQuestions = await generateQuizQuestions(selectedTopic, selectedDifficulty, 5);
      setQuestions(generatedQuestions);
      
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizFinished(false);
      setShowExplanation(false);
      setSelectedAnswer("");
    } catch (error) {
      console.error("Failed to generate questions:", error);
      
      // Fall back to mock questions if AI generation fails
      const fallbackQuestions = mockQuizzes[selectedTopic]?.[selectedDifficulty] || [];
      
      if (fallbackQuestions.length > 0) {
        setQuestions(fallbackQuestions);
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizFinished(false);
        setShowExplanation(false);
        setSelectedAnswer("");
        
        toast({
          title: "Using sample questions",
          description: "Could not generate new questions. Using pre-defined questions instead.",
          variant: "default"
        });
      } else {
        toast({
          title: "No questions available",
          description: "No questions available for the selected criteria. Please try another selection.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setSelectedDomain("");
    setSelectedSubject("");
    setSelectedTopic("");
    setSelectedDifficulty("");
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
    setQuestions([]);
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Book className="h-8 w-8 text-thinksparkPurple-400" />
          Quiz Arena
        </h1>
        
        {!quizStarted ? (
          <Card>
            <CardHeader>
              <CardTitle>Select Quiz Parameters</CardTitle>
              <CardDescription>Choose your domain, subject, topic, and difficulty level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select value={selectedDomain} onValueChange={(value) => {
                    setSelectedDomain(value);
                    setSelectedSubject("");
                    setSelectedTopic("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={selectedSubject} 
                    onValueChange={(value) => {
                      setSelectedSubject(value);
                      setSelectedTopic("");
                    }}
                    disabled={!selectedDomain}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Select 
                    value={selectedTopic} 
                    onValueChange={setSelectedTopic}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTopics.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty} className="w-full">
                    <TabsList className="grid grid-cols-3">
                      {difficultyLevels.map(level => (
                        <TabsTrigger key={level} value={level}>{level}</TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
                
                <Button 
                  onClick={handleStartQuiz} 
                  className="mt-4 bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    "Start Quiz"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : quizFinished ? (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Completed!</CardTitle>
              <CardDescription>
                Your score: {score} out of {questions.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center my-6">
                <div className="text-6xl font-bold text-thinksparkPurple-300">
                  {Math.round((score / questions.length) * 100)}%
                </div>
              </div>
              
              <Button 
                onClick={handleResetQuiz}
                className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
              >
                Take Another Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedTopic} - {selectedDifficulty}</CardTitle>
                  <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm">Score</div>
                  <div className="text-2xl font-bold">{score}/{currentQuestionIndex + (showExplanation ? 1 : 0)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-lg font-medium">
                  {currentQuestion?.question}
                </div>
                
                <RadioGroup 
                  value={selectedAnswer} 
                  onValueChange={setSelectedAnswer}
                  disabled={showExplanation}
                >
                  {currentQuestion?.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`} 
                        className={
                          showExplanation && option === currentQuestion.correctAnswer 
                            ? "border-green-500 text-green-500" 
                            : ""
                        }
                      />
                      <Label 
                        htmlFor={`option-${index}`}
                        className={
                          showExplanation && option === currentQuestion.correctAnswer 
                            ? "text-green-600" 
                            : showExplanation && option === selectedAnswer && option !== currentQuestion.correctAnswer
                              ? "text-red-600" 
                              : ""
                        }
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {showExplanation && (
                  <div className="bg-thinksparkPurple-100 p-4 rounded-md">
                    <p className="font-medium">Explanation:</p>
                    <p>{currentQuestion?.explanation}</p>
                  </div>
                )}
                
                <div className="pt-4">
                  {!showExplanation ? (
                    <Button 
                      onClick={handleSubmitAnswer}
                      className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                      disabled={!selectedAnswer}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNextQuestion}
                      className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                    >
                      {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {quizFinished && showYoutubeModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <h3 className="text-lg font-bold mb-2">Need More Help?</h3>
              <p className="mb-4">Your score is below 50%. We recommend watching some YouTube lectures and tutorials on <b>{selectedTopic}</b> to improve your understanding.</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedTopic + ' tutorial lecture')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4 text-blue-600 underline"
              >
                Search YouTube for "{selectedTopic} tutorial lecture"
              </a>
              <Button onClick={() => setShowYoutubeModal(false)} className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400 w-full">Close</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Quiz;
