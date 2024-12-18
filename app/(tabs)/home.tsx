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
  doc,
  where,
  query,
  onSnapshot,
  setDoc,
  deleteDoc,
  orderBy,
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

import Config from "react-native-config";

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
    lastUpdated: number; // Use number for timestamp (milliseconds)
  };
}

const View = ThemedView;
const Text = ThemedText;

const Chats: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  const { unreadCount, setUnreadCount } = useContext(UnreadMessagesContext);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [newMessages, setNewMessages] = useState<Record<string, number>>({});
  const router = useRouter();

  try {
    useFocusEffect(
      React.useCallback(() => {
        const loadNewMessages = async () => {
          try {
            const storedMessages = await AsyncStorage.getItem("newMessages");
            // log
            console.log("storedMessage:", storedMessages);
            console.log("newMessage:", newMessages);
            console.log("Unread count:", unreadCount);

            const parsedMessages = storedMessages
              ? JSON.parse(storedMessages)
              : {};
            setNewMessages(parsedMessages);
            setUnreadCount(
              Object.values(parsedMessages).reduce(
                (total: any, num) => total + num,
                0
              )
            );
          } catch (error) {
            console.log("Error loading new messages from storage", error);
          }
        };

        const chatsRef = collection(db, "chats");

        onSnapshot(
          chatsRef,
          (snapshot) => {
            const filteredChats = snapshot.docs
              .filter((doc) =>
                doc
                  .data()
                  .users.some(
                    (user: any) => user.email === auth.currentUser?.email
                  )
              )
              .map((doc) => ({
                id: doc.id, // Optional: include the document ID
                data: {
                  users: doc.data().users, // Extract users
                  groupName: doc.data().groupName || "", // Handle optional groupName
                  messages: doc.data().messages || [], // Handle optional messages
                  lastUpdated: doc.data().lastUpdated || Date.now(), // Default to current timestamp if missing
                },
              }));

            setChats(filteredChats);
            setLoading(false);
            console.log("Filtered Chats: ", filteredChats, null, 2);
          },
          (error) => {
            console.error("Error fetching chats:", error);
            setLoading(false);
          }
        );

        console.log("Currentuser Email:", auth.currentUser?.email);

        loadNewMessages();
      }, [])
    );
  } catch (error) {
    console.log("Error useFocucEffect", error);
  }

  const handleChatName = (chat: Chat) => {
    const currentUser = auth?.currentUser;
    // const { users, groupName } = handleChatData(chat);
    const { users, groupName } = chat.data;

    if (groupName) {
      console.log("group name:", groupName);
      return groupName;
    }

    const otherUser = users.find((user) => user.email !== currentUser?.email);
    // return otherUser?.name || otherUser?.email || "~ No Name ~";
    return otherUser?.name || otherUser?.email || auth.currentUser?.displayName;
  };

  const handleOnPress = async (chat: Chat) => {
    const chatId = chat.id;
    if (selectedItems.length) return selectItems(chat);

    try {
      setNewMessages((prev) => {
        const updatedMessages = { ...prev, [chatId]: 0 };
        AsyncStorage.setItem("newMessages", JSON.stringify(updatedMessages));
        setUnreadCount(
          Object.values(updatedMessages).reduce((total, num) => total + num, 0)
        );
        return updatedMessages;
      });
      router.push({
        pathname: "/screens/Chat",
        params: { id: chat.id, chatName: handleChatName(chat) },
      });
    } catch (error) {
      console.log("Error saving new messages to storage", error);
    }
  };

  const handleLongPress = (chat: Chat) => selectItems(chat);

  const selectItems = (chat: Chat) => {
    setSelectedItems((prev) =>
      prev.includes(chat.id)
        ? prev.filter((id) => id !== chat.id)
        : [...prev, chat.id]
    );
  };

  const getSelected = (chat: Chat) => {
    return selectedItems.includes(chat.id);
  };

  const deSelectItems = () => {
    setSelectedItems([]);
  };

  const handleDeleteChat = () => {
    Alert.alert(
      selectedItems.length > 1 ? "Delete selected chats?" : "Delete this chat?",
      "Messages will be removed from this device.",
      [
        {
          text: "Delete chat",
          onPress: () => {
            selectedItems.forEach((chatId) => {
              const chat = chats.find((chat) => chat.id === chatId);
              if (chat) {
                const updatedUsers = chat.data.users.map((user) =>
                  user.email === auth?.currentUser?.email
                    ? { ...user, deletedFromChat: true }
                    : user
                );

                setDoc(
                  doc(db, "chats", chatId),
                  { users: updatedUsers },
                  { merge: true }
                );

                const deletedUsers = updatedUsers.filter(
                  (user) => user.deletedFromChat
                ).length;
                if (deletedUsers === updatedUsers.length) {
                  deleteDoc(doc(db, "chats", chatId));
                }
              } else {
                console.log("Chat not found for deletion.");
              }
            });
            deSelectItems();
          },
        },
        { text: "Cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleSubtitle = (chat: Chat) => {
    // const message: any = chat.data().messages[0];
    const messages = chat.data.messages || [];
    if (messages.length === 0) return "No messages yet";

    const message = messages[0];
    const isCurrentUser = auth?.currentUser?.email === message.user._id;
    const userName = isCurrentUser ? "You" : message.user.name.split(" ")[0];
    return message.image
      ? `${userName}: sent an image`
      : `${userName}: ${message.text || ""}`.slice(0, 20);
  };

  const handleSubtitle2 = (chat: Chat) => {
    // formatting the date yy/mm/dd
    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    };

    const newDate = new Date(chat.data.lastUpdated).toLocaleDateString(
      undefined,
      options
    );
    console.log("New Date:", newDate);

    return newDate;
  };
  const handleFabPress = () => {
    router.push("/screens/Users");
  };

  return (
    <SafeAreaView
      style={[styles.ParentContainer, { backgroundColor: theme.background }]}
    >
      <Header />
      <Pressable style={styles.container} onPress={deSelectItems}>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loadingContainer} />
        ) : (
          <ScrollView>
            {chats.length === 0 ? (
              <View style={styles.blankContainer}></View>
            ) : (
              chats.map((chat) => (
                <React.Fragment key={chat.id}>
                  <ContactRow
                    style={getSelected(chat) ? styles.selectedContactRow : null}
                    name={handleChatName(chat)}
                    subtitle={handleSubtitle(chat)}
                    subtitle2={handleSubtitle2(chat)}
                    onPress={() => handleOnPress(chat)}
                    onLongPress={() => handleLongPress(chat)}
                    showDelete={getSelected(chat)}
                    icon={
                      <Ionicons
                        name="person-circle-outline"
                        size={32}
                        color={theme.icon}
                      />
                    }
                  />
                  <Separator />
                </React.Fragment>
              ))
            )}
            {selectedItems.length > 0 && (
              <TouchableOpacity
                onPress={handleDeleteChat}
                style={[
                  styles.deleteButton && {
                    backgroundColor: theme.deleteButton,
                  },
                ]}
              >
                <Ionicons name="trash" size={24} color={"#8b0000"} />
                {selectedItems.length > 1 ? (
                  <Text>Delete selected chats</Text>
                ) : (
                  <Text>Delete chat</Text>
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
        <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
          <View
            style={[
              styles.fabContainer && {
                backgroundColor: theme.teal,
                borderRadius: 12,
              },
            ]}
          >
            <Ionicons
              name="add-sharp"
              size={34}
              color={"white"}
              style={styles.fabIcon}
            />
          </View>
        </TouchableOpacity>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ParentContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  blankContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginTop: 25,
  },
  textContainer: {
    fontSize: 16,
  },
  selectedContactRow: {
    backgroundColor: "gray",
  },
  deleteButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteText: {
    marginLeft: 8,
  },
  fab: {
    position: "absolute",
    bottom: 75,
    right: 12,
    padding: 12,
    borderRadius: 12,
  },
  fabContainer: {
    borderRadius: 28,
  },
  fabIcon: {
    padding: 12,
    borderRadius: 15,
  },
});

export default Chats;
