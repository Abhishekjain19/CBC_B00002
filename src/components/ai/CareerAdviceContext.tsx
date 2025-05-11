import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getAIResponse, AIMessage } from '@/utils/openRouterApi';
import { updateResumeProgress } from '@/utils/resumeProgress';

interface CareerAdviceContextType {
  addSearch: (query: string) => void;
  showCareerModal: boolean;
  careerPaths: string[];
  topicTrend: string;
  setShowCareerModal: (show: boolean) => void;
}

const CareerAdviceContext = createContext<CareerAdviceContextType | undefined>(undefined);

const userType = typeof window !== 'undefined' ? sessionStorage.getItem('userType') : null;

export const CareerAdviceProvider = ({ children }: { children: ReactNode }) => {
  if (userType === 'teacher') {
    // Provide a no-op context for teachers
    return (
      <CareerAdviceContext.Provider value={{
        addSearch: () => {},
        showCareerModal: false,
        careerPaths: [],
        topicTrend: '',
        setShowCareerModal: () => {},
      }}>
        {children}
      </CareerAdviceContext.Provider>
    );
  }

  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [careerPaths, setCareerPaths] = useState<string[]>([]);
  const [topicTrend, setTopicTrend] = useState('');

  const suggestCareerPaths = async (topic: string) => {
    try {
      const prompt = `List 3 possible career paths related to: ${topic}. Return as a comma-separated list.`;
      const messages: AIMessage[] = [
        { role: 'system', content: 'You are a career advisor.' },
        { role: 'user', content: prompt }
      ];
      const response = await getAIResponse(messages);
      setCareerPaths(response.split(',').map(s => s.trim()));
      setShowCareerModal(true);
      sessionStorage.setItem('resumeCareerTitle', topic);
    } catch {
      setCareerPaths([`Career in ${topic}`]);
      setShowCareerModal(true);
      sessionStorage.setItem('resumeCareerTitle', topic);
    }
  };

  const addSearch = (query: string) => {
    updateResumeProgress();
    setRecentTopics(prev => {
      const updated = [...prev, query].slice(-5);
      if (updated.length >= 4) {
        classifyFieldAndSuggestCareer(updated);
      }
      return updated;
    });
  };

  const classifyFieldAndSuggestCareer = async (topics: string[]) => {
    try {
      const prompt = `Given the following user searches: [${topics.join(", ")}]. What is the most relevant career field or job title that these searches relate to? Respond with only the field or job title, nothing else.`;
      const messages: AIMessage[] = [
        { role: 'system', content: 'You are a career advisor.' },
        { role: 'user', content: prompt }
      ];
      const response = await getAIResponse(messages);
      setTopicTrend(response);
      suggestCareerPaths(response);
    } catch {
      setTopicTrend('Technology');
      suggestCareerPaths('Technology');
    }
  };

  return (
    <CareerAdviceContext.Provider value={{ addSearch, showCareerModal, careerPaths, topicTrend, setShowCareerModal }}>
      {children}
    </CareerAdviceContext.Provider>
  );
};

export const useCareerAdvice = () => {
  const context = useContext(CareerAdviceContext);
  if (!context) throw new Error('useCareerAdvice must be used within CareerAdviceProvider');
  return context;
}; 