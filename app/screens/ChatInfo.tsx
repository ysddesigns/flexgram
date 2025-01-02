import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Colors } from "@/constants/Colors";
import Cell from "@/components/Cell";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface User {
  name: string;
  email: string;
  avatar?: string; // Optional avatar URL
}

const ChatInfo: React.FC = () => {
  const router = useRouter();
  const { chatId, chatName } = useLocalSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState<string>("");

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

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
          Alert.alert("Error", "Chat does not exist.");
        }
      } catch (error) {
        console.error("Error fetching chat info:", error);
        Alert.alert("Error", "Unable to fetch chat info. Please try again.");
      }
    };

    fetchChatInfo();
  }, [chatId]);

  const renderUser = ({ item }: { item: User }) => (
    <ThemedView style={styles.userContainer}>
      <Image
        source={
          item.avatar
            ? { uri: item.avatar } // Display user's avatar
            : require("@/assets/images/fxLogo.png") // Fallback to default avatar
        }
        style={styles.avatarImage}
      />
      <ThemedView style={styles.userInfo}>
        <ThemedText style={styles.userName}>{item.name}</ThemedText>
        <ThemedText style={styles.userEmail}>{item.email}</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  const uniqueUsers = Array.from(
    new Map(users.map((user) => [user.email, user])).values()
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Stack.Screen options={{ title: `${chatName}` }} />
      {/* Group Avatar Section */}
      <TouchableOpacity
        style={[styles.groupAvatar, { backgroundColor: theme.primary }]}
      >
        <Image
          source={
            groupName
              ? {
                  uri: `https://ui-avatars.com/api/?name=${groupName}&background=random`,
                } // Example API for generating avatars
              : require("@/assets/images/fxLogo.png") // Fallback to default group avatar
          }
          style={styles.avatarImage}
        />
      </TouchableOpacity>

      {/* Chat Details Section */}
      <ThemedView style={styles.chatHeader}>
        {groupName ? (
          <>
            <ThemedText
              style={[styles.groupLabel, { color: theme.placeholder }]}
            >
              Group
            </ThemedText>
            <ThemedText style={[styles.chatTitle, { color: theme.text }]}>
              {groupName}
            </ThemedText>
          </>
        ) : (
          <ThemedText style={[styles.chatTitle, { color: theme.text }]}>
            {chatName}
          </ThemedText>
        )}
      </ThemedView>

      {/* About Section */}
      <Cell
        title="About"
        subtitle="Group details and availability"
        icon="information-circle-outline"
        iconColor={theme.icon}
        style={styles.cell}
      />

      {/* Members Section */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
        Members
      </ThemedText>
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
  groupAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 15,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
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
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  cell: {
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    // borderRadius: 10,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 1,
  },
  sectionTitle: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
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
