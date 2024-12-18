import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { Colors } from "@/constants/Colors"; // Customize your colors in a separate file
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StatusBar } from "react-native";

const Text = ThemedText;
const View = ThemedView;

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      setLoading(true); // Start loading indicator
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("Login success");
          setError("");
          router.replace("/(tabs)/home");
        })
        .catch((err) => {
          console.error("error login", err.message);
          if (err.message.includes("auth/invalid-credential")) {
            setError("Invalid email or password");
          } else if (err.message.includes("network error")) {
            setError("Network error, check your internet connection!");
          } else {
            setError("An unknown error occurred. Please try again.");
          }
          // Alert.alert("Login error", error);
          console.log("Error", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading indicator
        });
    } else {
      Alert.alert(
        "Input error",
        "Please fill out both email and password fields."
      );
    }
  };

  const navigateToSignUp = () => {
    router.push("/(auth)/Signup");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.tint }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Log in to your account
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[
            styles.input,
            {
              width: "90%", // Covers 90% of the screen width
              maxWidth: 400, // Ensures it doesn’t get too wide on larger screens
              alignSelf: "center",
            },
            { backgroundColor: theme.background, color: theme.text },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.icon}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={[
            styles.input,
            {
              width: "90%", // Covers 90% of the screen width
              maxWidth: 400, // Ensures it doesn’t get too wide on larger screens
              alignSelf: "center",
            },
            { backgroundColor: theme.background, color: theme.text },
          ]}
          placeholder="Password"
          placeholderTextColor={theme.icon}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: "90%", // Adaptive to screen width
              maxWidth: 400, // Limit maximum width
              alignSelf: "center", // Center the button
            },
            loading
              ? { backgroundColor: theme.teal }
              : { backgroundColor: theme.tint },
          ]}
          onPress={onHandleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" /> // Show spinner
          ) : (
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Log In
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToSignUp}>
          <Text style={[styles.linkText, { color: theme.text }]}>
            Don't have an account?{" "}
            <Text style={[styles.loginText, { color: theme.tint }]}>
              {" "}
              Signup
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:
      Platform.OS === "ios"
        ? null
        : Platform.OS === "android"
        ? StatusBar.currentHeight
        : null,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    padding: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: -9,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  errorText: {
    color: "#ff6b00",
    marginBottom: 12,
    // backgroundColor: "#5b0000",
    padding: 3,
    textAlign: "center",
    borderRadius: 7,
  },
  input: {
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    width: screenWidth > 500 ? "50%" : "90%", // Adjust based on screen width
    maxWidth: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    width: "100%",
    maxWidth: 400, // Ensures a consistent width for large screens
  },

  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: Colors.grey,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    textAlign: "center",
  },
  loginText: {
    fontWeight: "bold",
  },
});

export default LoginScreen;
