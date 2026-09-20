import { supabase } from '@/lib/supabase'; // adjust import path to your supabase client

export interface Flashcard {
  id: string;
  set_id: string;
  question: string;
  answer: string;
  created_at?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Generates quiz options from an array of flashcards
export const generateQuiz = (cards: Flashcard[]): QuizQuestion[] => {
  if (!cards || cards.length === 0) return [];

  return cards.map((card: Flashcard) => {
    const wrongAnswers = cards
      .filter((c: Flashcard) => c.id !== card.id)
      .map((c: Flashcard) => c.answer);

    const selectedDistractors = shuffleArray(wrongAnswers).slice(0, 3);
    const options = shuffleArray([card.answer, ...selectedDistractors]);

    return {
      id: card.id,
      question: card.question,
      options,
      correctAnswer: card.answer,
    };
  });
};

// Fetches flashcards from Supabase by set_id and generates the quiz
export const generateQuizForSet = async (setId: string): Promise<QuizQuestion[]> => {
  const { data: cards, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('set_id', setId);

  if (error) throw new Error(error.message);
  return generateQuiz(cards || []);
};