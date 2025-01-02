import React from "react";
import { StyleSheet, Alert, useColorScheme } from "react-native";
import { deleteUser, signOut } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import Cell from "@/components/Cell";
import { Colors } from "@/constants/Colors";
import { router, Stack } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Text = ThemedText;
const View = ThemedView;

const Account = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  const onSignOut = () => {
    try {
      signOut(auth);
      router.replace("/(auth)/Login");
    } catch (error) {
      console.log("Error logging out: ", error);
    }
  };

  const deleteAccount = () => {
    deleteUser(auth?.currentUser).catch((error) =>
      console.log("Error deleting: ", error)
    );
    deleteDoc(doc(db, "users", auth?.currentUser.email));
    router.replace("/(auth)/Login");
  };

  return (
    <View>
      <Stack.Screen options={{ title: "Account" }} />

      <Cell
        title="Blocked Users"
        icon="close-circle-outline"
        tintColor={"transparent"}
        iconColor="red"
        onPress={() => {
          alert("Blocked users touched");
        }}
        style={{ marginTop: 20 }}
      />
      <Cell
        title="Logout"
        icon="log-out-outline"
        tintColor={"transparent"}
        onPress={() => {
          Alert.alert(
            "Logout?",
            "You have to login again",
            [
              {
                text: "Logout",
                onPress: () => {
                  onSignOut();
                },
              },
              {
                text: "Cancel",
              },
            ],
            { cancelable: true }
          );
        }}
        showForwardIcon={false}
      />
      <Cell
        title="Delete my account"
        icon="trash-outline"
        iconColor={"white"}
        tintColor={"red"}
        onPress={() => {
          Alert.alert(
            "Delete account?",
            "Deleting your account will erase your message history",
            [
              {
                text: "Delete my account",
                onPress: () => {
                  deleteAccount();
                },
              },
              {
                text: "Cancel",
              },
            ],
            { cancelable: true }
          );
        }}
        showForwardIcon={false}
        style={{ marginTop: 20 }}
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

export default Account;
