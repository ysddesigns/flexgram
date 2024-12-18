import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
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
import ContactRow from "@/components/ContactRow";
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

  useEffect(() => {
    const unsubscribeUsers = auth.onAuthStateChanged((user) => {
      if (user) {
        const collectionUserRef = collection(db, "users");
        const q = query(collectionUserRef, orderBy("name", "asc"));

        const unsubscribeFromUsers = onSnapshot(q, (snapshot) => {
          const fetchedUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as User[];
          setUsers(fetchedUsers);
          setLoading(false);
        });

        const collectionChatsRef = collection(db, "chats");
        const q2 = query(
          collectionChatsRef,
          where("users", "array-contains", {
            email: user.email,
            name: user.displayName,
            deletedFromChat: false,
          }),
          where("groupName", "==", "")
        );

        const unsubscribeFromChats = onSnapshot(q2, (snapshot) => {
          const existing = snapshot.docs.map((existingChat) => ({
            chatId: existingChat.id,
            userEmails: existingChat.data().users,
          }));
          setExistingChats(existing);
        });

        return () => {
          unsubscribeFromUsers();
          unsubscribeFromChats();
        };
      } else {
        setLoading(false); // Set loading to false if no user is authenticated
      }
    });

    return () => unsubscribeUsers();
  }, []);

  const handleNewGroup = useCallback(() => {
    router.push("/screens/Group");
  }, [router]);

  const handleNewUser = useCallback(() => {
    alert("New user");
  }, []);

  const handleNavigate = useCallback(
    (user: User) => {
      let navigationChatID = "";
      let messageYourselfChatID = "";

      existingChats.forEach((existingChat) => {
        const isCurrentUserInTheChat = existingChat.userEmails.some(
          (e) => e.email === auth?.currentUser?.email
        );
        const isMessageYourselfExists = existingChat.userEmails.filter(
          (e) => e.email === user.email
        ).length;

        if (
          isCurrentUserInTheChat &&
          existingChat.userEmails.some((e) => e.email === user.email)
        ) {
          navigationChatID = existingChat.chatId;
        }

        if (isMessageYourselfExists === 2) {
          messageYourselfChatID = existingChat.chatId;
        }

        // Prevent navigation to self chat
        if (auth?.currentUser?.email === user.email) {
          navigationChatID = "";
        }
      });

      const chatIDToNavigate = messageYourselfChatID || navigationChatID;

      if (chatIDToNavigate) {
        router.push({
          pathname: "/screens/Chat",
          params: { id: chatIDToNavigate, chatName: handleName(user) },
        });
      } else {
        // Create new chat
        const newRef = doc(collection(db, "chats"));
        setDoc(newRef, {
          lastUpdated: Date.now(),
          groupName: "",
          users: [
            {
              email: auth?.currentUser?.email,
              name: auth?.currentUser?.displayName,
              deletedFromChat: false,
            },
            {
              email: user.email,
              name: user.name,
              deletedFromChat: false,
            },
          ],
          lastAccess: [
            { email: auth?.currentUser?.email, date: Date.now() },
            { email: user.email, date: "" },
          ],
          messages: [],
        })
          .then(() => {
            router.push({
              pathname: "/screens/Chat",
              params: { id: newRef.id, chatName: handleName(user) },
            });
          })
          .catch((error) => {
            console.error("Error creating chat:", error);
          });
      }
    },
    [existingChats, router]
  );

  const handleSubtitle = useCallback((user: User) => {
    return user.email === auth?.currentUser?.email
      ? "Message yourself"
      : "User status";
  }, []);

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
      <Cell
        title="New group"
        icon="people"
        tintColor={theme.teal}
        onPress={handleNewGroup}
        style={{ marginTop: 5 }}
      />
      <Cell
        title="New user"
        icon="person-add"
        tintColor={theme.teal}
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
            <React.Fragment key={user.id}>
              <ContactRow
                name={handleName(user)}
                subtitle={handleSubtitle(user)}
                onPress={() => handleNavigate(user)}
                showForwardIcon={false}
              />
            </React.Fragment>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
