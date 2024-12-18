import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { fetchUser } from "../firebaseCRUD";

export const saveContact = async (currentUserId: string, contactId: string) => {
  try {
    const docRef = doc(db, "users", currentUserId, "contacts", contactId);
    const contactData = await fetchUser(contactId);

    if (contactData) {
      await setDoc(docRef, {
        contactId,
        fullname: contactData.fullname,
        phone: contactData.phone,
        profilePicture: contactData.profilePicture,
        createdAt: new Date().toISOString(),
      });
      console.log("Contact saved successfully.");
    } else {
      console.log("Failed to retrieve contact data for saving.");
    }
  } catch (error) {
    console.error("Error saving contact:", error);
  }
};
