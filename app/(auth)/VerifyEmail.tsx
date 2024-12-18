import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
  Dimensions,
} from "react-native";
import { sendEmailVerification } from "firebase/auth";
// import { auth } from "@/firebaseConfig";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Text = ThemedText;
const View = ThemedView;

const auth = getAuth();

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setIsVerified(user.emailVerified);
    }
  }, []);

  const checkEmailVerification = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload(); // Reload user data to get updated verification status
        if (user.emailVerified) {
          Alert.alert("Email Verified", "Your email has been verified!");
          router.replace("/(tabs)/home"); // Navigate to home if verified
        } else {
          Alert.alert(
            "Email Not Verified",
            "Please check your Email and click the link to  verify your email."
          );
          setIsVerified(false);
        }
      } else {
        Alert.alert("Error", "No user is currently logged in.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!canResend) {
      Alert.alert("Please wait before resending the email.");
      return;
    }
    setLoading(true);
    setCanResend(false); // Disable resend button
    setCountdown(30); // Set countdown to 30 seconds

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        Alert.alert(
          `Verification Email Sent to ${user.email}`,
          "Please check your email to verify your account."
        );
        // Start countdown
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCanResend(true); // Enable resend button
              return 0; // Reset countdown
            }
            return prev - 1; // Decrease countdown
          });
        }, 1000); // Update every second
      } else {
        Alert.alert("Error", "No user is currently logged in.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    router.push("/(auth)/Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email Address</Text>
      <Text style={styles.message}>
        A verification link has been sent to your email
        <Text style={{ color: "blue" }}> {user?.email}.</Text> Please check your
        inbox and click the link to verify your account.
      </Text>
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
        onPress={checkEmailVerification}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>I have Verified</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: "90%",
            maxWidth: 400,
            alignSelf: "center",
          },
          canResend
            ? { backgroundColor: theme.tint }
            : { backgroundColor: theme.grey },
        ]}
        onPress={resendVerificationEmail}
        disabled={!canResend || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {canResend ? "Resend" : `Resend in ${countdown}...`}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNavigateToLogin}>
        <Text style={styles.linkText}>Already verified? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    width: screenWidth > 500 ? "50%" : "70%", // Adapt based on screen width
    maxWidth: 400, // Prevent overly wide buttons
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 18,
  },
  linkText: {
    marginTop: 20,
    color: Colors.pink,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default VerifyEmail;
