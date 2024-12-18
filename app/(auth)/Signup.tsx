import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";

const Text = ThemedText;
const View = ThemedView;

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  // Validation
  const validateForm = () => {
    if (!email || !username || !password) {
      Alert.alert("Input Error", "Please fill out all fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return false;
    }
    if (username.length < 3) {
      Alert.alert("Username Error", "Username must be at least 3 characters.");
      return false;
    }
    return true;
  };

  const onHandleSignup = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: username });
      await sendEmailVerification(cred.user);

      // Use UID instead of email for document ID
      const userData = {
        id: cred.user.uid,
        email: cred.user.email,
        name: cred.user.displayName,
        about: "Available",
      };

      await setDoc(doc(db, "users", cred.user.uid), userData);
      // Log the user data you just saved
      console.log("User Data: from signup", userData);

      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: username,
        })
      );

      Alert.alert(
        "Verification Email Sent",
        "Please check your email to verify your account."
      );
      router.replace("/(auth)/VerifyEmail");
    } catch (error) {
      console.error("Signup Error:", error);
      Alert.alert("Signup Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  //  const testUserData = () => {
  //   console.log();

  //  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
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
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.form}
      > */}
      <ScrollView>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                width: "95%", // Covers 90% of the screen width
                maxWidth: 400, // Ensures it doesn’t get too wide on larger screens
                alignSelf: "center",
              },
              { backgroundColor: theme.background, color: theme.text },
            ]}
            placeholder="Username"
            placeholderTextColor={theme.text + "80"} // 80 for semi-transparent
            autoCapitalize="none"
            keyboardType="default"
            textContentType="name"
            // autoFocus={true}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={[
              styles.input,
              {
                width: "95%", // Covers 90% of the screen width
                maxWidth: 400, // Ensures it doesn’t get too wide on larger screens
                alignSelf: "center",
              },
              { backgroundColor: theme.background, color: theme.text },
            ]}
            placeholder="Email"
            placeholderTextColor={theme.text + "80"}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={[
              styles.input,
              {
                width: "95%", // Covers 90% of the screen width
                maxWidth: 400, // Ensures it doesn’t get too wide on larger screens
                alignSelf: "center",
              },
              { backgroundColor: theme.background, color: theme.text },
            ]}
            placeholder="Password"
            placeholderTextColor={theme.text + "80"}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

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
          onPress={onHandleSignup}
          disabled={loading}
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
            <Text style={[styles.loginText, { color: theme.tint }]}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
}

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
    maxWidth: 400, // Ensures a consistent width for large screens
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

  form: {
    flex: 1,
    justifyContent: "center",
    // marginHorizontal: 30,
  },
  button: {
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    width: screenWidth > 500 ? "50%" : "90%", // Adapt based on screen width
    maxWidth: 400, // Prevent overly wide buttons
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
});
