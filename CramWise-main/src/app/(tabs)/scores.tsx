import { StyleSheet, Text, View } from "react-native";

export default function Scores() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏆</Text>
      <Text style={styles.title}>Your quiz scores will show up here</Text>
      <Text style={styles.body}>Once you complete quizzes, track your best scores and progress over time.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center", padding: 24 },
  emoji: { fontSize: 40, marginBottom: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  body: { color: "#9CA3AF", fontSize: 14, textAlign: "center" },
});