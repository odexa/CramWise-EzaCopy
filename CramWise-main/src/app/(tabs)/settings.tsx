import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { ThemeMode, useTheme } from '../../contexts/ThemeContext';

export default function SettingsScreen() {
  const { theme, actualTheme, setTheme } = useTheme();
  const [showAbout, setShowAbout] = useState(false);
  const isDark = actualTheme === 'dark';
  const colors = isDark
    ? {
        background: '#0F172A',
        text: '#F8FAFC',
        card: '#1E293B',
        border: '#334155',
        muted: '#CBD5E1',
        accent: '#3B82F6',
      }
    : {
        background: '#F9FAFB',
        text: '#0F172A',
        card: '#FFFFFF',
        border: '#D1D5DB',
        muted: '#64748B',
        accent: '#3B82F6',
      };

  const themeOptions: { label: string; value: ThemeMode }[] = [
    { label: 'Light Mode', value: 'light' },
    { label: 'Dark Mode', value: 'dark' },
    { label: 'System Mode', value: 'system' },
  ];

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.background,
      }}
    >
      <View style={{ width: '100%', maxWidth: 390, flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            backgroundColor: colors.background,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 28,
              fontWeight: '800',
              marginBottom: 24,
            }}
          >
            Settings
          </Text>

          {themeOptions.map((option) => {
            const isSelected = theme === option.value;

            return (
              <Pressable
                key={option.value}
                onPress={() => setTheme(option.value)}
                style={{
                  backgroundColor: isSelected ? colors.accent : colors.card,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.accent : colors.border,
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    color: isSelected ? '#F8FAFC' : colors.text,
                    fontSize: 17,
                    fontWeight: '600',
                  }}
                >
                  {option.label}
                </Text>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    borderWidth: 2,
                    borderColor: isSelected ? '#FFFFFF' : colors.muted,
                    backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                  }}
                />
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => setShowAbout(true)}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: '600' }}>
              About CramWise
            </Text>
            <Text style={{ color: colors.accent, fontSize: 24 }}>→</Text>
          </Pressable>
        </ScrollView>
      </View>

      <Modal
        visible={showAbout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAbout(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 20,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 14 }}>
              About CramWise
            </Text>
            <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }}>
              CramWise is your smart study buddy that makes cramming less stressful. Create flashcards, take quick quizzes, and review smarter with spaced repetition to retain more in less time.
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14, marginTop: 12 }}>
              Version 1.0.0
            </Text>
            <Pressable
              onPress={() => setShowAbout(false)}
              style={{
                alignSelf: 'flex-end',
                backgroundColor: colors.accent,
                borderRadius: 10,
                marginTop: 20,
                paddingHorizontal: 18,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}