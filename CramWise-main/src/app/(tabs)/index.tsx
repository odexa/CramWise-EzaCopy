import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { session } = useAuth();
  const email = session?.user?.email ?? "there";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Welcome back</Text>
      <Text style={styles.email}>{email}</Text>

      <Text style={styles.sectionLabel}>Get started</Text>
      <View style={styles.card}>
        <Text style={styles.cardIcon}>📚</Text>
        <Text style={styles.cardTitle}>Create your first deck</Text>
        <Text style={styles.cardBody}>
          Build a set of flashcards to start studying.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  greeting: { color: "#fff", fontSize: 26, fontWeight: "800" },
  email: { color: "#9CA3AF", fontSize: 14, marginBottom: 32 },
  sectionLabel: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
  },
  cardIcon: { fontSize: 28, marginBottom: 12 },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardBody: { color: "#9CA3AF", fontSize: 14, lineHeight: 20 },
});
