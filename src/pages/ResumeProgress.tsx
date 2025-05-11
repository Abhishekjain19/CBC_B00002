import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const userType = typeof window !== 'undefined' ? sessionStorage.getItem('userType') : null;
const ResumeProgress = () => {
  if (userType === 'teacher') {
    return (
      <Layout>
        <div className="container py-12 max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-6">Resume Progress</h1>
          <div className="text-red-600 font-semibold">Teachers do not have access to Resume Progress.</div>
        </div>
      </Layout>
    );
  }

  const navigate = useNavigate();
  const promptsCount = Number(sessionStorage.getItem('resumePromptsCount') || 0);
  const isComplete = sessionStorage.getItem('resumePromptsCompleted') === 'complete';

  return (
    <Layout>
      <div className="container py-12 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Resume Progress</h1>
        <div className="mb-4">
          {isComplete ? (
            <div className="text-green-700 font-semibold mb-2">You have completed all prompts! 🎉</div>
          ) : (
            <div className="text-yellow-700 font-semibold mb-2">
              You have completed {promptsCount}/5 prompts. Please complete the remaining prompts to finish your resume.
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Button
            className="bg-thinksparkPurple-300 hover:bg-thinksparkPurple-400"
            onClick={() => navigate('/resume-builder')}
            disabled={isComplete}
          >
            Continue
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem('resumeData');
              sessionStorage.removeItem('resumePromptsCount');
              sessionStorage.removeItem('resumePromptsCompleted');
              navigate('/resume-builder?fresh=1');
            }}
          >
            Start Fresh
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeProgress; 