import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

const Story = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={{ fontSize: 27, backgroundColor: theme.grey, padding: 12 }}>
        Story
      </Text>
      <Text style={{ fontSize: 27 }}>This Feature is comming soon</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});

export default Story;
