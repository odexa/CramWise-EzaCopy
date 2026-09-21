export interface StudyCard {
    id: string;
    term: string;
    definition: string;
  }
  
  export interface QuizQuestion {
    id: string;
    term: string;
    correctAnswer: string;
    options: string[];
  }
  
  export const parseStudySet = (text: string, title: string = 'Study Set') => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const cards: StudyCard[] = [];
  
    lines.forEach((line, idx) => {
      const delimiterMatch = line.match(/[:=\-\t]/);
      if (delimiterMatch && delimiterMatch.index) {
        const term = line.substring(0, delimiterMatch.index).trim();
        const definition = line.substring(delimiterMatch.index + 1).trim();
        if (term && definition) {
          cards.push({ id: `card_${Date.now()}_${idx}`, term, definition });
        }
      } else if (line.length > 10) {
        cards.push({
          id: `card_${Date.now()}_${idx}`,
          term: `Concept ${idx + 1}`,
          definition: line,
        });
      }
    });
  
    // Default fallback if text format is plain
    if (cards.length === 0) {
      cards.push(
        { id: '1', term: 'Operating System', definition: 'Software that manages computer hardware and software resources.' },
        { id: '2', term: 'Memory Paging', definition: 'A memory management scheme that stores and retrieves data from secondary storage.' },
        { id: '3', term: 'Virtual Memory', definition: 'A feature of an OS that allows a computer to compensate for physical memory shortages.' }
      );
    }
  
    // Generate 4-option multiple choice questions
    const questions: QuizQuestion[] = cards.map((card, idx) => {
      const wrongAnswers = cards
        .filter(c => c.id !== card.id)
        .map(c => c.definition);
  
      while (wrongAnswers.length < 3) {
        wrongAnswers.push(`Alternative definition ${wrongAnswers.length + 1}`);
      }
  
      const shuffledOptions = [card.definition, ...wrongAnswers.slice(0, 3)].sort(() => 0.5 - Math.random());
  
      return {
        id: `q_${card.id}`,
        term: card.term,
        correctAnswer: card.definition,
        options: shuffledOptions,
      };
    });
  
    return { title, cards, questions };
  };