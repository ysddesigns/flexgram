import React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/firebaseConfig";
import Cell from "@/components/Cell";
import { Colors } from "@/constants/Colors";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";

const Text = ThemedText;
const View = ThemedView;

const Profile = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];

  const handleChangeName = () => {
    Alert.alert("Change Name", "This feature is coming soon.");
  };

  const handleDisplayEmail = () => {
    Alert.alert("Display Email", `Your email is: ${auth?.currentUser?.email}`);
  };

  const handleChangeProfilePicture = () => {
    Alert.alert("Change Profile Picture", "This feature is coming soon.");
  };

  const handleShowProfilePicture = () => {
    Alert.alert("Show Profile Picture", "This feature is coming soon.");
  };

  const initials = auth?.currentUser?.displayName
    ? auth.currentUser.displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
    : auth?.currentUser?.email?.charAt(0).toUpperCase();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Stack.Screen options={{ title: "Profile" }} />
      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          style={[styles.avatar, { backgroundColor: theme.primary }]}
          onPress={handleShowProfilePicture}
        >
          <Text
            style={[styles.avatarLabel, { color: theme.text, padding: 12 }]}
          >
            {initials}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cameraIcon, { backgroundColor: theme.teal }]}
          onPress={handleChangeProfilePicture}
        >
          <Ionicons name="camera-outline" size={24} color={theme.icon} />
        </TouchableOpacity>
      </View>

      {/* User Info Cells */}
      <View style={styles.infoContainer}>
        <Cell
          title="Name"
          icon="person-outline"
          iconColor={theme.icon}
          subtitle={auth?.currentUser?.displayName || "No name set"}
          secondIcon="pencil-outline"
          onPress={handleChangeName}
          style={[
            styles.cell,
            { backgroundColor: theme.background, shadowColor: theme.text },
          ]}
        />

        <Cell
          title="Email"
          subtitle={auth?.currentUser?.email}
          icon="mail-outline"
          iconColor={theme.icon}
          secondIcon="pencil-outline"
          onPress={handleDisplayEmail}
          style={[
            styles.cell,
            { backgroundColor: theme.background, shadowColor: theme.text },
          ]}
        />

        <Cell
          title="About"
          subtitle="Available"
          icon="information-circle-outline"
          iconColor={theme.icon}
          secondIcon="pencil-outline"
          onPress={() => Alert.alert("About", "This feature is coming soon.")}
          style={[
            styles.cell,
            { backgroundColor: theme.background, shadowColor: theme.text },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontSize: 36,
    fontWeight: "bold",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  infoContainer: {
    marginTop: 40,
    width: "90%",
  },
  cell: {
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 0.5,
  },
});

export default Profile;
