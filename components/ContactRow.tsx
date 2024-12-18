import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const ContactRow = ({
  name,
  subtitle,
  onPress,
  style,
  onLongPress,
  selected,
  showForwardIcon = true,
  subtitle2,
  newMessageCount,
}: any) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  return (
    <TouchableOpacity
      style={[styles.row, style]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: theme.teal, borderColor: theme.primary },
        ]}
      >
        <Text style={[styles.avatarLabel, { backgroundColor: theme.primary }]}>
          {name
            .trim()
            .split(" ")
            .reduce((prev, current) => `${prev}${current[0]}`, "")}
        </Text>
      </View>

      <View style={styles.textsContainer}>
        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.subtitle2}>{subtitle2}</Text>

        {newMessageCount > 0 && (
          <View
            style={[styles.newMessageBadge, { backgroundColor: theme.teal }]}
          >
            <Text style={styles.newMessageText}>{newMessageCount}</Text>
          </View>
        )}

        {selected && (
          <View style={[styles.overlay, { backgroundColor: theme.teal }]}>
            <Ionicons name="checkmark-outline" size={16} color={"white"} />
          </View>
        )}

        {showForwardIcon && (
          <Ionicons name="chevron-forward-outline" size={20} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  avatarLabel: {
    fontSize: 20,
    padding: 12,
    borderRadius: 25,
  },
  textsContainer: {
    flex: 1,
    marginStart: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    color: "#565656",
    fontSize: 14,
    maxWidth: 200,
  },
  rightContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  subtitle2: {
    fontSize: 12,
    color: "#8e8e8e",
    marginBottom: 4,
  },
  newMessageBadge: {
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  newMessageText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1.5,
  },
});

export default ContactRow;
