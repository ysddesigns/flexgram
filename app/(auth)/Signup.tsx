import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  useColorScheme,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    username: "",
    password: "",
    phone: "",
  });

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  // Validation
  const validateForm = () => {
    const errors = {
      email: "",
      username: "",
      password: "",
      phone: "",
    };
    if (!email) {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Invalid email format.";
      }
    }

    if (!username) {
      errors.username = "Username is required.";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!phone) {
      errors.phone = "Phone number is required.";
    }

    setErrorMessages(errors);
    return Object.values(errors).every((msg) => msg === "");
  };

  const onHandleSignup = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: username });
      await sendEmailVerification(cred.user);

      const userData = {
        id: cred.user.uid,
        email: cred.user.email,
        name: cred.user.displayName,
        about: "Available",
        phone: phone,
      };

      await setDoc(doc(db, "users", cred.user.uid), userData);

      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: username,
          phone: phone,
        })
      );

      Alert.alert(
        "Verification Email Sent",
        "Please check your email to verify your account."
      );
      router.replace("/(auth)/VerifyEmail");
    } catch (error: any) {
      console.error("Signup Error:", error);
      Alert.alert("Signup Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.tint }]}>
          Welcome To FlexGram
        </Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Register your account
        </Text>
        <Text style={[styles.signupText, { color: theme.text }]}>Sign Up</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          placeholder="Username"
          placeholderTextColor={theme.text + "80"}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        {errorMessages.username && (
          <Text style={[styles.errorText, { color: theme.error }]}>
            {errorMessages.username}
          </Text>
        )}

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.text + "80"}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errorMessages.email && (
          <Text style={[styles.errorText, { color: theme.error }]}>
            {errorMessages.email}
          </Text>
        )}

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          placeholder="Phone Number"
          placeholderTextColor={theme.text + "80"}
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
        />
        {errorMessages.phone && (
          <Text style={[styles.errorText, { color: theme.error }]}>
            {errorMessages.phone}
          </Text>
        )}

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          placeholder="Password"
          placeholderTextColor={theme.text + "80"}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errorMessages.password && (
          <Text style={[styles.errorText, { color: theme.error }]}>
            {errorMessages.password}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: loading ? theme.teal : theme.tint,
            alignSelf: "center",
          },
        ]}
        onPress={onHandleSignup}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Sign Up"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Sign Up
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.text }]}>
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
          <Text style={[styles.loginText, { color: theme.tint }]}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
    flexWrap: "wrap",
    marginBottom: 15,
    padding: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: -12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  signupText: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 15,
    padding: 12,
  },
  inputWrapper: {
    width: "100%",
    maxWidth: 400,
  },
  input: {
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    width: screenWidth > 500 ? "50%" : "90%",
    maxWidth: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    width: screenWidth > 500 ? "50%" : "90%",
    maxWidth: 400,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
  },
  loginText: {
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
});
