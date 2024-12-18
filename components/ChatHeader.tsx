import React from "react";
import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

type Props = {
  chatName: string;
  chatId: string;
};
const ChatHeader = ({ chatName, chatId }: Props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push("ChatInfo", { chatId, chatName })}
    >
      <TouchableOpacity
        style={styles.avatar}
        // onPress={() => router.push("ChatInfo", { chatId, chatName })}
        onPress={() =>
          router.push({ pathname: "ChatInfo", params: { chatId, chatName } })
        }
      >
        <View>
          <Text style={styles.avatarLabel}>
            {chatName
              .split(" ")
              .reduce((prev, current) => `${prev}${current[0]}`, "")}
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.chatName}>{chatName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: -30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  avatarLabel: {
    fontSize: 20,
    color: "white",
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});

export default ChatHeader;
