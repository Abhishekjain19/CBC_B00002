import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from './dashboard/StudentDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userTypeFromSession = sessionStorage.getItem('userType') as 'student' | 'teacher';
    
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setUserType(userTypeFromSession);
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <p>Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {userType === 'student' && <StudentDashboard />}
        <h1 className="text-3xl font-bold mb-6">
          Welcome to your {userType === 'student' ? 'Student' : 'Teacher'} Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quiz Arena Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Quiz Arena</CardTitle>
              <CardDescription>
                Take quizzes to test your knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" onClick={() => navigate('/quiz')}>
                Go to Quiz Arena
              </Button>
            </CardContent>
          </Card>
          
          {/* AI Tools Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>AI Tools</CardTitle>
              <CardDescription>
                Access AI-powered learning tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" onClick={() => navigate('/ai-tools')}>
                Explore AI Tools
              </Button>
            </CardContent>
          </Card>
          
          {/* Video Classes Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Video Classes</CardTitle>
              <CardDescription>
                Join live video classes and sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" onClick={() => navigate('/video-classes')}>
                View Classes
              </Button>
            </CardContent>
          </Card>

          {/* Innovation Hub Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Innovation Hub</CardTitle>
              <CardDescription>
                Share and explore innovative projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" onClick={() => navigate('/innovation-hub')}>
                Enter Innovation Hub
              </Button>
            </CardContent>
          </Card>

          {/* Resume Builder Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Resume Builder</CardTitle>
              <CardDescription>
                Easily create professional resumes with AI-powered suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" onClick={() => navigate('/resume-builder')}>
                Go to Resume Builder
              </Button>
            </CardContent>
          </Card>

          {/* Interview Prep Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Interview Prep</CardTitle>
              <CardDescription>
                Practice DSA & Algorithms interview questions, timed quizzes, and get instant AI feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => navigate('/interview-prep')}>
                Start Interview Prep
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
