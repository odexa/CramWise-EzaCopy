import { StyleSheet, Text, View } from "react-native";

export default function History() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🕓</Text>
      <Text style={styles.title}>No study history yet</Text>
      <Text style={styles.body}>
        Decks and quizzes you've completed will show up here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emoji: { fontSize: 40, marginBottom: 16 },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  body: { color: "#9CA3AF", fontSize: 14, textAlign: "center" },
});
