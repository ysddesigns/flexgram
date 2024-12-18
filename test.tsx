import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  collection,
  query,
  onSnapshot,
  setDoc,
  deleteDoc,
  orderBy,
  doc,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/firebaseConfig";
import { Colors } from "@/constants/Colors";
import ContactRow from "@/components/ContactRow";
import Separator from "@/components/Separator";
import { UnreadMessagesContext } from "@/context/UnreadMessagesContext";
import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface Chat {
  id: string;
  data: {
    users: { name: string; email: string }[];
    groupName?: string;
    messages: {
      user: { _id: string; name: string };
      image?: string;
      text?: string;
    }[];
    lastUpdated: number;
  };
}

const Chats: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  const { unreadCount, setUnreadCount } = useContext(UnreadMessagesContext);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [newMessages, setNewMessages] = useState<Record<string, number>>({});
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const loadNewMessages = async () => {
        try {
          const storedMessages = await AsyncStorage.getItem("newMessages");
          const parsedMessages = storedMessages
            ? JSON.parse(storedMessages)
            : {};
          setNewMessages(parsedMessages);
          setUnreadCount(
            Object.values(parsedMessages).reduce((total, num) => total + num, 0)
          );
        } catch (error) {
          console.log("Error loading new messages", error);
        }
      };

      const collectionRef = collection(db, "chats");
      const q = query(
        collectionRef,
        where("users", "array-contains", auth.currentUser?.email),
        orderBy("lastUpdated", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const mappedChats = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data() as Chat["data"],
          }));
          setChats(mappedChats);
          setLoading(false);

          snapshot.docChanges().forEach((change) => {
            if (change.type === "modified") {
              const chatId = change.doc.id;
              const messages = change.doc.data().messages || [];
              const firstMessage = messages[0] || {};

              if (firstMessage.user._id !== auth?.currentUser?.email) {
                setNewMessages((prev) => {
                  const updatedMessages = {
                    ...prev,
                    [chatId]: (prev[chatId] || 0) + 1,
                  };
                  AsyncStorage.setItem(
                    "newMessages",
                    JSON.stringify(updatedMessages)
                  );
                  setUnreadCount(
                    Object.values(updatedMessages).reduce(
                      (total, num) => total + num,
                      0
                    )
                  );
                  return updatedMessages;
                });
              }
            }
          });
        },
        (error) => {
          console.error("Error fetching chats:", error);
          setLoading(false);
        }
      );

      loadNewMessages();
      return () => unsubscribe();
    }, [])
  );

  const handleChatName = (chat: Chat) => {
    const currentUser = auth?.currentUser;
    const { users, groupName } = chat.data;

    if (groupName) return groupName;

    const otherUser = users.find((user) => user.email !== currentUser?.email);
    return otherUser?.name || otherUser?.email || "~ No Name ~";
  };

  const handleOnPress = async (chat: Chat) => {
    const chatId = chat.id;
    if (selectedItems.length) return selectItems(chat);

    setNewMessages((prev) => {
      const updatedMessages = { ...prev, [chatId]: 0 };
      AsyncStorage.setItem("newMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    router.push({
      pathname: "/screens/Chat",
      params: { id: chatId, chatName: handleChatName(chat) },
    });
  };

  const handleLongPress = (chat: Chat) => selectItems(chat);

  const selectItems = (chat: Chat) => {
    setSelectedItems((prev) =>
      prev.includes(chat.id)
        ? prev.filter((id) => id !== chat.id)
        : [...prev, chat.id]
    );
  };

  const handleSubtitle = (chat: Chat) => {
    const messages = chat.data.messages || [];
    if (messages.length === 0) return "No messages yet";

    const message = messages[0];
    const isCurrentUser = auth?.currentUser?.email === message.user._id;
    const userName = isCurrentUser ? "You" : message.user.name.split(" ")[0];
    return message.image
      ? `${userName}: sent an image`
      : `${userName}: ${message.text || ""}`.slice(0, 20);
  };

  return (
    <SafeAreaView
      style={[styles.ParentContainer, { backgroundColor: theme.background }]}
    >
      <Header />
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <ScrollView>
          {chats.map((chat) => (
            <Pressable
              key={chat.id}
              onPress={() => handleOnPress(chat)}
              onLongPress={() => handleLongPress(chat)}
            >
              <ContactRow
                name={handleChatName(chat)}
                subtitle={handleSubtitle(chat)}
                selected={selectedItems.includes(chat.id)}
              />
              <Separator />
            </Pressable>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/screens/Users")}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ParentContainer: { flex: 1 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 50,
    padding: 15,
  },
});

export default Chats;

const handleChatData = (chat) => {
  if (chat && typeof chat === "object") {
    const { data, id } = chat;
    if (data) {
      const { groupName, lastAccess, lastUpdated, messages, users } = data;
      if (
        typeof groupName === "string" &&
        Array.isArray(lastAccess) &&
        typeof lastUpdated === "number" &&
        Array.isArray(messages) &&
        Array.isArray(users)
      ) {
        console.log("chat data:", data);
        return { groupName, lastAccess, lastUpdated, messages, users, id };
      } else {
        console.log("Invalid chat data structure:", data);
      }
    } else {
      console.log("Invalid chat data:", data);
    }
  } else {
    console.log("Invalid chat object:", chat);
  }
  return {
    groupName: "",
    lastAccess: [],
    lastUpdated: null,
    messages: [],
    users: [],
    id: "",
  }; // Return default values if structure is invalid
};

// const unsubscribe = onSnapshot(
//   q,
//   (snapshot) => {
//     console.log("Snapshot lentgh:", snapshot.docs.length);

//     const mappedChats = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       data: doc.data() as Chat["data"],
//     }));
//     console.log("Mapped chats:", mappedChats);

//     setChats(mappedChats);
//     setLoading(false);

//     // snapshot.docChanges().forEach((change) => {
//     //   if (change.type === "modified") {
//     //     const chatId = change.doc.id;
//     //     const messages = change.doc.data().messages || []; //defualt to empty array
//     //     const firstMessage = messages[0] || {}; // default to empty object
//     //     console.log("Messages:", messages);
//     //     // take not to change email to id
//     //     if (firstMessage.user._id !== auth?.currentUser?.email) {
//     //       setNewMessages((prev) => {
//     //         const updatedMessages = {
//     //           ...prev,
//     //           [chatId]: (prev[chatId] || 0) + 1,
//     //         };
//     //         AsyncStorage.setItem(
//     //           "newMessages",
//     //           JSON.stringify(updatedMessages)
//     //         );
//     //         setUnreadCount(
//     //           Object.values(updatedMessages).reduce(
//     //             (total, num) => total + num,
//     //             0
//     //           )
//     //         );
//     //         return updatedMessages;
//     //       });
//     //     }
//     //   }
//     // });
//   },
//   (error) => {
//     console.error("Error fetching chats:", error);
//     setLoading(false);
//   }
// );
