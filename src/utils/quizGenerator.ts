
import { getAIResponse, AIMessage } from './openRouterApi';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function generateQuizQuestions(
  topic: string, 
  difficulty: string, 
  count: number = 3
): Promise<QuizQuestion[]> {
  try {
    const prompt = `
Create ${count} multiple choice questions about ${topic} at ${difficulty} difficulty level.
Each question should have 4 options and only one correct answer.
Format your response as a JSON array with the following structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Correct option text",
    "explanation": "Explanation of why this is the correct answer"
  }
]
Ensure the JSON is valid and properly formatted. Make challenging questions that test deep understanding.`;

    const messages: AIMessage[] = [
      { 
        role: "system", 
        content: "You are an expert computer science educator who creates precise, challenging quiz questions."
      },
      { role: "user", content: prompt }
    ];

    const response = await getAIResponse(messages);
    
    // Parse the JSON from the response
    // The response might contain markdown code blocks or extra text
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                      response.match(/```\n([\s\S]*?)\n```/) || 
                      [null, response];
                      
    const jsonString = jsonMatch[1] || response;
    const cleanedJson = jsonString.trim().replace(/^```json|```$/g, '').trim();
    
    // Parse the JSON
    const questions = JSON.parse(cleanedJson) as QuizQuestion[];
    return questions;
    
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions');
  }
}
