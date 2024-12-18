import React from "react";
import {
  StyleSheet,
  Linking,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ContactRow from "@/components/ContactRow";
import { auth } from "@/firebaseConfig";
import Cell from "@/components/Cell";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Text = ThemedText;
const View = ThemedView;

const Settings = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  async function openGithub(url: any) {
    await Linking.openURL(url);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ContactRow
        name={auth?.currentUser?.displayName ?? "No name"}
        subtitle={auth?.currentUser?.email}
        style={styles.contactRow}
        onPress={() => {
          router.push("/screens/Profile");
        }}
      />

      <Cell
        title="Account"
        subtitle="Privacy, logout, delete account"
        icon="key-outline"
        onPress={() => {
          // navigation.navigate('Account');
          router.push("/screens/Account");
        }}
        iconColor="black"
        style={{ marginTop: 20 }}
      />

      <Cell
        title="Help"
        subtitle="Contact us, app info"
        icon="help-circle-outline"
        iconColor="black"
        onPress={() => {
          // navigation.navigate('Help');
          router.push("/screens/Help");
        }}
      />

      <Cell
        title="Invite a friend"
        icon="people-outline"
        iconColor="black"
        onPress={() => {
          alert("Share touched");
        }}
        showForwardIcon={false}
      />

      <TouchableOpacity
        style={styles.githubLink}
        onPress={() =>
          openGithub("https://github.com/Ctere1/react-native-chat")
        }
      >
        <View>
          <Text style={{ fontSize: 12, fontWeight: "400" }}>
            <Ionicons
              name="logo-github"
              size={12}
              style={{ color: theme.icon }}
            />{" "}
            App's Github
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contactRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  githubLink: {
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
    width: 100,
  },
});

export default Settings;
