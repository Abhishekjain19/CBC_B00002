
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Quiz Arena', path: '/quiz' },
    { label: 'AI Tools', path: '/ai-tools' },
    { label: 'Video Classes', path: '/video-classes' },
    { label: 'Innovation Hub', path: '/innovation-hub' },
  ];

  return (
    <nav className="w-full py-4 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-700 hover:text-thinksparkPurple-400 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            onClick={toggleMobileNav}
            className="md:hidden flex items-center"
            aria-label="Toggle mobile menu"
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileNavOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4 pt-2 pb-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-700 hover:text-thinksparkPurple-400 transition-colors px-2 py-1"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login" onClick={() => setMobileNavOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400 w-full" asChild>
                  <Link to="/signup" onClick={() => setMobileNavOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
