import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { db } from "@/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

const Story = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  const [messages, setMessages] = useState<IMessage[]>([]);

  // const test = async () => {
  //   await setDoc(doc(db, "cities", "NG"), {
  //     name: "Los Angeles",
  //     state: "CA",
  //     country: "USA",
  //   });
  //   console.log("pressed");
  // };

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       createdAt: new Date(),
  //       text: "hi",
  //       user: {
  //         _id: 1,
  //         name: "Yusuff",
  //         avatar: "",
  //       },
  //     },
  //   ]);
  // }, []);

  // const onSend = useCallback(async (messages: IMessage[] = []) => {
  //   const { _id, createdAt, text, user } = messages[0];
  //   await setDoc(doc(db, "smaters"), {
  //     _id,
  //     createdAt,
  //     text,
  //     user,
  //   });
  //   setMessages((prevMessage) => GiftedChat.append(prevMessage, messages));
  //   console.log("pressed");
  // }, []);

  // const onSend = useCallback(async (messages: IMessage[] = []) => {
  //   setMessages((prevMessage) => GiftedChat.append(prevMessage, messages));
  //   const { _id, createdAt, text, user } = messages[0];
  //   await setDoc(doc(db, "chats"), {
  //     _id,
  //     createdAt,
  //     text,
  //     user,
  //   });
  //   console.log("pressed");
  // }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* <Text
        style={{
          fontSize: 20,
          backgroundColor: theme.grey,
          padding: 12,
          color: theme.text,
        }}
      >
        Story
      </Text>
      <Text style={{ fontSize: 20, color: theme.text }}>
        This Feature is comming soon
      </Text>
      <Button title="add" onPress={() => onSend()} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});

export default Story;
