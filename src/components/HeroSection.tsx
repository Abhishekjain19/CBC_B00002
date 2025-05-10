
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, Code, GraduationCap, BookOpen } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white py-12 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-thinksparkPurple-100/40 to-white -z-10"></div>
      
      {/* Animated floating elements */}
      <div className="absolute top-20 right-10 w-24 h-24 rounded-full bg-thinksparkPurple-200/20 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-thinksparkPurple-300/10 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-thinksparkPurple-200/20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-thinksparkPurple-400 to-thinksparkPurple-300">
                Elevate Your Coding Skills
              </span>
              <br />
              With AI-Powered Learning
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              ThinkSpark combines interactive quizzes, AI-powered learning tools, and real-time video classes to create an immersive educational experience for coders at all levels.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400 text-white px-6" asChild>
                <Link to="/signup">
                  Get Started <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/explore">
                  Explore Features
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex flex-col items-center lg:items-start">
                <div className="p-2 bg-thinksparkPurple-100 rounded-full mb-3">
                  <Code className="h-6 w-6 text-thinksparkPurple-400" />
                </div>
                <p className="text-sm text-gray-700">Interactive Coding Challenges</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="p-2 bg-thinksparkPurple-100 rounded-full mb-3">
                  <GraduationCap className="h-6 w-6 text-thinksparkPurple-400" />
                </div>
                <p className="text-sm text-gray-700">AI-Powered Learning</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="p-2 bg-thinksparkPurple-100 rounded-full mb-3">
                  <BookOpen className="h-6 w-6 text-thinksparkPurple-400" />
                </div>
                <p className="text-sm text-gray-700">Live Video Classes</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-auto animate-scale-in">
            <div className="relative">
              {/* 3D-looking platform mockup */}
              <div className="rounded-xl bg-white shadow-2xl transform perspective-1000 rotate-y-3 rotate-x-2 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 overflow-hidden">
                <div className="p-1 bg-gradient-to-tr from-thinksparkPurple-400 to-thinksparkPurple-200 rounded-xl">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    
                    <div className="space-y-4 p-2">
                      {/* Mock quiz interface */}
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <div className="text-sm font-medium text-thinksparkPurple-400 mb-2">Quiz Arena</div>
                        <div className="h-4 w-3/4 bg-gray-100 rounded mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                          <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      
                      {/* Mock AI chat interface */}
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <div className="text-sm font-medium text-thinksparkPurple-400 mb-2">AI Assistant</div>
                        <div className="flex space-x-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-thinksparkPurple-100"></div>
                          <div className="space-y-1 flex-1">
                            <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                            <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 rounded-full bg-thinksparkPurple-200"></div>
                          <div className="space-y-1 flex-1">
                            <div className="h-2 w-4/5 bg-gray-100 rounded"></div>
                            <div className="h-2 w-3/5 bg-gray-100 rounded"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mock video class interface */}
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <div className="text-sm font-medium text-thinksparkPurple-400 mb-2">Video Classes</div>
                        <div className="h-20 bg-gray-100 rounded flex items-center justify-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-thinksparkPurple-300 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 w-full bg-gray-100 rounded"></div>
                          <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-thinksparkPurple-100 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-thinksparkPurple-200/50 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
