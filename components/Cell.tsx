import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Text = ThemedText;
const View = ThemedView;

const Cell = ({
  title,
  icon,
  iconColor,
  tintColor,
  style,
  onPress,
  secondIcon,
  subtitle,
  showForwardIcon = true,
}: any) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  return (
    <TouchableOpacity style={[styles.cell, style]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: tintColor }]}>
        <Ionicons
          name={icon}
          size={24}
          marginStart={4}
          color={iconColor || theme.icon}
        />
      </View>

      <View style={styles.textsContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {showForwardIcon && (
        <Ionicons
          name={secondIcon ?? "chevron-forward-outline"}
          size={20}
          color={iconColor || theme.icon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactRow: {
    // backgroundColor: "white",
    marginTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  cell: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    // backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  subtitle: {
    color: "#565656",
  },
  title: {
    fontSize: 16,
  },
  textsContainer: {
    flex: 1,
    marginStart: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignContent: "center",
    justifyContent: "center",
  },
});

export default Cell;
