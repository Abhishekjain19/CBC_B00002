import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const DIFFICULTY_TIME = {
  easy: 15 * 60,
  moderate: 30 * 60,
  difficult: 45 * 60,
};

const QuizQuestion = ({ questions, difficulty, onSubmit }) => {
  const [answers, setAnswers] = useState(["", "", ""]);
  const [current, setCurrent] = useState(0);
  const TOTAL_TIME = DIFFICULTY_TIME[difficulty] || 900;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit(answers);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, answers, onSubmit]);

  const handleAnswer = (idx, val) => {
    const newAns = [...answers];
    newAns[idx] = val;
    setAnswers(newAns);
  };

  const handleNext = () => {
    if (current < 2) setCurrent(current + 1);
    else onSubmit(answers);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">Total Time left: {formatTime(timeLeft)}</div>
      <h4 className="font-bold mb-2">Question {current + 1} of 3</h4>
      <div className="mb-2">{questions[current]}</div>
      <Textarea
        value={answers[current]}
        onChange={e => handleAnswer(current, e.target.value)}
        className="mb-2"
        placeholder="Type your answer here..."
      />
      <Button onClick={handleNext}>{current < 2 ? "Next" : "Submit Quiz"}</Button>
    </div>
  );
};

export default QuizQuestion; 