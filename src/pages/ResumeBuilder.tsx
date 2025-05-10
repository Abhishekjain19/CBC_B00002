
import { useState } from 'react';
import Layout from '@/components/Layout';
import { FileText, Plus, Trash2, Download, Book, Briefcase, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { getAIResponse, AIMessage } from '@/utils/openRouterApi';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  });
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);
  
  const generateId = () => Math.random().toString(36).substring(2, 11);
  
  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    };
    setEducation([...education, newEducation]);
  };
  
  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };
  
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };
  
  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setExperience([...experience, newExperience]);
  };
  
  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };
  
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };
  
  const addSkill = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      level: 3
    };
    setSkills([...skills, newSkill]);
  };
  
  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };
  
  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };
  
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };
  
  const generateSummary = async () => {
    if (!personalInfo.name || experience.length === 0 || skills.length === 0) {
      toast({
        title: "Incomplete information",
        description: "Please fill in your name, add at least one job experience and one skill.",
        variant: "destructive"
      });
      return;
    }
    
    setGeneratingAI(true);
    
    try {
      // Prepare data for AI
      const skillsList = skills.map(s => s.name).join(", ");
      const latestJob = experience[0];
      
      const prompt = `
        I need a professional summary for my resume.
        My name is: ${personalInfo.name}
        My current/desired job title: ${personalInfo.title || "Not specified"}
        My skills include: ${skillsList}
        ${latestJob ? `My most recent position was ${latestJob.position} at ${latestJob.company}` : ""}
        Education: ${education.map(e => `${e.degree} in ${e.field} from ${e.institution}`).join(", ")}
        
        Write a concise, professional summary paragraph (3-4 sentences) for my resume that highlights my experience and skills. 
        Make it sound professional and engaging.
      `;
      
      const messages: AIMessage[] = [
        { role: "system", content: "You are an expert resume writer who creates concise, impactful professional summaries." },
        { role: "user", content: prompt }
      ];
      
      const response = await getAIResponse(messages);
      updatePersonalInfo('summary', response);
      
      toast({
        title: "Summary generated",
        description: "Your professional summary has been created!",
      });
      
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingAI(false);
    }
  };
  
  const downloadResume = () => {
    // This is a placeholder for the real PDF generation functionality
    // In a real app, you would use a library like jsPDF or react-pdf
    toast({
      title: "Resume download",
      description: "PDF generation would be implemented here in the full version.",
    });
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FileText className="h-8 w-8 text-thinksparkPurple-400" />
          Resume Builder
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Build Your Resume</CardTitle>
                <CardDescription>
                  Complete each section to create your professional resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal" className="flex items-center gap-1">
                      <User className="h-4 w-4" /> Info
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex items-center gap-1">
                      <Book className="h-4 w-4" /> Education
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> Experience
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center gap-1">
                      <Award className="h-4 w-4" /> Skills
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Personal Information Tab */}
                  <TabsContent value="personal" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={personalInfo.name} 
                          onChange={(e) => updatePersonalInfo('name', e.target.value)}
                          placeholder="John Doe" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input 
                          id="title" 
                          value={personalInfo.title} 
                          onChange={(e) => updatePersonalInfo('title', e.target.value)}
                          placeholder="Software Engineer" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={personalInfo.email} 
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          placeholder="john.doe@example.com" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={personalInfo.phone} 
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          placeholder="(123) 456-7890" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={personalInfo.location} 
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        placeholder="City, State" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={generateSummary}
                          disabled={generatingAI}
                          className="h-8"
                        >
                          {generatingAI ? "Generating..." : "Generate with AI"}
                        </Button>
                      </div>
                      <Textarea 
                        id="summary" 
                        value={personalInfo.summary} 
                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                        placeholder="Brief professional summary" 
                        className="min-h-[120px]"
                      />
                    </div>
                  </TabsContent>
                  
                  {/* Education Tab */}
                  <TabsContent value="education" className="space-y-4 mt-4">
                    {education.map((edu, index) => (
                      <Card key={edu.id} className="p-4 relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label>Institution</Label>
                            <Input 
                              value={edu.institution} 
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="University name" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input 
                              value={edu.degree} 
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="Bachelor's, Master's, etc." 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <Label>Field of Study</Label>
                          <Input 
                            value={edu.field} 
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            placeholder="Computer Science, Business, etc." 
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input 
                              type="month" 
                              value={edu.startDate} 
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date (or Expected)</Label>
                            <Input 
                              type="month" 
                              value={edu.endDate} 
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={addEducation}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Education
                    </Button>
                  </TabsContent>
                  
                  {/* Experience Tab */}
                  <TabsContent value="experience" className="space-y-4 mt-4">
                    {experience.map((exp, index) => (
                      <Card key={exp.id} className="p-4 relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => removeExperience(exp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input 
                              value={exp.company} 
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Company name" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Position</Label>
                            <Input 
                              value={exp.position} 
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              placeholder="Your job title" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <Label>Location</Label>
                          <Input 
                            value={exp.location} 
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            placeholder="City, State or Remote" 
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input 
                              type="month" 
                              value={exp.startDate} 
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input 
                              type="month" 
                              value={exp.endDate} 
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              placeholder="Present (if current)"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea 
                            value={exp.description} 
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            placeholder="Describe your responsibilities and achievements" 
                            className="min-h-[100px]"
                          />
                        </div>
                      </Card>
                    ))}
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={addExperience}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Experience
                    </Button>
                  </TabsContent>
                  
                  {/* Skills Tab */}
                  <TabsContent value="skills" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map((skill, index) => (
                        <div key={skill.id} className="flex items-center gap-2">
                          <Input 
                            value={skill.name} 
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            placeholder="Skill name" 
                            className="flex-1"
                          />
                          <select 
                            value={skill.level}
                            onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                            className="h-10 rounded-md border border-input px-3 py-2 text-sm"
                          >
                            <option value={1}>Beginner</option>
                            <option value={2}>Intermediate</option>
                            <option value={3}>Advanced</option>
                            <option value={4}>Expert</option>
                          </select>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 p-0"
                            onClick={() => removeSkill(skill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={addSkill}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Skill
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Preview</CardTitle>
                  <CardDescription>
                    A simplified preview of your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  {personalInfo.name && <h3 className="text-xl font-bold mb-1">{personalInfo.name}</h3>}
                  {personalInfo.title && <p className="text-muted-foreground mb-2">{personalInfo.title}</p>}
                  
                  <div className="flex flex-wrap gap-2 text-sm mb-4">
                    {personalInfo.email && <span className="text-muted-foreground">{personalInfo.email}</span>}
                    {personalInfo.phone && <span className="text-muted-foreground">{personalInfo.phone}</span>}
                    {personalInfo.location && <span className="text-muted-foreground">{personalInfo.location}</span>}
                  </div>
                  
                  {personalInfo.summary && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold">Summary</h4>
                      <p className="text-sm">{personalInfo.summary}</p>
                    </div>
                  )}
                  
                  {experience.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold">Experience</h4>
                      <ul className="list-none p-0 m-0">
                        {experience.map((exp, i) => (
                          <li key={i} className="text-sm mb-1">
                            {exp.position && exp.company ? `${exp.position} at ${exp.company}` : 
                              exp.position || exp.company || "Position details"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {education.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold">Education</h4>
                      <ul className="list-none p-0 m-0">
                        {education.map((edu, i) => (
                          <li key={i} className="text-sm mb-1">
                            {edu.degree && edu.institution ? `${edu.degree} from ${edu.institution}` : 
                              edu.degree || edu.institution || "Education details"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {skills.map((skill, i) => (
                          <span key={i} className="text-sm bg-muted px-2 py-1 rounded-md">
                            {skill.name || "Skill"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="mt-4">
                <Button 
                  className="w-full bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
                  onClick={downloadResume}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilder;
