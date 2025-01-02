// MessageServices.ts

import { auth, db } from "@/firebaseConfig";
import { IMessage } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

// Function to send a message
// export const sendMessage = async (
//   messages: IMessage[],
//   chatId: string,
//   uid: string,
//   userName: string
// ): Promise<void> => {
//   const message = messages[0]; // Assuming we're sending one message at a time
//   await addDoc(collection(db, `chats/${chatId}/messages`), {
//     ...message,
//     createdAt: new Date(),
//     user: {
//       _id: uid,
//       name: userName,
//       avatar: "https://placeimg.com/150/150/any", // Optional: Add avatar URL
//     },
//   });
// };

export const sendMessage = async (newMessages, chatId, uid, userName) => {
  const message = newMessages[0]; // Assuming single message sending
  const messageData = {
    ...message,
    user: { _id: uid, name: userName },
    createdAt: new Date(), // Add timestamp
  };

  const chatDocRef = doc(db, "chats", chatId);
  await updateDoc(chatDocRef, {
    messages: arrayUnion(messageData), // Append the new message
  });
};

export const testWrite = async () => {
  try {
    await db.collection("test").add({ message: "Hello, Firestore!" });
    console.log("Write successful");
  } catch (error) {
    console.error("Error writing to Firestore: ", error);
  }
};

// Function to fetch messages
// export const fetchMessages = (
//   chatId: string,
//   callback: (messages: IMessage[]) => void
// ) => {
//   const q = query(
//     collection(db, `chats/${chatId}/messages`),
//     orderBy("createdAt", "asc")
//   );

//   // Listen for real-time updates
//   const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     const messagesFirestore: IMessage[] = querySnapshot.docs.map((doc) => {
//       const message = doc.data();
//       return {
//         _id: doc.id,
//         text: message.text,
//         createdAt: message.createdAt.toDate(),
//         user: {
//           _id: message.user._id,
//           name: message.user.name,
//           avatar: message.user.avatar,
//         },
//       } as IMessage;
//     });
//     callback(messagesFirestore);
//   });

//   return unsubscribe; // Return unsubscribe function to stop listening when needed
// };

export const fetchMessages = (chatId, callback) => {
  const unsubscribe = onSnapshot(doc(db, "chats", chatId), (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const messages = data.messages || []; // Ensure you handle the case where messages might be undefined
      callback(messages);
    } else {
      console.log("No such document!");
      callback([]); // Return an empty array if no document exists
    }
  });

  return unsubscribe; // Return the unsubscribe function
};

// const fetchChats = async () => {
//   try {
//     const chatCollection = collection(db, "chats"); // Adjust the collection name as necessary
//     const chatSnapshot = await getDocs(chatCollection);
//     const chatList: Chat[] = chatSnapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         name: data.groupName || data.users[0]?.name || "Unknown", // Use groupName or first user's name
//         profilePicture: data.users[0]?.image || "defaultProfilePicUrl", // Use first user's image or a default
//         lastMessage:
//           data.messages[data.messages.length - 1]?.text || "No messages yet", // Get the last message text
//         timestamp: new Date(data.lastUpdated).toISOString(), // Convert lastUpdated to ISO string
//         unreadCount: 0, // Set an initial unread count, adjust as necessary
//         data: data,
//       };
//     });
//     setChats(chatList);
//   } catch (error) {
//     console.error("Error fetching chats: ", error);
//   }
// };
