
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Award, FileText, Image as ImageIcon, MessageSquare, ThumbsUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  studentName: string;
  uploadDate: Date;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  date: Date;
  isTeacher: boolean;
}

const InnovationHub = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Neural Network Visualizer',
      description: 'An interactive tool that visualizes neural networks and helps students understand how they work. It includes animations for forward and backward propagation.',
      image: 'https://via.placeholder.com/800x450?text=Neural+Network+Visualizer',
      studentName: 'Arjun Patel',
      uploadDate: new Date(2023, 4, 15),
      likes: 24,
      comments: [
        {
          id: 'c1',
          author: 'Dr. Sarah Johnson',
          text: 'This is an excellent visualization tool. The animations make complex concepts much easier to understand.',
          date: new Date(2023, 4, 16),
          isTeacher: true
        }
      ]
    },
    {
      id: '2',
      title: 'Sustainable City Planner',
      description: 'A simulation tool that helps urban planners design more sustainable cities. It calculates environmental impact based on various factors like building placement, transportation networks, and energy sources.',
      image: 'https://via.placeholder.com/800x450?text=Sustainable+City+Planner',
      studentName: 'Mei Ling',
      uploadDate: new Date(2023, 4, 10),
      likes: 18,
      comments: []
    },
    {
      id: '3',
      title: 'AR Chemistry Lab',
      description: 'An augmented reality app that allows students to conduct virtual chemistry experiments safely. It visualizes molecular structures and reactions in 3D space.',
      studentName: 'Marcus Johnson',
      uploadDate: new Date(2023, 4, 5),
      likes: 32,
      comments: [
        {
          id: 'c2',
          author: 'Prof. Michael Chen',
          text: 'The molecular visualization is remarkably accurate. Great work on implementing the reaction mechanics!',
          date: new Date(2023, 4, 7),
          isTeacher: true
        },
        {
          id: 'c3',
          author: 'Sophia Rodriguez',
          text: 'I tried this in my study group and it helped us understand complex reactions much better.',
          date: new Date(2023, 4, 8),
          isTeacher: false
        }
      ]
    }
  ]);
  
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  
  const form = useForm();
  
  // Check user type on component mount
  useEffect(() => {
    const storedUserType = sessionStorage.getItem('userType') as 'student' | 'teacher' | null;
    setUserType(storedUserType);
  }, []);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Handle image upload preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageFile(file);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Submit new project
  const handleSubmitProject = (data: any) => {
    const newProject: Project = {
      id: (projects.length + 1).toString(),
      title: data.title,
      description: data.description,
      image: imagePreview || undefined,
      studentName: 'You', // In a real app, this would come from user profile
      uploadDate: new Date(),
      likes: 0,
      comments: []
    };
    
    setProjects([newProject, ...projects]);
    setNewProjectDialogOpen(false);
    setImagePreview(null);
    setImageFile(null);
    form.reset();
    
    toast({
      title: "Project submitted",
      description: "Your innovation project has been submitted successfully."
    });
  };
  
  // Like a project
  const handleLike = (projectId: string) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return { ...project, likes: project.likes + 1 };
      }
      return project;
    }));
  };
  
  // Open comment dialog
  const openCommentDialog = (project: Project) => {
    setSelectedProject(project);
    setCommentDialogOpen(true);
  };
  
  // Submit new comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject || !newComment.trim()) {
      return;
    }
    
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: 'You', // In a real app, this would come from user profile
      text: newComment,
      date: new Date(),
      isTeacher: userType === 'teacher'
    };
    
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return { 
          ...project, 
          comments: [...project.comments, comment]
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    setNewComment('');
    
    // Update the selected project to show the new comment
    const updatedProject = updatedProjects.find(p => p.id === selectedProject.id) || null;
    setSelectedProject(updatedProject);
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully."
    });
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8 text-thinksparkPurple-400" />
            Innovation Hub
          </h1>
          
          {userType === 'student' && (
            <Button
              onClick={() => setNewProjectDialogOpen(true)}
              className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
            >
              Submit New Project
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {project.image && (
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>
                  By {project.studentName} • {formatDate(project.uploadDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">{project.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleLike(project.id)}
                    className="flex items-center"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {project.likes}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openCommentDialog(project)}
                    className="flex items-center"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {project.comments.length}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => openCommentDialog(project)}
                >
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* New Project Dialog */}
        <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submit a New Project</DialogTitle>
              <DialogDescription>
                Share your innovative tech solution with teachers and peers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmitProject)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your project"
                  {...form.register("title", { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your innovative solution..."
                  className="min-h-[120px]"
                  {...form.register("description", { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Project Image (Optional)</Label>
                <div className="flex flex-col gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  
                  {imagePreview && (
                    <div className="relative aspect-video rounded-md overflow-hidden border">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setNewProjectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                >
                  Submit Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Project Detail / Comment Dialog */}
        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
          {selectedProject && (
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                <DialogDescription>
                  By {selectedProject.studentName} • {formatDate(selectedProject.uploadDate)}
                </DialogDescription>
              </DialogHeader>
              
              {selectedProject.image && (
                <div className="aspect-video rounded-md overflow-hidden">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedProject.description}</p>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-4">
                  Comments ({selectedProject.comments.length})
                </h4>
                
                <div className="space-y-4">
                  {selectedProject.comments.length > 0 ? (
                    selectedProject.comments.map(comment => (
                      <div key={comment.id} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="font-medium">{comment.author}</span>
                            {comment.isTeacher && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                                Teacher
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No comments yet</p>
                  )}
                </div>
                
                <form onSubmit={handleSubmitComment} className="mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="comment">Add a comment</Label>
                    <Textarea
                      id="comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your feedback..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button 
                      type="submit"
                      disabled={!newComment.trim()}
                      className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                    >
                      Post Comment
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </Layout>
  );
};

export default InnovationHub;
