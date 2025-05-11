import React, { useState } from "react";
import { getAIResponse } from "@/utils/openRouterApi";
import { fetchYouTubeVideo } from "@/utils/youtubeSuggest";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import Layout from "@/components/Layout";

const DSA_TOPICS = {
  "Data Structures": ["Arrays", "Linked List", "Stack", "Queue", "Tree", "Graph", "Heap", "Hash Table"],
  "Algorithms": ["Sorting", "Searching", "Recursion", "Dynamic Programming", "Greedy", "Backtracking", "Divide and Conquer"]
};

const DIFFICULTY = [
  { label: "Easy", value: "easy", time: 15 },
  { label: "Moderate", value: "moderate", time: 30 },
  { label: "Difficult", value: "difficult", time: 45 }
];

const InterviewPrep = () => {
  // --- Form State ---
  const [section, setSection] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  // --- Quiz State ---
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [youtube, setYoutube] = useState<{ title: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  // --- TC6, TC21, TC22: Robust question extraction ---
  const generateQuestions = async () => {
    setLoading(true);
    setQuestions([]);
    setAnswers([]);
    setScore(null);
    setYoutube(null);
    setFeedback([]);
    const prompt = `Generate exactly 3 GeeksforGeeks-style coding interview questions for interview preparation on the topic "${topic}" for ${section}. Each question should be relevant for learning and solving DSA. Number them exactly as: 1. 2. 3. Do not include any explanations, answers, or extra text. Return ONLY the questions, each starting with '1. ', '2. ', '3. ' on a new line.`;
    const aiResponse = await getAIResponse([
      { role: "system", content: "You are an expert DSA interviewer. Generate clear, relevant, and challenging GeeksforGeeks-style questions for students preparing for coding interviews. Only output the questions, numbered 1. 2. 3. with no extra text. Return ONLY the questions, each starting with '1. ', '2. ', '3. ' on a new line." },
      { role: "user", content: prompt }
    ]);
    // Robust extraction of 3 questions
    const qs = [];
    const matches = aiResponse.match(/(?:^|\n)(\d+\.\s[^\n]+)/g);
    if (matches) {
      for (let i = 0; i < 3 && i < matches.length; i++) {
        qs.push(matches[i].replace(/^\d+\.\s/, '').trim());
      }
    }
    setQuestions(qs);
    setLoading(false);
  };

  // --- TC17, TC18, TC12, TC13, TC14, TC15: AI feedback, score, YouTube suggestion ---
  const handleQuizSubmit = async (userAnswers: string[]) => {
    setAnswers(userAnswers);
    const feedbacks: string[] = [];
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      const checkPrompt = `Question: ${questions[i]}\nUser Answer: ${userAnswers[i]}\nIs this answer correct? Reply with 'Correct' or 'Incorrect' and a brief explanation.`;
      const aiFeedback = await getAIResponse([
        { role: "system", content: "You are an expert DSA interviewer. Evaluate the user's answer for correctness and provide a brief explanation." },
        { role: "user", content: checkPrompt }
      ]);
      feedbacks.push(aiFeedback);
      if (/\bcorrect\b/i.test(aiFeedback)) correct++;
    }
    setScore(correct);
    setFeedback(feedbacks);
    if (correct <= 1) {
      const yt = await fetchYouTubeVideo(topic, section);
      setYoutube(yt);
    }
  };

  // --- TC16: Reset quiz on reload ---
  // (State is not persisted, so reload resets quiz)

  // --- UI ---
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Interview Prep</h2>
        {/* TC5, TC6, TC7, TC8, TC9: Form selection and disabling */}
        <div className="flex gap-4 mb-4 justify-center">
          <Select value={section} onValueChange={v => { setSection(v); setTopic(""); }}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Select Section" /></SelectTrigger>
            <SelectContent>
              {Object.keys(DSA_TOPICS).map(sec => (
                <SelectItem key={sec} value={sec}>{sec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={topic} onValueChange={setTopic} disabled={!section}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Select Topic" /></SelectTrigger>
            <SelectContent>
              {section && DSA_TOPICS[section].map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Select Difficulty" /></SelectTrigger>
            <SelectContent>
              {DIFFICULTY.map(d => (
                <SelectItem key={d.value} value={d.value}>{d.label} ({d.time} min)</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generateQuestions} disabled={!section || !topic || !difficulty || loading}>
            {loading ? "Generating..." : "Start Quiz"}
          </Button>
        </div>
        {/* TC10, TC11, TC12: Quiz, timer, and instructions */}
        {questions.length > 0 && (
          <>
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-blue-900">
              <b>Instructions:</b> You have {DIFFICULTY.find(d => d.value === difficulty)?.time || 15} minutes to answer 3 questions. The quiz will auto-submit when time runs out.
            </div>
            <QuizQuestion
              questions={questions}
              difficulty={difficulty}
              onSubmit={handleQuizSubmit}
            />
          </>
        )}
        {/* TC17, TC18, TC19, TC20: Feedback, score, YouTube suggestion */}
        {score !== null && feedback && (
          <div className="mt-6">
            <h3 className="text-lg font-bold">Your Score: {score} / 3</h3>
            <div className="mt-2 space-y-2">
              {feedback.map((fb, idx) => (
                <div key={idx} className="bg-gray-100 p-2 rounded">
                  <div className="font-semibold">Q{idx + 1} Feedback:</div>
                  <div>{fb}</div>
                </div>
              ))}
            </div>
            {youtube && (
              <div className="mt-2">
                <span>Recommended video for you: </span>
                <a href={youtube.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{youtube.title}</a>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InterviewPrep; 