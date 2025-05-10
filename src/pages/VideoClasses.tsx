
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Video, Calendar, Bell, Webcam, Users } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import VideoClassRoom from '@/components/video/VideoClassRoom';

interface ClassSession {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  startTime: Date;
  status: 'scheduled' | 'live' | 'ended';
}

const VideoClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [joinedClass, setJoinedClass] = useState<ClassSession | null>(null);
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  const form = useForm();

  // Mock classes data
  const [classes, setClasses] = useState<ClassSession[]>([
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      subject: 'AI & ML',
      teacher: 'Dr. Sarah Johnson',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      subject: 'Web Development',
      teacher: 'Prof. Michael Chen',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Data Structures: Trees & Graphs',
      subject: 'Computer Science',
      teacher: 'Dr. Priya Sharma',
      startTime: new Date(), // now (for demo purposes)
      status: 'live'
    }
  ]);

  // Check user type on component mount
  useEffect(() => {
    const storedUserType = sessionStorage.getItem('userType') as 'student' | 'teacher' | null;
    setUserType(storedUserType);
  }, []);

  // Filter classes by status
  const upcomingClasses = classes.filter(c => c.status === 'scheduled');
  const liveClasses = classes.filter(c => c.status === 'live');

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle scheduling a new class (teacher only)
  const handleScheduleClass = (data: any) => {
    const newClass: ClassSession = {
      id: (classes.length + 1).toString(),
      title: data.title,
      subject: data.subject,
      teacher: 'You', // In a real app, this would be the actual teacher name
      startTime: new Date(data.date + 'T' + data.time),
      status: data.startNow ? 'live' : 'scheduled'
    };
    
    setClasses([...classes, newClass]);
    
    if (data.startNow) {
      // If starting now, join the class immediately
      setJoinedClass(newClass);
    } else {
      toast({
        title: "Class scheduled",
        description: `"${data.title}" has been scheduled for ${formatDate(newClass.startTime)}`
      });
    }
    
    setOpenDialog(false);
    form.reset();
  };

  // Handle joining a class
  const joinClass = (classSession: ClassSession) => {
    setJoinedClass(classSession);
  };

  // Handle leaving a class
  const leaveClass = () => {
    setJoinedClass(null);
  };

  // If user has joined a class, show the video classroom
  if (joinedClass) {
    return <VideoClassRoom session={joinedClass} onLeave={leaveClass} userType={userType} />;
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Video className="h-8 w-8 text-thinksparkPurple-400" />
            Video Classes
          </h1>
          
          {userType === 'teacher' && (
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
            >
              Schedule a Class
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Classes
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Webcam className="h-4 w-4" />
              Live Now
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls) => (
                <Card key={cls.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{cls.title}</CardTitle>
                        <CardDescription>{cls.subject}</CardDescription>
                      </div>
                      <div>
                        <Badge variant="outline">{formatDate(cls.startTime)}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">Teacher: {cls.teacher}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Reminder set",
                          description: `You will be notified when "${cls.title}" is about to begin.`
                        });
                      }}
                    >
                      <Bell className="h-4 w-4 mr-1" /> Remind me
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No upcoming classes scheduled</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="live" className="space-y-4">
            {liveClasses.length > 0 ? (
              liveClasses.map((cls) => (
                <Card key={cls.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{cls.title}</CardTitle>
                        <CardDescription>{cls.subject}</CardDescription>
                      </div>
                      <div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          LIVE NOW
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Teacher: {cls.teacher}</p>
                      <p className="text-sm flex items-center">
                        <Users className="h-4 w-4 mr-1" /> 12 participants
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                      onClick={() => joinClass(cls)}
                    >
                      Join Class Now
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No classes are currently live</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* New Class Dialog (for teachers) */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Schedule a New Class</DialogTitle>
              <DialogDescription>
                Set up a new virtual class session for your students.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleScheduleClass)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Class Title</Label>
                <Input
                  id="title"
                  placeholder="Enter class title"
                  {...form.register("title", { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select defaultValue="" onValueChange={(value) => form.setValue('subject', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="AI & ML">AI & ML</SelectItem>
                    <SelectItem value="Data Structures">Data Structures</SelectItem>
                    <SelectItem value="Algorithms">Algorithms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...form.register("date")}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    {...form.register("time")}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Input
                  type="checkbox"
                  id="startNow"
                  className="w-4 h-4"
                  {...form.register("startNow")}
                />
                <Label htmlFor="startNow">Start class immediately</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                >
                  Schedule Class
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// Badge component for status indicators
const Badge = ({
  children,
  variant = "default",
  className,
  ...props
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variantClasses = {
    default: "bg-primary bg-opacity-10 text-primary",
    secondary: "bg-secondary bg-opacity-10 text-secondary",
    outline: "border border-gray-300"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`} {...props}>
      {children}
    </span>
  );
};

export default VideoClasses;
