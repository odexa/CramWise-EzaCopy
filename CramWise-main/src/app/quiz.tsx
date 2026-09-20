import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { generateQuizForSet, QuizQuestion } from '@/utils/quizGenerator';

export default function QuizScreen({ setId }: { setId: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [setId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const data = await generateQuizForSet(setId);
      setQuestions(data);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    if (option === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      Alert.alert('Quiz Finished!', `Final Score: ${score} / ${questions.length}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3182CE" />
      </View>
    );
  }

  // Handle sets with no questions to prevent runtime errors
  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No flashcards found in this set.</Text>
      </View>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Question {currentIndex + 1} of {questions.length}
      </Text>

      <View style={styles.card}>
        <Text style={styles.questionText}>{currentQ.question}</Text>
      </View>

      {currentQ.options.map((option, idx) => {
        const isSelected = selectedOption === option;
        const isCorrect = option === currentQ.correctAnswer;

        let btnStyle = styles.optionBtn;
        if (selectedOption !== null) {
          if (isCorrect) btnStyle = { ...styles.optionBtn, ...styles.correctBtn };
          else if (isSelected) btnStyle = { ...styles.optionBtn, ...styles.wrongBtn };
        }

        return (
          <TouchableOpacity
            key={idx}
            style={btnStyle}
            onPress={() => handleSelectOption(option)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}

      {selectedOption !== null && (
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex + 1 === questions.length ? 'Finish' : 'Next Question'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#718096', textAlign: 'center' },
  progress: { fontSize: 14, color: '#666', marginBottom: 12 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#E0E0E0' },
  questionText: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  optionBtn: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#CCC', marginBottom: 10 },
  correctBtn: { backgroundColor: '#C6F6D5', borderColor: '#38A169' },
  wrongBtn: { backgroundColor: '#FED7D7', borderColor: '#E53E3E' },
  optionText: { fontSize: 16, color: '#2D3748' },
  nextBtn: { backgroundColor: '#3182CE', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  nextText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});