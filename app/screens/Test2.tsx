import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { UnreadMessagesContext } from "@/context/UnreadMessagesContext";
import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { auth, db } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import ContactRow from "@/components/ContactRow";
import { User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Separator from "@/components/Separator";

const View = ThemedView;
const Text = ThemedText;

interface Chat {
  id: string;
  name: string;
  profilePicture: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
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
  groupName: string;
  users: { email: string; deletedFromChat: boolean; name: string }[];
  lastUpdated: Date;
  subtitle: string;
  subtitle2: string;
  newMessageCount: number;
  user: User;
}
const Test2 = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  const { unreadMessages } = React.useContext(UnreadMessagesContext);
  const { chatId } = useLocalSearchParams();
  const [newMessages, setNewMessages] = useState({});
  const [unreadCount, setUnreadCount] = useState<number | unknown>(0);
  const [loading, setLoading] = useState(true);

  const [chats, setChats] = useState<Chat[]>([]); // Store chat data
  const [selectedChats, setSelectedChats] = useState<string[]>([]); // Store selected chat IDs
  const [emptyChats, setEmptyChats] = useState(false); // Store empty chat state

  // Format the timestamp into a readable time (e.g., "2:30 PM")
  const formatTime = (timestamp: any) => {
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.log("Error formatting timestamp", error);
    }
  };

  const userEmail = "yusufbyusuff@gmail.com";
  const currentUser = auth?.currentUser;
  // fetch chats
  const fetchChats = async () => {
    // Load unread messages from AsyncStorage when screen is focused
    const currentUser = auth?.currentUser;
    try {
      const storedMessages = await AsyncStorage.getItem("newMessages");
      const parsedMessages = storedMessages ? JSON.parse(storedMessages) : {};
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

    // Set up Firestore listener for chat updates
    const collectionRef = collection(db, "chats");
    const q = query(
      collectionRef,
      // where("users", "array-contains-any", {
      //   email: auth.currentUser?.email,
      //   name: currentUser?.displayName,
      // }),
      orderBy("lastUpdated", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs);
      // console.log("chats", snapshot.docs);
      console.log("Chats", chats);

      setLoading(false);

      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const chatId = change.doc.id;
          const messages = change.doc.data().messages;
          const firstMessage = messages[0];

          // Increase unread count if the first message is from someone else
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
                  (total: any, num) => total + num,
                  0
                )
              );
              return updatedMessages;
            });
          }
        }
      });
    });
    return () => unsubscribe();
  };

  // Assume db and auth are already initialized
  // const fetchChats = async () => {
  //   try {
  //     // Load unread messages from AsyncStorage
  //     const storedMessages = await AsyncStorage.getItem("newMessages");
  //     const parsedMessages = storedMessages ? JSON.parse(storedMessages) : {};
  //     setNewMessages(parsedMessages);
  //     setUnreadCount(
  //       Object.values(parsedMessages).reduce((total, num) => total + num, 0)
  //     );
  //   } catch (error) {
  //     console.log("Error loading new messages from storage", error);
  //   }

  //   // Set up Firestore listener for chat updates
  //   const collectionRef = collection(db, "chats");
  //   const q = query(collectionRef, orderBy("lastUpdated", "desc"));

  //   const unsubscribe = onSnapshot(q, async (snapshot) => {
  //     const chatIds = snapshot.docs
  //       .filter((doc) => {
  //         const users = doc.data().users;
  //         return users.some(
  //           (user) =>
  //             user.email === currentUser?.email ||
  //             user.name === currentUser?.displayName
  //         );
  //       })
  //       .map((doc) => doc.id);

  //     // Fetch chats by ID
  //     console.log("starting chatsData...........");

  //     const chatsData: Chat[] = [];
  //     console.log("enter");

  //     for (const chatId of chatIds) {
  //       const chatRef = doc(db, "chats", chatId);
  //       const chatDoc = await getDoc(chatRef);
  //       console.log("chatDoc", chatDoc);

  //       if (chatDoc.exists()) {
  //         const chatData = chatDoc.data();
  //         console.log("chatData", chatData);

  //         // chatsData.push({
  //         //   id: chatDoc.id,
  //         //   name: chatData.groupName || "",
  //         //   profilePicture: "", // Assuming you have a way to get this
  //         //   lastMessage:
  //         //     chatData.messages[chatData.messages.length - 1]?.text || "",
  //         //   timestamp: new Date(chatData.lastUpdated).toISOString(),
  //         //   unreadCount: newMessages[chatId] || 0,
  //         //   data: chatData,
  //         //   groupName: chatData.groupName || "",
  //         //   users: chatData.users,
  //         //   lastUpdated: new Date(chatData.lastUpdated),
  //         //   subtitle: "", // Add logic to generate subtitle if needed
  //         //   subtitle2: "", // Add logic to generate subtitle2 if needed
  //         //   newMessageCount: newMessages[chatId] || 0,
  //         //   user: { _id: currentUser?.email, name: currentUser?.displayName }, // Adjust as necessary
  //         // });
  //         console.log("chatsData2", chatsData);
  //       }
  //     }
  //     console.log("executing...........");

  //     console.log("chatsData", chatsData);

  //     setChats(chatsData);
  //     setLoading(false);

  //     // Handle changes in document snapshots
  //     snapshot.docChanges().forEach((change) => {
  //       if (change.type === "modified") {
  //         const chatId = change.doc.id;
  //         const messages = change.doc.data().messages;
  //         const firstMessage = messages[0];

  //         // Increase unread count if the first message is from someone else
  //         if (firstMessage.user._id !== currentUser?.email) {
  //           setNewMessages((prev) => {
  //             const updatedMessages = {
  //               ...prev,
  //               [chatId]: (prev[chatId] || 0) + 1,
  //             };
  //             AsyncStorage.setItem(
  //               "newMessages",
  //               JSON.stringify(updatedMessages)
  //             );
  //             setUnreadCount(
  //               Object.values(updatedMessages).reduce(
  //                 (total, num) => total + num,
  //                 0
  //               )
  //             );
  //             return updatedMessages;
  //           });
  //         }
  //       }
  //     });

  //     // Set emptyChats state based on whether chatsData is empty
  //     setEmptyChats(chatsData.length === 0);
  //   });

  //   return () => unsubscribe();
  // };

  useEffect(() => {
    fetchChats();
  }, []);

  // Refersh chats when scren is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchChats();
    }, []) // empty array means this effect will only run once when the screen is focused
  );
  const handleChatName = (chat: any) => {
    const users = chat.data().users;
    const currentUser = auth?.currentUser;

    if (chat.data().groupName) {
      return chat.data().groupName;
    }

    if (currentUser?.displayName) {
      return users[0].name === currentUser.displayName
        ? users[1].name
        : users[0].name;
    }

    if (currentUser?.email) {
      return users[0].email === currentUser.email
        ? users[1].email
        : users[0].email;
    }

    return "~ No Name or Email ~";
  };
  const handleSubtitle = (chat: any) => {
    const message = chat.data().messages[0];
    if (!message) return "No messages yet";

    const isCurrentUser = auth?.currentUser?.email === message.user._id;
    const userName = isCurrentUser ? "You" : message.user.name.split(" ")[0];
    const messageText = message.image
      ? "sent an image"
      : message.text.length > 20
        ? `${message.text.substring(0, 20)}...`
        : message.text;

    return `${userName}: ${messageText}`;
  };
  const handleSubtitle2 = (chat: any) => {
    const las = chat.data().lastUpdated;
    return formatTime(las);
  };
  const handleOnPress = async (chat) => {
    const chatId = chat.id;
    console.log("chatId", chatId);

    // if (selectedItems.length) {
    //   return selectItems(chat);
    // }
    // Reset unread count for the selected chat
    setNewMessages((prev) => {
      const updatedMessages = { ...prev, [chatId]: 0 };
      AsyncStorage.setItem("newMessages", JSON.stringify(updatedMessages));
      setUnreadCount(
        Object.values(updatedMessages).reduce(
          (total: any, num) => total + num,
          0
        )
      );
      return updatedMessages;
    });

    router.push({
      pathname: "/screens/Chat",
      params: { chatId, chatName: handleChatName(chat) },
    });
  };

  const handleFabPress = () => {
    router.push({
      pathname: "/screens/Users",
    });
  };
  const renderChatItem = ({ item }) => (
    <ContactRow
      // style={getSelected(item) ? styles.selectedContactRow : ""}
      name={handleChatName(item)}
      subtitle={handleSubtitle(item)}
      subtitle2={handleSubtitle2(item)}
      onPress={() => handleOnPress(item)}
      // onLongPress={() => handleLongPress(item)}
      // selected={getSelected(item)}
      showForwardIcon={false}
      newMessageCount={newMessages[item.id] || 0}
    />
  );
  return (
    <SafeAreaView
      style={[styles.ParentContainer, { backgroundColor: theme.background }]}
    >
      <Header />
      {chats.length === 0 ? (
        <View style={styles.noChatsFoundContainer}>
          <Text style={styles.noChatsFoundText}>No Chats Found</Text>
          <Text style={styles.noChatsFoundText}>
            Press on + button to start a new chat
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderChatItem}
          ItemSeparatorComponent={Separator}
        />
      )}
      <TouchableOpacity
        style={[
          styles.fabContainer,
          { backgroundColor: theme.background, borderRadius: 12 },
        ]}
        onPress={handleFabPress}
      >
        <Ionicons name="add-sharp" size={34} color="gray" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Test2;

const styles = StyleSheet.create({
  ParentContainer: {
    flex: 1,
  },
  noChatsFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noChatsFoundText: {
    fontSize: 20,
    color: "gray",
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
