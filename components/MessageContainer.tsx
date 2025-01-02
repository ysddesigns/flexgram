import React from "react";
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
} from "react-native-gifted-chat";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

const View = ThemedView;
const Text = ThemedText;

export const renderAvatar = (props) => (
  <Avatar
    {...props}
    containerStyle={{
      left: {},
      right: {},
    }}
    imageStyle={{
      left: { borderWidth: 0.3, borderColor: "trnasparent" },
      right: {},
    }}
  />
);

export const renderBubble = (props) => (
  <Bubble
    {...props}
    // renderTime={() => <Text>Time</Text>}
    // renderTicks={() => <Text>Ticks</Text>} // to show message status
    containerStyle={{
      left: {},
      right: {},
    }}
    wrapperStyle={{
      left: { borderColor: "transparent", borderWidth: 1 },
      right: {},
    }}
    bottomContainerStyle={{
      left: { borderColor: "transparent", borderWidth: 0 },
      right: {},
    }}
    tickStyle={{}}
    usernameStyle={{ color: "transparent", fontWeight: "100" }}
    containerToNextStyle={{
      left: {},
      right: {},
    }}
    containerToPreviousStyle={{
      left: { borderColor: "transparent", borderWidth: 0 },
      right: {},
    }}
  />
);

export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{}}
    wrapperStyle={{ backgroundColor: "brown" }}
    textStyle={{ color: "white", fontWeight: "900", padding: 5 }}
  />
);

export const renderMessage = (props) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: {},
      right: {},
    }}
  />
);

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    containerStyle={{
      left: { backgroundColor: "blue" },
      right: { backgroundColor: "purple" },
    }}
    textStyle={{
      left: { color: "white" },
      right: {},
    }}
    linkStyle={{
      left: { color: "orange" },
      right: { color: "orange" },
    }}
    customTextStyle={{ fontSize: 24, lineHeight: 24 }}
  />
);

// export const renderCustomView = ({ user }) => (
//   <View
//     style={{ minHeight: 20, alignItems: "center", backgroundColor: "green" }}
//   >
//     <Text>
//       Current user:
//       {user.name}
//     </Text>
//     <Text>From CustomView</Text>
//   </View>
// );
