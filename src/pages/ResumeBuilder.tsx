import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { FileText, Plus, Trash2, Download, Book, Briefcase, Award, User, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { getAIResponse, AIMessage } from '@/utils/openRouterApi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

const ResumeBuilder = ({ startFresh = false }: { startFresh?: boolean }) => {
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  
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
  
  const resumeRef = useRef<HTMLDivElement>(null);

  // PDF download using jsPDF and html2canvas
  const downloadResume = async () => {
    if (!resumeRef.current) return;
    const element = resumeRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('resume.pdf');
  };

  // Load progress from sessionStorage
  useEffect(() => {
    if (startFresh) {
      sessionStorage.removeItem('resumeData');
      sessionStorage.removeItem('resumePromptsCount');
      sessionStorage.removeItem('resumePromptsCompleted');
    } else {
      const saved = sessionStorage.getItem('resumeData');
      if (saved) {
        const data = JSON.parse(saved);
        setPersonalInfo(data.personalInfo || personalInfo);
        setEducation(data.education || []);
        setExperience(data.experience || []);
        setSkills(data.skills || []);
        setProjects(data.projects || []);
        setCertifications(data.certifications || []);
      }
    }
    // Prefill professional title if coming from career guidance
    const suggestedTitle = sessionStorage.getItem('resumeCareerTitle');
    if (suggestedTitle && !personalInfo.title) {
      setPersonalInfo(prev => ({ ...prev, title: suggestedTitle }));
      sessionStorage.removeItem('resumeCareerTitle');
    }
  }, [startFresh]);

  // Save progress after each change
  useEffect(() => {
    const data = { personalInfo, education, experience, skills, projects, certifications };
    sessionStorage.setItem('resumeData', JSON.stringify(data));
    // Count prompts completed (basic: count non-empty fields in personalInfo)
    let count = 0;
    if (personalInfo.name) count++;
    if (personalInfo.email) count++;
    if (personalInfo.phone) count++;
    if (education.length > 0) count++;
    if (skills.length > 0) count++;
    sessionStorage.setItem('resumePromptsCount', String(count));
    if (count >= 5) sessionStorage.setItem('resumePromptsCompleted', 'complete');
    else sessionStorage.removeItem('resumePromptsCompleted');
  }, [personalInfo, education, experience, skills, projects, certifications]);

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FileText className="h-8 w-8 text-thinksparkPurple-400" />
          Resume Builder
        </h1>
        <div className="flex justify-end mb-4">
          <Button onClick={downloadResume} className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
            <Download className="h-4 w-4" /> Download Resume
          </Button>
        </div>
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
          
          {/* Resume Preview Section */}
          <div>
            <div ref={resumeRef} className="bg-white p-6 rounded shadow-md border border-gray-200">
              {/* Render the resume preview here, e.g. personalInfo, education, experience, skills, etc. */}
              <h2 className="text-2xl font-bold mb-2">{personalInfo.name || 'Your Name'}</h2>
              <div className="text-lg text-gray-600 mb-2">{personalInfo.title || 'Professional Title'}</div>
              <div className="text-sm text-gray-500 mb-4">{personalInfo.email} | {personalInfo.phone} | {personalInfo.location}</div>
              <div className="mb-4"><b>Summary:</b> {personalInfo.summary}</div>
              <div className="mb-2 font-semibold">Education</div>
              <ul className="mb-4">
                {education.map(edu => (
                  <li key={edu.id}>{edu.degree} in {edu.field}, {edu.institution} ({edu.startDate} - {edu.endDate})</li>
                ))}
              </ul>
              <div className="mb-2 font-semibold">Experience</div>
              <ul className="mb-4">
                {experience.map(exp => (
                  <li key={exp.id}>{exp.position} at {exp.company}, {exp.location} ({exp.startDate} - {exp.endDate})<br />{exp.description}</li>
                ))}
              </ul>
              <div className="mb-2 font-semibold">Skills</div>
              <ul className="mb-4">
                {skills.map(skill => (
                  <li key={skill.id}>{skill.name} (Level: {skill.level})</li>
                ))}
              </ul>
              <div className="mb-2 font-semibold">Projects</div>
              <ul className="mb-4">
                {projects.map(proj => (
                  <li key={proj.id}>{proj.name}: {proj.description}</li>
                ))}
              </ul>
              <div className="mb-2 font-semibold">Certifications</div>
              <ul>
                {certifications.map(cert => (
                  <li key={cert.id}>{cert.name} - {cert.issuer} ({cert.date})</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilder;
