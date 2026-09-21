import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateDeckScreen() {
  const router = useRouter();
  const [deckTitle, setDeckTitle] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [cards, setCards] = useState([{ id: '1', question: '', answer: '' }]);

  const handleAddCard = () => {
    setCards((prev) => [...prev, { id: Date.now().toString(), question: '', answer: '' }]);
  };

  const handleRemoveCard = (id: string) => {
    if (cards.length === 1) return;
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleCardChange = (id: string, field: 'question' | 'answer', value: string) => {
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, [field]: value } : card)));
  };

  const handleSaveDeck = () => {
    if (!deckTitle.trim()) {
      if (Platform.OS === 'web') window.alert('Please enter a deck title.');
      else Alert.alert('Error', 'Please enter a deck title.');
      return;
    }
    if (Platform.OS === 'web') window.alert(`Deck "${deckTitle}" saved with ${cards.length} cards!`);
    else Alert.alert('Success', `Deck "${deckTitle}" saved!`);
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Create New Study Deck</Text>
        <View style={styles.cardSection}>
          <Text style={styles.label}>Deck Title *</Text>
          <TextInput style={styles.input} placeholder="e.g. Operating Systems" placeholderTextColor="#8E8E93" value={deckTitle} onChangeText={setDeckTitle} />
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Deck summary..." placeholderTextColor="#8E8E93" multiline value={deckDescription} onChangeText={setDeckDescription} />
        </View>
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
            <TextInput style={styles.input} placeholder="e.g. What is Memory Paging?" placeholderTextColor="#8E8E93" value={card.question} onChangeText={(t) => handleCardChange(card.id, 'question', t)} />
            <Text style={styles.label}>Answer / Definition *</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="e.g. A memory management scheme..." placeholderTextColor="#8E8E93" multiline value={card.answer} onChangeText={(t) => handleCardChange(card.id, 'answer', t)} />
          </View>
        ))}
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
  container: { flex: 1, backgroundColor: '#0B132B' },
  scrollContent: { padding: 20, maxWidth: 800, width: '100%', alignSelf: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 16 },
  cardSection: { backgroundColor: '#1C2541', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionHeading: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#5BC0BE', marginTop: 8, marginBottom: 4 },
  input: { backgroundColor: '#0B132B', borderRadius: 8, borderWidth: 1, borderColor: '#3A506B', color: '#FFF', padding: 10 },
  textArea: { minHeight: 60, textAlignVertical: 'top' },
  cardItem: { backgroundColor: '#1C2541', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIndexText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  removeBtnText: { color: '#FF5A5F', fontWeight: '600', fontSize: 12 },
  addCardBtn: { borderWidth: 1, borderColor: '#5BC0BE', borderRadius: 10, padding: 12, alignItems: 'center', marginVertical: 8 },
  addCardBtnText: { color: '#5BC0BE', fontWeight: '700' },
  saveDeckBtn: { backgroundColor: '#5BC0BE', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  saveDeckBtnText: { color: '#0B132B', fontSize: 16, fontWeight: '800' },
});