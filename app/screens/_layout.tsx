import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import ChatHeader from "@/components/ChatHeader";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="dark" />

      <Stack>
        <Stack.Screen name="Chat" options={{ headerShown: false }} />
        <Stack.Screen name="ChatInfo" options={{ title: "Chat Info" }} />
        <Stack.Screen name="Users" />
        <Stack.Screen name="Profile" />
        <Stack.Screen name="Group" />
        <Stack.Screen name="About" />
        <Stack.Screen name="Account" />
        <Stack.Screen name="Help" />
        <Stack.Screen name="Camera" />
      </Stack>
    </ThemeProvider>
  );
}
