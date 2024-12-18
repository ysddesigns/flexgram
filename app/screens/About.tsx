import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Text = ThemedText;
const View = ThemedView;

const About = () =>
  // { navigation }
  {
    return (
      <View>
        <Text>About Page</Text>
      </View>
    );
  };

const styles = StyleSheet.create({
  contactRow: {
    backgroundColor: "white",
    marginTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
});

export default About;
