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
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Toast from "react-native-toast-message";

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

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(
        () => setCountdown((prev) => prev - 1),
        1000
      );
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const checkEmailVerification = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          Toast.show({
            type: "success",
            text1: "Email Verified",
            text2: "Your email has been verified successfully!",
          });
          router.replace("/(tabs)/home");
        } else {
          Toast.show({
            type: "info",
            text1: "Email Not Verified",
            text2: "Please check your inbox and click the verification link.",
          });
          setIsVerified(false);
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No user is currently logged in.",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong.",
      });
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
    setCanResend(false);
    setCountdown(30);

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        Toast.show({
          type: "success",
          text1: "Verification Email Sent",
          text2: `Please check ${user.email} to verify your account.`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No user is currently logged in.",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong.",
      });
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
        accessibilityLabel="Check if email is verified"
        style={[
          styles.button,
          {
            backgroundColor: loading ? theme.teal : theme.tint,
          },
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
        accessibilityLabel="Resend email verification link"
        style={[
          styles.button,
          {
            backgroundColor: canResend ? theme.tint : theme.grey,
          },
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
      <TouchableOpacity
        accessibilityLabel="Navigate to login screen"
        onPress={handleNavigateToLogin}
      >
        <Text style={[styles.linkText, { color: theme.accent }]}>
          Already verified? Log In
        </Text>
      </TouchableOpacity>
      <Toast />
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
    height: screenWidth < 350 ? 50 : 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    width: screenWidth > 500 ? "50%" : "70%",
    maxWidth: 400,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 18,
  },
  linkText: {
    marginTop: 20,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default VerifyEmail;
