import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { Colors } from "@/constants/Colors";
import Cell from "@/components/Cell";
import ContactRow from "@/components/ContactRow"; // Make sure this component is defined to display user info
import { User } from "@/types";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Text = ThemedText;
const View = ThemedView;

const Users: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "light"];
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Array<User>>([]);
  const [existingChats, setExistingChats] = useState<
    Array<{
      chatId: string;
      userEmails: Array<{
        email: string;
        name: string;
        deletedFromChat: boolean;
      }>;
    }>
  >([]);

  const fetchUsers = () => {
    const collectionUserRef = collection(db, "users");
    const q = query(collectionUserRef, orderBy("name", "asc"));

    return onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(fetchedUsers);
      setLoading(false);
    });
  };

  const fetchChats = () => {
    const user = auth.currentUser;
    const collectionChatsRef = collection(db, "chats");
    const q2 = query(
      collectionChatsRef,
      where("users", "array-contains", {
        email: user.email || "", // Fallback to an empty string
        name: user.displayName || "", // Fallback to an empty string
        deletedFromChat: false,
        avatar: user.photoURL || "", // Fallback to an empty string
      }),
      where("groupName", "==", "")
    );
    return onSnapshot(q2, (snapshot) => {
      const existing = snapshot.docs.map((doc) => ({
        chatId: doc.id,
        userEmails: doc.data().users,
      }));
      setExistingChats(existing);
    });
  };
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoading(false);

        return;
      }

      const unsubscribeUsers = fetchUsers();
      const unsubscribeChats = fetchChats();

      return () => {
        unsubscribeUsers();
        unsubscribeChats();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  const handleNewGroup = useCallback(() => {
    router.push("/screens/Group");
  }, [router]);

  const handleNewUser = useCallback(() => {
    alert("New user");
  }, []);

  const handleNavigate = useCallback(
    async (user: User) => {
      const currentUserEmail = auth?.currentUser?.email;
      console.log("Current user email:", currentUserEmail);

      // Ensure current user is authenticated
      if (!currentUserEmail) {
        console.error("User is not authenticated.");
        alert("You must be logged in to access chats.");
        return; // Exit if the user is not authenticated
      }

      // Check if the user is trying to navigate to themselves
      if (currentUserEmail === user.email) {
        console.warn("User is trying to navigate to themselves.");
        return; // Prevent navigation to self chat
      }

      // Find existing chats
      const existingChat = existingChats.find((existingChat) => {
        const isCurrentUserInChat = existingChat.userEmails.some(
          (e) => e.email === currentUserEmail
        );
        const isUserInChat = existingChat.userEmails.some(
          (e) => e.email === user.email
        );

        return isCurrentUserInChat && isUserInChat;
      });

      // If there’s an existing chat, set the chat ID to navigate
      if (existingChat) {
        console.log("Existing chat found:", existingChat);
        const chatParams = {
          chatId: existingChat.chatId,
          // chatId: "ZWvzuqDJtLTVeY2Bo3mn",
          chatName: handleName(user),
          userEmail: user.email,
          avatar: user.avatar,
        };
        console.log("Navigating to existing chat with params:", chatParams);
        router.push({
          pathname: "/screens/Chat",
          params: chatParams,
        });
      } else {
        // Create a new chat if no existing chat was found
        const newChatRef = doc(collection(db, "chats"));

        // Validate user data before proceeding
        console.log("Creating new chat with:", {
          currentUserEmail,
          userEmail: user.email,
        });

        if (!currentUserEmail || !user.email) {
          console.error("Invalid user data: cannot create chat.");
          return; // Exit if user data is invalid
        }

        try {
          await setDoc(newChatRef, {
            lastUpdated: Date.now(),
            groupName: "",
            users: [
              {
                email: currentUserEmail,
                name: auth.currentUser?.displayName || "",
                deletedFromChat: false,
                avatar: auth.currentUser?.photoURL || "",
              },
              {
                email: user.email,
                name: user.name || "",
                deletedFromChat: false,
                avatar: user.avatar || "",
              },
            ],
            lastAccess: [
              { email: currentUserEmail, date: Date.now() },
              { email: user.email, date: "" },
            ],
            messages: [],
          });

          router.push({
            pathname: "/screens/Chat",
            params: {
              chatId: newChatRef.id,
              chatName: handleName(user),
              userEmail: user.email,
            },
          });
        } catch (error) {
          console.error("Error creating chat:", error);
          alert("Failed to create chat. Please try again.");
        }
      }
    },
    [existingChats, router]
  );

  const handleName = useCallback((user: User) => {
    const name = user.name;
    const email = user.email;
    return name
      ? email === auth?.currentUser?.email
        ? `${name}(You)`
        : name
      : email || "~ No Name or Email ~";
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Stack.Screen options={{ title: "Users" }} />

      <Cell
        title="New group"
        icon="people"
        tintColor={"transparent"}
        onPress={handleNewGroup}
        style={{ marginTop: 5 }}
      />
      <Cell
        title="New user"
        icon="person-add"
        tintColor={"transparent"}
        onPress={handleNewUser}
        style={{ marginBottom: 10 }}
      />
      {loading ? (
        <ActivityIndicator size={"large"} color={theme.primary} />
      ) : users.length === 0 ? (
        <View style={styles.blankContainer}>
          <Text style={styles.textContainer}>No registered users yet</Text>
        </View>
      ) : (
        <ScrollView>
          <View>
            <Text style={styles.textContainer}>Registered users</Text>
          </View>
          {users.map((user) => (
            <ContactRow
              name={handleName(user)}
              key={user.id}
              user={user}
              onPress={() => handleNavigate(user)} // Navigate to the user's chat
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  blankContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "300",
  },
});

export default Users;
