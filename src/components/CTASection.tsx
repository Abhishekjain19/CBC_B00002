
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-thinksparkPurple-400 to-thinksparkPurple-300 opacity-90 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full bg-white opacity-10"></div>
        <div className="absolute top-1/2 right-0 w-40 h-40 rounded-full bg-white opacity-10"></div>
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 rounded-full bg-white opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Coding Journey?
          </h2>
          
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of learners who are enhancing their skills with our AI-powered platform. Get started today and see the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-thinksparkPurple-500 hover:bg-gray-100 px-8" asChild>
              <Link to="/signup">
                Sign Up Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-thinksparkPurple-500" asChild>
              <Link to="/demo">
                Watch Demo
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-sm opacity-80">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1,200+</div>
              <div className="text-sm opacity-80">Quiz Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm opacity-80">Video Classes</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm opacity-80">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
