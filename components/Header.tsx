import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors"; // Use your existing Colors file
import { useColorScheme } from "react-native";

type HeaderProps = {
  onSearchPress?: () => void;
  onCameraPress?: () => void;
  onMenuPress?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  onSearchPress,
  onCameraPress,
  onMenuPress,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.appName, { color: theme.tint }]}>FlexGram</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onSearchPress}>
          <Ionicons
            name="search"
            size={24}
            color={theme.tint}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCameraPress}>
          <Ionicons
            name="camera"
            size={24}
            color={theme.tint}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMenuPress}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={theme.tint}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default Header;
