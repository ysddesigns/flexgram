import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const blockUser = async (
  currentUserId: string,
  blockedUserId: string
) => {
  try {
    const docRef = doc(
      db,
      "users",
      currentUserId,
      "blockedUsers",
      blockedUserId
    );
    await setDoc(docRef, {
      blockedUserId,
      blockedAt: new Date().toISOString(),
    });
    console.log("User blocked successfully.");
  } catch (error) {
    console.error("Error blocking user:", error);
  }
};
