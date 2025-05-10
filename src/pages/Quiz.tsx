
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Book } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for domains, subjects, etc.
const domains = ["Computer Science", "Information Technology", "AI & ML"];
const subjectsByDomain = {
  "Computer Science": ["Data Structures", "Algorithms", "Operating Systems"],
  "Information Technology": ["Web Development", "Networking", "Cloud Computing"],
  "AI & ML": ["Machine Learning", "Deep Learning", "Natural Language Processing"]
};
const topicsBySubject = {
  "Data Structures": ["Arrays", "Linked Lists", "Trees"],
  "Algorithms": ["Sorting", "Searching", "Dynamic Programming"],
  "Operating Systems": ["Process Management", "Memory Management", "File Systems"],
  "Web Development": ["HTML/CSS", "JavaScript", "React"],
  "Networking": ["TCP/IP", "OSI Model", "Network Security"],
  "Cloud Computing": ["AWS", "Azure", "GCP"],
  "Machine Learning": ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"],
  "Deep Learning": ["Neural Networks", "CNN", "RNN"],
  "Natural Language Processing": ["Text Processing", "Sentiment Analysis", "Language Models"]
};
const difficultyLevels = ["Easy", "Medium", "Hard"];

// Mock quiz questions
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
  
  // Filter subjects based on selected domain
  const availableSubjects = selectedDomain ? subjectsByDomain[selectedDomain] || [] : [];
  
  // Filter topics based on selected subject
  const availableTopics = selectedSubject ? topicsBySubject[selectedSubject] || [] : [];
  
  // Get current quiz questions
  const currentQuiz = selectedTopic && selectedDifficulty ? 
    mockQuizzes[selectedTopic]?.[selectedDifficulty] || [] : [];
  
  // Current question
  const currentQuestion = currentQuiz[currentQuestionIndex];

  const handleStartQuiz = () => {
    if (!selectedDomain || !selectedSubject || !selectedTopic || !selectedDifficulty) {
      toast({
        title: "Missing selection",
        description: "Please select all quiz parameters before starting.",
        variant: "destructive"
      });
      return;
    }
    
    if (!currentQuiz.length) {
      toast({
        title: "No questions available",
        description: "No questions available for the selected criteria. Please try another selection.",
        variant: "destructive"
      });
      return;
    }
    
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setShowExplanation(false);
    setSelectedAnswer("");
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
    if (currentQuestionIndex < currentQuiz.length - 1) {
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
                >
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : quizFinished ? (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Completed!</CardTitle>
              <CardDescription>
                Your score: {score} out of {currentQuiz.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center my-6">
                <div className="text-6xl font-bold text-thinksparkPurple-300">
                  {Math.round((score / currentQuiz.length) * 100)}%
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
                  <CardDescription>Question {currentQuestionIndex + 1} of {currentQuiz.length}</CardDescription>
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
                      {currentQuestionIndex < currentQuiz.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Quiz;
