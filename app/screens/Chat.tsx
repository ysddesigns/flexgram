import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import EmojiModal from "react-native-emoji-modal";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { Colors } from "@/constants/Colors";
import uuid from "react-native-uuid";
import { auth, db } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router/build/hooks";

const Chat = () => {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  const email = auth.currentUser?.email;
  const uid = auth.currentUser?.uid;
  const name = auth.currentUser?.displayName;
  const avatar = "https://i.pravatar.cc/300";

  useEffect(() => {
    console.log("###### Chat ID:", id);

    const unsubscribe = onSnapshot(doc(db, "chats", id), (doc) => {
      console.log("###### Chat ID:", id, "type", typeof id);
      const data = doc.data();
      if (data?.messages) {
        setMessages(
          data.messages.map((message) => ({
            ...message,
            createdAt: message.createdAt.toDate(),
          }))
        );
      }
    });

    return () => unsubscribe();
  }, [id]);

  const onSend = useCallback(
    async (newMessages = []) => {
      if (!newMessages.length) return;

      const chatDocRef = doc(db, "chats", id);
      const chatDocSnap = await getDoc(chatDocRef);

      if (chatDocSnap.exists()) {
        const chatData = chatDocSnap.data();
        const updatedMessages = GiftedChat.append(
          chatData.messages || [],
          newMessages
        );

        // console.log("UPDATED MESSAGE:", updatedMessages);

        // Check for undefined values in updatedMessages
        // const validMessages = updatedMessages.filter(
        //   (msg) => msg && msg._id && msg.createdAt && msg.user
        // );
        const validMessages = updatedMessages.map((msg) => ({
          ...msg,
          createdAt:
            msg.createdAt instanceof Date
              ? msg.createdAt
              : new Date(msg.createdAt),
        }));

        await setDoc(
          chatDocRef,
          {
            messages: validMessages,
            lastUpdated: new Date(),
          },
          { merge: true }
        );

        // console.log("validaMessages:", validMessages);
        setMessages(validMessages);
      }
    },
    [id]
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileRef = uuid.v4();

      // TODO: Implement your Firebase Storage logic here
      console.log("Upload started for:", fileRef);

      // Example of uploading to Firebase Storage (uncomment and adjust)
      // const storageRef = ref(storage, `chat-images/${fileRef}`);
      // await uploadBytes(storageRef, blob);
      // const downloadURL = await getDownloadURL(storageRef);

      // After uploading, send the image message
      // await onSend([{ _id: fileRef, createdAt: new Date(), image: downloadURL, user: { _id: uid, name, avatar } }]);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleEmojiPanel = () => {
    setModal((prev) => !prev);
    if (!modal) Keyboard.dismiss();
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: theme.primary },
        left: { backgroundColor: theme.grey },
      }}
    />
  );

  const renderSend = (props) => (
    <>
      <TouchableOpacity style={styles.addImageIcon} onPress={pickImage}>
        <Ionicons name="camera" size={32} color={theme.teal} />
      </TouchableOpacity>
      <Send {...props}>
        <Ionicons
          name="send"
          size={24}
          color={theme.teal}
          style={styles.sendIcon}
        />
      </Send>
    </>
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      renderActions={() => (
        <TouchableOpacity style={styles.emojiIcon} onPress={handleEmojiPanel}>
          <Ionicons name="happy-outline" size={32} color={theme.teal} />
        </TouchableOpacity>
      )}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.teal} />
        </View>
      )}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: uid, email, name, avatar }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        scrollToBottom
        showUserAvatar
      />
      {modal && (
        <EmojiModal
          onPressOutside={handleEmojiPanel}
          columns={9}
          emojiSize={45}
          activeShortcutColor={theme.primary}
          onEmojiSelected={(emoji) =>
            onSend([
              {
                _id: uuid.v4(),
                createdAt: new Date(),
                text: emoji,
                user: { _id: uid, name, avatar },
              },
            ])
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    marginHorizontal: 8,
    borderRadius: 16,
  },
  addImageIcon: {
    marginLeft: 4,
    marginBottom: 8,
  },
  sendIcon: {
    marginHorizontal: 4,
    marginTop: 12,
  },
  emojiIcon: {
    marginLeft: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default Chat;
