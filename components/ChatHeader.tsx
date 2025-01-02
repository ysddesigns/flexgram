import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const Text = ThemedText;

const ChatHeader = () => {
  const { chatName, chatId, userEmail } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  // console.log("ChatHeader", { chatName, chatId, userEmail });
  const displayChatName = Array.isArray(chatName) ? chatName[0] : chatName;

  const handleVoiceCall = () => {
    Toast.show({
      type: "info",
      text1: "Voice call",
      text2: "This feature is coming soon",
    });
  };

  const handleVideoCall = () => {
    Toast.show({
      type: "info",
      text1: "Video call",
      text2: "This feature is coming soon",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>

      {/* Avatar Section */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() =>
          router.push({
            pathname: "/screens/ChatInfo",
            params: { chatId, chatName, userEmail },
          })
        }
      >
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarLabel}>
            {displayChatName ? displayChatName.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Chat Name Section */}
      <TouchableOpacity
        style={styles.chatNameContainer}
        onPress={() =>
          router.push({
            pathname: "/screens/ChatInfo",
            params: { chatId, chatName, userEmail },
          })
        }
      >
        <Text style={[styles.chatName, { color: theme.text }]}>{chatName}</Text>
      </TouchableOpacity>

      {/* Right Buttons: Voice and Video Call */}
      <View style={styles.rightButtons}>
        <TouchableOpacity onPress={handleVoiceCall} style={styles.button}>
          <Ionicons name="call" size={24} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleVideoCall} style={styles.button}>
          <Ionicons name="videocam" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  chatNameContainer: {
    flex: 1,
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rightButtons: {
    flexDirection: "row",
    marginLeft: "auto", // Push buttons to the right
  },
  button: {
    padding: 10,
  },
});

export default ChatHeader;
