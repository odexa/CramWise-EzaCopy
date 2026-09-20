import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.brandName}>CramWise</Text>

      <Text style={styles.title}>The best way to study.</Text>
      <Text style={styles.subtitle}>Sign up for free.</Text>

      <TouchableOpacity
        style={styles.emailButton}
        onPress={() => router.push("/sign-up")}
      >
        <Text style={styles.emailButtonText}>Sign up with email</Text>
      </TouchableOpacity>

      <Link href="/sign-in" style={styles.loginLink}>
        <Text style={styles.loginText}>
          Have an account? <Text style={styles.loginBold}>Log in</Text>
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  brandName: {
    fontSize: 40,
    fontWeight: "800",
    color: "#208AEF",
    marginBottom: 48,
    letterSpacing: -0.5,
  },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  subtitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
  },
  emailButton: {
    width: "100%",
    backgroundColor: "#208AEF",
    borderRadius: 30,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  emailButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  loginLink: { marginTop: 8 },
  loginText: { fontSize: 15, color: "#333" },
  loginBold: { fontWeight: "700", color: "#208AEF" },
});
