import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/lib/supabase';

interface FlashcardInput {
  question: string;
  answer: string;
}

export default function CreateSetScreen() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [cards, setCards] = useState<FlashcardInput[]>([
    { question: '', answer: '' },
    { question: '', answer: '' },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddCard = (): void => {
    setCards([...cards, { question: '', answer: '' }]);
  };

  const handleCardChange = (
    index: number,
    field: keyof FlashcardInput,
    value: string
  ): void => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const handleRemoveCard = (index: number): void => {
    if (cards.length <= 1) {
      Alert.alert('Error', 'A set must contain at least one card.');
      return;
    }
    setCards(cards.filter((_: FlashcardInput, i: number) => i !== index));
  };

  const handleSaveSet = async (): Promise<void> => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your study set.');
      return;
    }

    const isValid = cards.every(
      (c: FlashcardInput) => c.question.trim() !== '' && c.answer.trim() !== ''
    );

    if (!isValid) {
      Alert.alert('Error', 'Please fill out both Question and Answer for every card.');
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        Alert.alert('Error', 'You must be signed in to save study sets.');
        setLoading(false);
        return;
      }

      const { data: studySet, error: setError } = await supabase
        .from('study_sets')
        .insert([{ user_id: user.id, title, description }])
        .select()
        .single();

      if (setError) throw setError;

      const flashcardRecords = cards.map((card: FlashcardInput) => ({
        set_id: studySet.id,
        question: card.question.trim(),
        answer: card.answer.trim(),
      }));

      const { error: cardError } = await supabase
        .from('flashcards')
        .insert(flashcardRecords);

      if (cardError) throw cardError;

      Alert.alert('Success', 'Flashcard set created successfully!');

      setTitle('');
      setDescription('');
      setCards([
        { question: '', answer: '' },
        { question: '', answer: '' },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Study Set</Text>

      <TextInput
        style={styles.input}
        placeholder="Title (e.g., Computer Science 101)"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description (optional)"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.subHeader}>Flashcards</Text>

      {cards.map((card: FlashcardInput, index: number) => (
        <View key={index} style={styles.cardBox}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardIndexText}>Card {index + 1}</Text>
            {cards.length > 1 && (
              <TouchableOpacity onPress={() => handleRemoveCard(index)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Term / Question"
            value={card.question}
            onChangeText={(text: string) => handleCardChange(index, 'question', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Definition / Answer"
            value={card.answer}
            onChangeText={(text: string) => handleCardChange(index, 'answer', text)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
        <Text style={styles.addButtonText}>+ Add Another Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSaveSet}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save & Create Set</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8F9FA' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#1A1A1A' },
  subHeader: { fontSize: 18, fontWeight: '600', marginVertical: 12, color: '#333' },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  cardBox: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardIndexText: { fontWeight: '600', color: '#4A5568' },
  removeText: { color: '#E53E3E', fontWeight: '500' },
  addButton: {
    backgroundColor: '#EDF2F7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: { color: '#2B6CB0', fontWeight: '600' },
  saveButton: {
    backgroundColor: '#3182CE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  disabledButton: { opacity: 0.6 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});