import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { saveUserToStorage } from "../../asyncstorage/helpersFunction";
import { fetchUser } from "../firebaseCRUD";

export const updateProfile = async (
  uid: string,
  updatedData: {
    profilePicture?: string;
    username?: string;
    description?: string;
    images?: string[];
  }
) => {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, updatedData);

    console.log("Profile updated successfully");

    // Fetch and save updated data in AsyncStorage
    const updatedUser = await fetchUser(uid);
    if (updatedUser) {
      await saveUserToStorage(updatedUser);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};
