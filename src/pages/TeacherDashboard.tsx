
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is a teacher
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userType = sessionStorage.getItem('userType');
    
    if (!isLoggedIn || userType !== 'teacher') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Quizzes Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Manage Quizzes</CardTitle>
              <CardDescription>
                Create and edit quizzes for your students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" onClick={() => navigate('/quiz')}>
                Manage Quizzes
              </Button>
            </CardContent>
          </Card>
          
          {/* Schedule Classes Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Video Classes</CardTitle>
              <CardDescription>
                Schedule and conduct video classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" onClick={() => navigate('/video-classes')}>
                Manage Classes
              </Button>
            </CardContent>
          </Card>
          
          {/* Review Projects Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Innovation Hub</CardTitle>
              <CardDescription>
                Review student projects and provide feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" onClick={() => navigate('/innovation-hub')}>
                Review Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
