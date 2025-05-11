import React, { createContext, useContext, useState, useEffect } from "react";

const STREAK_KEY = "student_streak";

const StudentStreakContext = createContext<{
  streak: number;
  markAttendance: () => void;
  attendedToday: boolean;
}>({
  streak: 0,
  markAttendance: () => {},
  attendedToday: false,
});

export const useStudentStreak = () => useContext(StudentStreakContext);

export const StudentStreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streak, setStreak] = useState(0);
  const [attendedToday, setAttendedToday] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "{}");
    setStreak(data.streak || 0);
    setAttendedToday(data.lastDate === new Date().toDateString());
  }, []);

  const markAttendance = () => {
    if (!attendedToday) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setAttendedToday(true);
      localStorage.setItem(
        STREAK_KEY,
        JSON.stringify({ streak: newStreak, lastDate: new Date().toDateString() })
      );
    }
  };

  return (
    <StudentStreakContext.Provider value={{ streak, markAttendance, attendedToday }}>
      {children}
    </StudentStreakContext.Provider>
  );
}; 