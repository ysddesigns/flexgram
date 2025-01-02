import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

interface ChatItemProps {
  chat: {
    id: string;
    name: string;
    profilePicture: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
  };
  onSelect: (id: string) => void;
  selected: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, onSelect, selected }) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={() => onSelect(chat.id)}
    >
      <Image source={{ uri: chat.profilePicture }} style={styles.profilePic} />
      <View style={styles.details}>
        <Text style={styles.name}>{chat.name}</Text>
        <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.timestamp}>{chat.timestamp}</Text>
        {chat.unreadCount > 0 && (
          <View style={styles.unreadCountContainer}>
            <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#e0e0e0", // Change this to your selected color
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
  },
  lastMessage: {
    color: "#888",
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  unreadCountContainer: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadCount: {
    color: "white",
    fontSize: 12,
  },
});

export default ChatItem;
