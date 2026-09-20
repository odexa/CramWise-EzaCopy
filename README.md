# CramWise Odeza Len's Copy

CramWise is a cross-platform mobile flashcard and study quiz application built with React Native, Expo, and Supabase. Designed to help students create study sets, generate practice quizzes, and track study progress seamlessly.

## Features

- User Authentication: Secure Sign-up / Sign-in flow powered by Supabase Auth and Row Level Security (RLS).
- Study Sets & Flashcards: Create, manage, and view flashcard decks saved to PostgreSQL in real time.
- Quiz Generator: Automatically turn flashcard decks into multiple-choice practice quizzes.
- Persistent Sessions: Automated session handling with @react-native-async-storage/async-storage.

## Tech Stack

- Framework: React Native with Expo
- Language: TypeScript
- Backend & Database: Supabase (PostgreSQL + RLS)
- State & Storage: React Hooks & @react-native-async-storage/async-storage
