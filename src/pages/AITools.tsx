
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Message, MessageSquare, Mic, Book } from 'lucide-react';

// Import AI components
import ChatbotSection from '@/components/ai/ChatbotSection';
import VoiceSummarizerSection from '@/components/ai/VoiceSummarizerSection';
import StoryModeSection from '@/components/ai/StoryModeSection';

const AITools = () => {
  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">AI Learning Tools</h1>
        
        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="chatbot" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>AI Chatbot</span>
            </TabsTrigger>
            <TabsTrigger value="voice-summarizer" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span>Voice Summarizer</span>
            </TabsTrigger>
            <TabsTrigger value="story-mode" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Story Mode</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chatbot">
            <ChatbotSection />
          </TabsContent>
          
          <TabsContent value="voice-summarizer">
            <VoiceSummarizerSection />
          </TabsContent>
          
          <TabsContent value="story-mode">
            <StoryModeSection />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AITools;
