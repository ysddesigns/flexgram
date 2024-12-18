import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Colors } from "@/constants/Colors";
import Cell from "@/components/Cell";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Text = ThemedText;
const View = ThemedView;

// Define types for user and chat parameters
interface User {
  name: string;
  email: string;
}

const ChatInfo: React.FC = () => {
  const route = useRouter();
  // const { chatId, chatName } = useSearchParams();
  const { chatId, chatName } = useLocalSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState<string>("");

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  console.log("chatId:", chatId);
  console.log("chatName:", chatName);

  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const chatRef = doc(db, "chats", chatId);
        const chatDoc = await getDoc(chatRef);

        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          setUsers(chatData.users || []);
          setGroupName(chatData.groupName || "");
        } else {
          Alert.alert("Error", "Chat does not exist");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching chat info");
        console.error("Error fetching chat info: ", error);
      }
    };

    fetchChatInfo();
  }, [chatId]);

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userContainer}>
      <Ionicons name="person-outline" size={30} color={theme.primary} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </View>
  );

  // Create a unique list of users based on email
  const uniqueUsers = Array.from(
    new Map(users.map((user) => [user.email, user])).values()
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <TouchableOpacity
        style={[styles.avatar, { backgroundColor: theme.background }]}
      >
        <Text style={styles.avatarLabel}>
          {chatName
            .split(" ")
            .reduce((prev, current) => `${prev}${current[0]}`, "")}
        </Text>
      </TouchableOpacity>
      <View style={styles.chatHeader}>
        {groupName ? (
          <>
            <Text style={[styles.groupLabel, { color: theme.primary }]}>
              Group
            </Text>
            <Text style={styles.chatTitle}>{chatName}</Text>
          </>
        ) : (
          <Text style={styles.chatTitle}>{chatName}</Text>
        )}
      </View>

      <Cell
        title="About"
        subtitle="Available"
        icon="information-circle-outline"
        iconColor={theme.primary}
        style={styles.cell}
      />

      <Text style={styles.usersTitle}>Members</Text>
      <FlatList
        data={uniqueUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.email}
        contentContainerStyle={styles.usersList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  avatarLabel: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
  },
  chatHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  cell: {
    marginHorizontal: 16,
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 0.5,
  },
  usersTitle: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  usersList: {
    paddingBottom: 20,
  },
});

export default ChatInfo;
