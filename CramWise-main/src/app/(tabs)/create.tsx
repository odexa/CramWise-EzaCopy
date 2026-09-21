import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateDeckScreen() {
  const router = useRouter();

  const [deckTitle, setDeckTitle] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [cards, setCards] = useState([
    { id: '1', question: '', answer: '' },
  ]);

  // Add a new blank flashcard row
  const handleAddCard = () => {
    setCards((prev) => [
      ...prev,
      { id: Date.now().toString(), question: '', answer: '' },
    ]);
  };

  // Remove a card row
  const handleRemoveCard = (id: string) => {
    if (cards.length === 1) {
      showAlert('Notice', 'A deck must contain at least one card.');
      return;
    }
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  // Update question/answer text for a specific card
  const handleCardChange = (id: string, field: 'question' | 'answer', value: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  // Helper alert compatible with both Web and Mobile
  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
    }
  };

  // Save the entire deck
  const handleSaveDeck = () => {
    if (!deckTitle.trim()) {
      showAlert('Validation Error', 'Please enter a title for your deck.');
      return;
    }

    const invalidCard = cards.find(
      (c) => !c.question.trim() || !c.answer.trim()
    );
    if (invalidCard) {
      showAlert(
        'Validation Error',
        'Please ensure all cards have both a Question and an Answer.'
      );
      return;
    }

    const newDeck = {
      id: `deck_${Date.now()}`,
      title: deckTitle.trim(),
      description: deckDescription.trim(),
      createdAt: new Date().toISOString(),
      cards: cards.map((c) => ({
        id: c.id,
        question: c.question.trim(),
        answer: c.answer.trim(),
      })),
    };

    console.log('Deck created successfully:', newDeck);

    showAlert(
      'Success! 🎉',
      `Deck "${deckTitle}" with ${cards.length} cards has been created!`,
      () => {
        setDeckTitle('');
        setDeckDescription('');
        setCards([{ id: '1', question: '', answer: '' }]);
        router.push('/(tabs)');
      }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Create New Study Deck</Text>
        <Text style={styles.headerSubtitle}>
          Build custom flashcard decks to practice for exams.
        </Text>

        {/* Deck Details Card */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeading}>Deck Details</Text>

          <Text style={styles.label}>Deck Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Operating Systems - Unit 1"
            placeholderTextColor="#8E8E93"
            value={deckTitle}
            onChangeText={setDeckTitle}
          />

          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Key terms for memory management and process scheduling."
            placeholderTextColor="#8E8E93"
            multiline
            numberOfLines={3}
            value={deckDescription}
            onChangeText={setDeckDescription}
          />
        </View>

        {/* Flashcards Section */}
        <Text style={styles.sectionHeading}>Flashcards ({cards.length})</Text>

        {cards.map((card, index) => (
          <View key={card.id} style={styles.cardItem}>
            <View style={styles.cardItemHeader}>
              <Text style={styles.cardIndexText}>Card {index + 1}</Text>
              {cards.length > 1 && (
                <TouchableOpacity onPress={() => handleRemoveCard(card.id)}>
                  <Text style={styles.removeBtnText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.label}>Question / Term *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. What is Memory Paging?"
              placeholderTextColor="#8E8E93"
              value={card.question}
              onChangeText={(text) => handleCardChange(card.id, 'question', text)}
            />

            <Text style={styles.label}>Answer / Definition *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. A memory management scheme that divides physical memory into fixed-size blocks."
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={2}
              value={card.answer}
              onChangeText={(text) => handleCardChange(card.id, 'answer', text)}
            />
          </View>
        ))}

        {/* Action Buttons */}
        <TouchableOpacity style={styles.addCardBtn} onPress={handleAddCard}>
          <Text style={styles.addCardBtnText}>+ Add Another Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveDeckBtn} onPress={handleSaveDeck}>
          <Text style={styles.saveDeckBtnText}>Save & Create Deck</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginVertical: 8,
    marginBottom: 20,
  },
  cardSection: {
    backgroundColor: '#1C2541',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3A506B',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5BC0BE',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0B132B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A506B',
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  cardItem: {
    backgroundColor: '#1C2541',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A506B',
  },
  cardItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardIndexText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  removeBtnText: {
    color: '#FF5A5F',
    fontWeight: '600',
    fontSize: 13,
  },
  addCardBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#5BC0BE',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  addCardBtnText: {
    color: '#5BC0BE',
    fontSize: 15,
    fontWeight: '700',
  },
  saveDeckBtn: {
    backgroundColor: '#5BC0BE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveDeckBtnText: {
    color: '#0B132B',
    fontSize: 16,
    fontWeight: '800',
  },
});