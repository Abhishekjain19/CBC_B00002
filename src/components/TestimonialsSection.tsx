
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    content: "ThinkSpark's AI tools helped me understand complex algorithms through interactive visualizations. The quiz arena keeps me engaged and I've seen my coding skills improve significantly.",
    author: {
      name: 'Alex Morgan',
      role: 'Computer Science Student',
      avatar: 'https://i.pravatar.cc/150?img=11'
    }
  },
  {
    id: 2,
    content: "As a teacher, I love how ThinkSpark's video classes let me monitor student engagement in real-time. The AI features make creating and grading assignments so much easier.",
    author: {
      name: 'Dr. Sarah Johnson',
      role: 'Programming Instructor',
      avatar: 'https://i.pravatar.cc/150?img=20'
    }
  },
  {
    id: 3,
    content: "The Innovation Hub allowed me to showcase my project and get valuable feedback from peers. ThinkSpark's AI summarizer helped me improve my documentation significantly.",
    author: {
      name: 'Miguel Sanchez',
      role: 'Junior Developer',
      avatar: 'https://i.pravatar.cc/150?img=12'
    }
  },
  {
    id: 4,
    content: "I've tried many coding platforms, but ThinkSpark's combination of AI tools and human instruction creates a unique learning experience that adapts to my pace.",
    author: {
      name: 'Leila Ahmed',
      role: 'Self-taught Programmer',
      avatar: 'https://i.pravatar.cc/150?img=23'
    }
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how ThinkSpark is transforming the way people learn to code.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Desktop view with multiple testimonials */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover"
              >
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
                      <AvatarFallback>{testimonial.author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.author.role}</div>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.content}</p>
              </div>
            ))}
          </div>
          
          {/* Mobile view with carousel */}
          <div className="md:hidden">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={testimonials[activeIndex].author.avatar} 
                      alt={testimonials[activeIndex].author.name} 
                    />
                    <AvatarFallback>
                      {testimonials[activeIndex].author.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <div className="font-medium">{testimonials[activeIndex].author.name}</div>
                  <div className="text-sm text-gray-600">{testimonials[activeIndex].author.role}</div>
                </div>
              </div>
              <p className="text-gray-700">{testimonials[activeIndex].content}</p>
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={prevTestimonial}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </Button>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        index === activeIndex 
                          ? "bg-thinksparkPurple-400" 
                          : "bg-gray-300"
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={nextTestimonial}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
