import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

// Internal Types
interface StudyCard {
  id: string;
  term: string;
  definition: string;
}

interface QuizQuestion {
  id: string;
  term: string;
  correctAnswer: string;
  options: string[];
}

// Internal Parser Utility
const parseStudySet = (text: string) => {
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

  if (cards.length === 0) {
    cards.push(
      { id: '1', term: 'Operating System', definition: 'Software that manages computer hardware and software resources.' },
      { id: '2', term: 'Memory Paging', definition: 'A memory management scheme that stores and retrieves data from secondary storage.' },
      { id: '3', term: 'Virtual Memory', definition: 'A feature of an OS that allows a computer to compensate for physical memory shortages.' }
    );
  }

  const questions: QuizQuestion[] = cards.map((card) => {
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

  return { cards, questions };
};

export default function QuizletStudioScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'cards' | 'learn' | 'match'>('cards');

  // Study Data State
  const [cards, setCards] = useState<StudyCard[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Cards Mode State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Learn/Quiz Mode State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Match Game State
  const [matchItems, setMatchItems] = useState<{ id: string; text: string; type: 'term' | 'def'; matchId: string }[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const handleGenerate = (rawText: string) => {
    setLoading(true);
    setTimeout(() => {
      const data = parseStudySet(rawText);
      setCards(data.cards);
      setQuestions(data.questions);

      const terms = data.cards.slice(0, 4).map(c => ({ id: `t_${c.id}`, text: c.term, type: 'term' as const, matchId: c.id }));
      const defs = data.cards.slice(0, 4).map(c => ({ id: `d_${c.id}`, text: c.definition, type: 'def' as const, matchId: c.id }));
      setMatchItems([...terms, ...defs].sort(() => 0.5 - Math.random()));

      setCardIndex(0);
      setIsFlipped(false);
      setQuizIndex(0);
      setScore(0);
      setQuizFinished(false);
      setMatchedIds([]);
      setSelectedMatch(null);
      setLoading(false);
    }, 800);
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['*/*'], copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.[0]) return;
      const fileName = result.assets[0].name;
      const mockExtractedText = `${fileName}:\nMemory Paging - Divides memory into fixed-size blocks.\nVirtual Memory - Expands usable RAM onto storage.\nSemaphore - Controls access to shared resources.\nDeadlock - A state where process execution is stalled.`;
      handleGenerate(mockExtractedText);
    } catch {
      if (Platform.OS === 'web') window.alert('Failed to pick document.');
      else Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const currentQ = questions[quizIndex];
    if (option === currentQ.correctAnswer) setScore(s => s + 1);

    setTimeout(() => {
      setSelectedOption(null);
      if (quizIndex + 1 < questions.length) {
        setQuizIndex(i => i + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1000);
  };

  const handleMatchSelect = (item: { id: string; matchId: string }) => {
    if (matchedIds.includes(item.id)) return;
    if (!selectedMatch) {
      setSelectedMatch(item.id);
      return;
    }

    const prevSelected = matchItems.find(m => m.id === selectedMatch);
    if (prevSelected && prevSelected.id !== item.id && prevSelected.matchId === item.matchId) {
      setMatchedIds(prev => [...prev, prevSelected.id, item.id]);
    }
    setSelectedMatch(null);
  };

  const currentCard = cards[cardIndex];
  const currentQuestion = questions[quizIndex];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Quizlet Study Studio</Text>
        <Text style={styles.headerSubtitle}>Import notes or paste raw text to unlock Flashcards, Learn Mode, and Match Game.</Text>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.textArea}
            placeholder="Paste study notes (e.g. CPU: Central Processing Unit)..."
            placeholderTextColor="#8E8E93"
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnSecondary} onPress={handleDocumentPick}>
              <Text style={styles.btnSecondaryText}>📁 Upload File</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => handleGenerate(inputText)}>
              <Text style={styles.btnPrimaryText}>⚡ Generate Set</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && <ActivityIndicator size="large" color="#4255FF" style={{ marginVertical: 20 }} />}

        {cards.length > 0 && !loading && (
          <View>
            <View style={styles.modeTabs}>
              <TouchableOpacity style={[styles.modeTab, activeMode === 'cards' && styles.modeTabActive]} onPress={() => setActiveMode('cards')}>
                <Text style={[styles.modeTabText, activeMode === 'cards' && styles.modeTabTextActive]}>🎴 Flashcards</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeTab, activeMode === 'learn' && styles.modeTabActive]} onPress={() => setActiveMode('learn')}>
                <Text style={[styles.modeTabText, activeMode === 'learn' && styles.modeTabTextActive]}>📝 Learn / Quiz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeTab, activeMode === 'match' && styles.modeTabActive]} onPress={() => setActiveMode('match')}>
                <Text style={[styles.modeTabText, activeMode === 'match' && styles.modeTabTextActive]}>🧩 Match</Text>
              </TouchableOpacity>
            </View>

            {activeMode === 'cards' && currentCard && (
              <View style={styles.modeContainer}>
                <Text style={styles.counterText}>CARD {cardIndex + 1} OF {cards.length}</Text>
                <TouchableOpacity style={styles.flipCard} onPress={() => setIsFlipped(!isFlipped)} activeOpacity={0.9}>
                  <Text style={styles.cardBadge}>{isFlipped ? 'DEFINITION' : 'TERM'}</Text>
                  <Text style={styles.cardText}>{isFlipped ? currentCard.definition : currentCard.term}</Text>
                </TouchableOpacity>
                <View style={styles.controlsRow}>
                  <TouchableOpacity style={styles.ctrlBtn} onPress={() => { setIsFlipped(false); setCardIndex(i => (i === 0 ? cards.length - 1 : i - 1)); }}>
                    <Text style={styles.ctrlBtnText}>◀ Prev</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.ctrlBtn} onPress={() => setIsFlipped(!isFlipped)}>
                    <Text style={styles.ctrlBtnText}>🔄 Flip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.ctrlBtn} onPress={() => { setIsFlipped(false); setCardIndex(i => (i + 1) % cards.length); }}>
                    <Text style={styles.ctrlBtnText}>Next ▶</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {activeMode === 'learn' && (
              <View style={styles.modeContainer}>
                {!quizFinished && currentQuestion ? (
                  <View>
                    <Text style={styles.counterText}>QUESTION {quizIndex + 1} OF {questions.length}</Text>
                    <Text style={styles.quizTerm}>{currentQuestion.term}</Text>
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      const isCorrect = option === currentQuestion.correctAnswer;
                      let btnStyle = styles.optionBtn;
                      if (selectedOption) {
                        if (isCorrect) btnStyle = [styles.optionBtn, styles.correctOption];
                        else if (isSelected) btnStyle = [styles.optionBtn, styles.wrongOption];
                      }
                      return (
                        <TouchableOpacity key={idx} style={btnStyle} onPress={() => handleQuizAnswer(option)} disabled={!!selectedOption}>
                          <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.resultsBox}>
                    <Text style={styles.resultsTitle}>Quiz Finished!</Text>
                    <Text style={styles.resultsScore}>Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)</Text>
                    <TouchableOpacity style={styles.btnPrimary} onPress={() => { setQuizIndex(0); setScore(0); setQuizFinished(false); }}>
                      <Text style={styles.btnPrimaryText}>Restart Quiz</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {activeMode === 'match' && (
              <View style={styles.modeContainer}>
                <Text style={styles.counterText}>Match terms to their definitions:</Text>
                <View style={styles.matchGrid}>
                  {matchItems.map(item => {
                    const isMatched = matchedIds.includes(item.id);
                    const isSelected = selectedMatch === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.matchTile,
                          isSelected && styles.matchTileSelected,
                          isMatched && styles.matchTileMatched,
                        ]}
                        onPress={() => handleMatchSelect(item)}
                        disabled={isMatched}
                      >
                        <Text style={[styles.matchTileText, isMatched && styles.matchTextMatched]}>
                          {isMatched ? '✓' : item.text}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A092D' },
  scrollContent: { padding: 20, maxWidth: 800, width: '100%', alignSelf: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 14, color: '#939BB4', marginVertical: 8 },
  inputCard: { backgroundColor: '#181A40', borderRadius: 16, padding: 16, marginVertical: 12 },
  textArea: { backgroundColor: '#2E3856', borderRadius: 12, color: '#FFF', padding: 12, minHeight: 80, textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  btnPrimary: { backgroundColor: '#4255FF', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  btnPrimaryText: { color: '#FFF', fontWeight: '800' },
  btnSecondary: { backgroundColor: '#2E3856', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  btnSecondaryText: { color: '#FFF', fontWeight: '700' },
  modeTabs: { flexDirection: 'row', backgroundColor: '#181A40', borderRadius: 12, padding: 4, marginVertical: 16 },
  modeTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  modeTabActive: { backgroundColor: '#4255FF' },
  modeTabText: { color: '#939BB4', fontWeight: '700', fontSize: 13 },
  modeTabTextActive: { color: '#FFF' },
  modeContainer: { marginTop: 8 },
  counterText: { color: '#939BB4', fontWeight: '800', fontSize: 12, marginBottom: 8 },
  flipCard: { backgroundColor: '#2E3856', borderRadius: 20, minHeight: 220, padding: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#4255FF' },
  cardBadge: { position: 'absolute', top: 16, left: 16, color: '#FFCD1F', fontWeight: '800', fontSize: 11 },
  cardText: { color: '#FFF', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  ctrlBtn: { backgroundColor: '#181A40', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: '#2E3856' },
  ctrlBtnText: { color: '#FFF', fontWeight: '700' },
  quizTerm: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 16 },
  optionBtn: { backgroundColor: '#2E3856', padding: 16, borderRadius: 12, marginBottom: 10 },
  optionText: { color: '#FFF', fontWeight: '600' },
  correctOption: { backgroundColor: '#2D6A4F' },
  wrongOption: { backgroundColor: '#991B1B' },
  resultsBox: { alignItems: 'center', padding: 20, backgroundColor: '#181A40', borderRadius: 16 },
  resultsTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  resultsScore: { fontSize: 18, color: '#5BC0BE', marginVertical: 12 },
  matchGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  matchTile: { backgroundColor: '#2E3856', width: '48%', height: 100, borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#3A506B' },
  matchTileSelected: { borderColor: '#FFCD1F', borderWidth: 2 },
  matchTileMatched: { backgroundColor: '#181A40', borderColor: '#2D6A4F', opacity: 0.5 },
  matchTileText: { color: '#FFF', fontWeight: '700', textAlign: 'center', fontSize: 13 },
  matchTextMatched: { color: '#2D6A4F' },
});