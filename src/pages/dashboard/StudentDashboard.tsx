import { useStudentStreak } from "@/context/StudentStreakContext";

const StudentDashboard = () => {
  const { streak } = useStudentStreak();

  return (
    <div className="mb-4 p-4 bg-yellow-100 rounded">
      <span className="font-semibold">Attendance Streak:</span> {streak} days
    </div>
  );
};

export default StudentDashboard; 