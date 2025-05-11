import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Quiz from "./pages/Quiz";
import AITools from "./pages/AITools";
import VideoClasses from "./pages/VideoClasses";
import InnovationHub from "./pages/InnovationHub";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeProgress from "./pages/ResumeProgress";
import NotFound from "./pages/NotFound";
import { StudentStreakProvider } from "@/context/StudentStreakContext";
import InterviewPrep from "./pages/InterviewPrep";

const queryClient = new QueryClient();

const ResumeBuilderWrapper = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const startFresh = params.get('fresh') === '1';
  return <ResumeBuilder startFresh={startFresh} />;
};

const App = () => (
  <StudentStreakProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/video-classes" element={<VideoClasses />} />
            <Route path="/innovation-hub" element={<InnovationHub />} />
            <Route path="/resume-builder" element={<ResumeBuilderWrapper />} />
            <Route path="/resume-progress" element={<ResumeProgress />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StudentStreakProvider>
);

export default App;
