import Cell from "@/components/Cell";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Alert } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";

const Text = ThemedText;
const View = ThemedView;

const Help = () => {
  return (
    <View>
      <Stack.Screen options={{ title: "Help" }} />

      <Cell
        title="Contact us"
        subtitle="Questions? Need help?"
        icon="people-outline"
        tintColor={"transparent"}
        onPress={() => {
          alert("Help touched");
        }}
        showForwardIcon={false}
        style={{ marginTop: 20 }}
      />
      <Cell
        title="App info"
        icon="information-circle-outline"
        iconColor="#fefefe"
        tintColor={"#000000"}
        onPress={() => {
          Alert.alert(
            "Flexgram Chat App",
            "Developed by Yusuff smart",
            [
              {
                text: "Ok",
                onPress: () => {},
              },
            ],
            { cancelable: true }
          );
        }}
        showForwardIcon={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contactRow: {
    backgroundColor: "white",
    marginTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
});

export default Help;
