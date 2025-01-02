import React from "react";
import { Image } from "react-native";
import {
  InputToolbar,
  Actions,
  Composer,
  Send,
  InputToolbarProps,
  IMessage,
} from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";

// Function to render InputToolbar
export const renderInputToolbar = (
  props: InputToolbarProps<IMessage>,
  theme: any
) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: theme.inputToolbarBackground,
      paddingTop: 6,
    }}
    primaryStyle={{ alignItems: "center" }}
  />
);

// Function to render Actions
export const renderActions = (props: any, theme: any) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => <Ionicons name="attach" size={24} color={theme.icon} />}
    options={{
      "Choose From Library": () => {
        console.log("Choose From Library");
      },
      Cancel: () => {
        console.log("Cancel");
      },
    }}
    optionTintColor={theme.primary}
  />
);

// Function to render Composer
export const renderComposer = (props: any, theme: any) => (
  <Composer
    {...props}
    textInputStyle={{
      color: theme.textColor,
      backgroundColor: theme.composerBackground,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: theme.composerBorderColor,
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

// Function to render Send button
export const renderSend = (props: any, theme: any) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
    }}
  >
    <Ionicons name="send" size={24} color={theme.sendButtonColor} />
  </Send>
);
