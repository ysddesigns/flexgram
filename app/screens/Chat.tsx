import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { ActivityIndicator, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import {
  renderInputToolbar,
  renderActions,
  renderComposer,
  renderSend,
} from "@/components/InputToolbar";
import {
  renderAvatar,
  renderBubble,
  renderSystemMessage,
  renderMessage,
  renderMessageText,
} from "@/components/MessageContainer";
import { useLocalSearchParams } from "expo-router";
import ChatHeader from "@/components/ChatHeader";
import Toast from "react-native-toast-message";
import { auth, db } from "@/firebaseConfig";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const Chats = () => {
  const { chatId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState(null);

  const userName = auth.currentUser?.displayName || "User";
  const uid = auth.currentUser?.uid || "unknon-user";

  useEffect(() => {
    const chatDocRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatDocRef, (doc) => {
      if (!doc.exists()) {
        setError("Chat not found.");
        setLoading(false);
        return;
      }

      const chatData = doc.data();
      const messageArray = chatData.messages || [];
      const sortedMessages = messageArray
        .map((msg: any) => ({
          ...msg,
          createdAt: msg.createdAt?.toDate
            ? msg.createdAt.toDate()
            : new Date(msg.createdAt),
        }))
        .sort((a: any, b: any) => b.createdAt - a.createdAt);

      setMessages(sortedMessages);
      setLastVisible(sortedMessages[sortedMessages.length - 1]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const onSend = useCallback(
    async (messagesToSend: IMessage[] = []) => {
      // const newMessage = messagesToSend[0];
      const newMessage = {
        ...messagesToSend[0],
        createdAt: new Date(),
      };
      try {
        const chatDocRef = doc(db, "chats", chatId);
        await updateDoc(chatDocRef, {
          messages: GiftedChat.append(messages, [newMessage]), // Append directly
          lastMessage: newMessage.text,
          lastUpdated: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error sending message:", error);
        setError("failed to send message");
      }
    },
    [chatId, messages]
  );
  if (error) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error,
    });
  }
  console.log("Messages", messages);

  return (
    <>
      <ChatHeader />
      <Toast />
      <GiftedChat
        messages={messages}
        text={text}
        onInputTextChanged={setText}
        showAvatarForEveryMessage={true}
        onSend={onSend}
        user={{
          _id: uid || "unknown-user",
          name: userName,
          avatar: "https://placeimg.com/150/150/any",
        }}
        alignTop
        alwaysShowSend
        scrollToBottom
        keyboardShouldPersistTaps="handled"
        scrollToBottomStyle={styles.scrollToBottomStyle}
        renderInputToolbar={(props) => renderInputToolbar(props, theme)}
        renderActions={(props) => renderActions(props, theme)}
        renderComposer={(props) => renderComposer(props, theme)}
        renderSend={(props) => renderSend(props, theme)}
        renderAvatar={renderAvatar}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        renderMessage={renderMessage}
        renderMessageText={renderMessageText}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollToBottomStyle: {
    borderColor: "grey",
    borderWidth: 1,
    width: 56,
    height: 56,
    borderRadius: 28,
    position: "absolute",
    bottom: 12,
    right: 12,
  },
});

export default Chats;

// import React, { useState, useEffect, useCallback } from "react";
// import { GiftedChat, IMessage } from "react-native-gifted-chat";
// import { ActivityIndicator, useColorScheme, View, Text } from "react-native";
// import { Colors } from "@/constants/Colors";
// import {
//   renderInputToolbar,
//   renderActions,
//   renderComposer,
//   renderSend,
// } from "@/components/InputToolbar";
// import {
//   renderAvatar,
//   renderBubble,
//   renderSystemMessage,
//   renderMessage,
//   renderMessageText,
// } from "@/components/MessageContainer";
// import { useLocalSearchParams } from "expo-router";
// import ChatHeader from "@/components/ChatHeader";
// import Toast from "react-native-toast-message";
// import { auth, db } from "@/firebaseConfig";
// import {
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
//   where,
//   limit,
//   startAfter,
// } from "firebase/firestore";

// const Chats = () => {
//   const { chatId } = useLocalSearchParams();
//   const colorScheme = useColorScheme();
//   const theme = Colors[colorScheme || "light"];
//   const [text, setText] = useState("");
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [typing, setTyping] = useState(false);
//   const [lastVisible, setLastVisible] = useState(null);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   const userName = auth.currentUser?.displayName || "User";
//   const uid = auth.currentUser?.uid || "unknown-user";

//   // Fetch initial messages and enable real-time updates
//   useEffect(() => {
//     const unsubscribe = onSnapshot(doc(db, "chats", chatId), (doc) => {
//       if (!doc.exists()) {
//         setError("Chat not found.");
//         setLoading(false);
//         return;
//       }

//       const chatData = doc.data();
//       const sortedMessages = chatData.messages
//         .sort((a, b) => b.createdAt - a.createdAt)
//         .map((message) => ({
//           ...message,
//           createdAt: message.createdAt.toDate(),
//         }));

//       setMessages(sortedMessages);
//       setLastVisible(sortedMessages[sortedMessages.length - 1]);
//       console.log("Messages", sortedMessages);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [chatId]);

//   // Function to send messages
//   const onSend = useCallback(
//     async (m: IMessage[] = []) => {
//       try {
//         const chatDocRef = doc(db, "chats", chatId);
//         const chatDocSnap = await getDoc(chatDocRef);

//         if (!chatDocSnap.exists()) {
//           setError("Chat not found.");
//           return;
//         }

//         const chatData = chatDocSnap.data();
//         const newMessage = { ...m[0], sent: true, received: false };
//         const updatedMessages = GiftedChat.append(chatData.messages, [
//           newMessage,
//         ]);

//         await updateDoc(chatDocRef, {
//           messages: updatedMessages,
//           lastMessage: newMessage.text,
//           lastUpdated: serverTimestamp(),
//         });

//         setMessages(updatedMessages);
//       } catch (err) {
//         console.error("Error sending message:", err);
//         setError("Failed to send the message.");
//       }
//     },
//     [chatId]
//   );

//   // Typing indicator simulation
//   useEffect(() => {
//     const typingTimeout = setTimeout(() => {
//       setTyping(false);
//     }, 2000);

//     return () => clearTimeout(typingTimeout);
//   }, [text]);

//   const handleInputChange = (newText: string) => {
//     setText(newText);
//     setTyping(true);
//   };

//   // Pagination for loading more messages
//   const loadMoreMessages = async () => {
//     if (!lastVisible || isLoadingMore) return;

//     setIsLoadingMore(true);

//     try {
//       const q = query(
//         collection(db, "chats"),
//         orderBy("createdAt", "desc"),
//         startAfter(lastVisible.createdAt),
//         limit(20)
//       );

//       const snapshot = await getDocs(q);
//       const newMessages = snapshot.docs.map((doc) => ({
//         ...doc.data(),
//         createdAt: doc.data().createdAt.toDate(),
//       }));

//       setMessages((prev) => GiftedChat.append(prev, newMessages));
//       setLastVisible(newMessages[newMessages.length - 1]);
//     } catch (err) {
//       console.error("Error loading more messages:", err);
//       setError("Failed to load more messages.");
//     } finally {
//       setIsLoadingMore(false);
//     }
//   };

//   return (
//     <>
//       <ChatHeader />
//       <Toast />
//       {loading && (
//         <ActivityIndicator
//           size="large"
//           color={theme.primary}
//           style={{ marginTop: 20 }}
//         />
//       )}
//       {error && (
//         <View style={{ padding: 20 }}>
//           <Text style={{ color: "red" }}>{error}</Text>
//         </View>
//       )}
//       <GiftedChat
//         messages={messages}
//         text={text}
//         onInputTextChanged={handleInputChange}
//         showAvatarForEveryMessage={true}
//         onSend={onSend}
//         user={{
//           _id: uid || "unknown-user",
//           name: userName,
//           avatar: "https://placeimg.com/150/150/any",
//         }}
//         alignTop
//         alwaysShowSend
//         scrollToBottom={true}
//         inverted={true}
//         onLoadEarlier={loadMoreMessages}
//         loadEarlier={!loading && !isLoadingMore}
//         isLoadingEarlier={isLoadingMore}
//         renderInputToolbar={(props) => renderInputToolbar(props, theme)}
//         renderActions={(props) => renderActions(props, theme)}
//         renderComposer={(props) => renderComposer(props, theme)}
//         renderSend={(props) => renderSend(props, theme)}
//         renderAvatar={renderAvatar}
//         renderBubble={renderBubble}
//         renderSystemMessage={renderSystemMessage}
//         renderMessage={renderMessage}
//         renderMessageText={renderMessageText}
//       />
//     </>
//   );
// };

// export default Chats;
