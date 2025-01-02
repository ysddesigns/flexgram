import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { auth } from "@/firebaseConfig";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

const Text = ThemedText;
const View = ThemedView;

const RootApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  useEffect(() => {
    const checkUserStatus = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Check if user is still logged in
        if (user && user.email) {
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.email === user.email) {
            await currentUser.reload(); // Reload user data to get updated verification status
            if (currentUser.emailVerified) {
              setIsLoggedIn(true);
              router.replace("/(tabs)/home");
            } else {
              setIsLoggedIn(false);
              router.replace("/(auth)/VerifyEmail"); // Redirect to verification page
            }
            return; // Exit early if user is found
          }
        }
      }
      // If no stored user or user doesn't match, check auth state
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        try {
          if (user) {
            await user.reload(); // Reload user data to get updated verification status
            if (user.emailVerified) {
              setIsLoggedIn(true);
              router.replace("/(tabs)/home");
            } else {
              setIsLoggedIn(false);
              router.replace("/(auth)/VerifyEmail"); // Redirect to verification page
            }
          } else {
            setIsLoggedIn(false);
            router.replace("/(auth)/Login");
          }
        } catch (error) {
          console.error("Error retrieving user info from AsyncStorage:", error);
        }
      });
      return () => unsubscribe(); // Clean up the listener on unmount
    };
    checkUserStatus();
  }, []);

  // Show loading spinner while checking login status
  if (isLoggedIn === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <Image
          source={require("@/assets/images/fxLogo.png")}
          style={styles.logo}
        />
        <Pressable onPress={() => router.replace("/(auth)/Login")}>
          <Text>from Maij Family</Text>
        </Pressable>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.indicator}
        />
      </View>
    );
  }

  return null; // You can return a default view if needed
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Ensure background color is set
  },
  text: {
    fontSize: 24,
    // color: "#000", // Ensure text color is readable
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  indicator: {
    position: "absolute",
    bottom: 30,
  },
});

export default RootApp;
