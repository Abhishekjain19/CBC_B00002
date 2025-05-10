
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Logo from '@/components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - would be replaced with Supabase auth
    setTimeout(() => {
      setIsLoading(false);
      // Store user type in session storage for demo purposes
      sessionStorage.setItem('userType', userType);
      sessionStorage.setItem('isLoggedIn', 'true');
      // Redirect based on user type
      navigate(userType === 'student' ? '/dashboard' : '/teacher-dashboard');
    }, 1500);
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[80vh] py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Logo className="mx-auto" size="lg" />
            <h1 className="mt-6 text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-gray-600">Sign in to your ThinkSpark account</p>
          </div>
          
          <Card>
            <Tabs defaultValue="student" onValueChange={(value) => setUserType(value as 'student' | 'teacher')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>
              
              <CardContent className="mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-thinksparkPurple-400 hover:text-thinksparkPurple-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </CardContent>
            </Tabs>
            
            <CardFooter className="flex flex-col">
              <div className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-thinksparkPurple-400 hover:text-thinksparkPurple-500 font-medium">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
