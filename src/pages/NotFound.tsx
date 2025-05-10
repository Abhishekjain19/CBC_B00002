
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
        <h1 className="text-9xl font-extrabold text-thinksparkPurple-300">404</h1>
        <div className="mb-8">
          <div className="h-1 w-20 bg-thinksparkPurple-200 mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold mb-3">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        
        <div className="space-x-4">
          <Button asChild className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
