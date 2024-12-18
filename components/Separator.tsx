import { Colors } from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";

const Separator = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
});

export default Separator;
