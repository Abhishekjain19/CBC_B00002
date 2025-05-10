
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Logo from '@/components/Logo';
import { toast } from '@/hooks/use-toast';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Mock signup - would be replaced with Supabase auth
    setTimeout(() => {
      setIsLoading(false);
      // Store user type in session storage for demo purposes
      sessionStorage.setItem('userType', userType);
      sessionStorage.setItem('isLoggedIn', 'true');
      
      // Show success toast
      toast({
        title: "Account created!",
        description: `Your ${userType} account has been created successfully.`,
      });
      
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
            <h1 className="mt-6 text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-gray-600">Join ThinkSpark and start your learning journey</p>
          </div>
          
          <Card>
            <Tabs defaultValue="student" onValueChange={(value) => setUserType(value as 'student' | 'teacher')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>
              
              <CardContent className="mt-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
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
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Create a secure password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{' '}
                      <Link to="/terms" className="text-thinksparkPurple-400 hover:underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-thinksparkPurple-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" 
                    disabled={isLoading || !agreeTerms}
                  >
                    {isLoading ? "Creating account..." : "Sign up"}
                  </Button>
                </form>
              </CardContent>
            </Tabs>
            
            <CardFooter className="flex flex-col">
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-thinksparkPurple-400 hover:text-thinksparkPurple-500 font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
