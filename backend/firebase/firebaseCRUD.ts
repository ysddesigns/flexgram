import {
  doc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import {
  getUserFromStorage,
  saveUserToStorage,
} from "../asyncstorage/helpersFunction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/firebaseConfig";

// add user details to the database
export const addUser = async (uid: string, phone?: string, email?: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const userData = await setDoc(docRef, {
      phone,
      email,
      createdAt: new Date().toString(),
    });
    console.log("user added successfully uid:", uid);

    //save data to async storage
    saveUserToStorage(userData);
  } catch (error) {
    console.log("error adding user:", error);
  }
};

// fetch single data
export const fetchUser = async (id: string) => {
  try {
    console.log("fetching user with id:", id);

    const docRef = doc(db, "users", id);
    const docsnap = await getDoc(docRef);

    if (docsnap.exists()) {
      const userData = docsnap.data();
      console.log("Document data:", userData);

      // save data to async storage
      saveUserToStorage(userData);
      return userData; //return the document data
    } else {
      console.log("{from fetchUser()} No such document!");

      // Fallback: retrieve data from asyncstorage
      const localData = await getUserFromStorage();
      if (localData) {
        console.log("fallback: retrieve  data from AsyncStorage", localData);

        return localData;
      }
    }
  } catch (error) {
    console.log("error fetching document", error);

    //fallback: retrieve data from local storage
    const localData = await getUserFromStorage();
    if (localData) {
      console.log("retrieved local data from AsyncStorage", localData);
      return localData;
    }
    throw new Error(); // Rethrow error for better handling when function called
  }
};

// fetch multple data
export const fetchAll = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched data:", data);
  } catch (error) {
    console.log("error fetching documents", error);
  }
};
export const updateUser = async (id: string) => {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      fullname: "",
    });
    console.log("Document updated Successfully");

    // fetch updated data and save in AsyncStorage
    const updatedUser = await fetchUser(id);
    if (updatedUser) {
      await saveUserToStorage(updatedUser);
    }
  } catch (error) {}
};

export const deleteUser = async (id: string) => {
  try {
    const docRef = doc(db, "user", id);
    await deleteDoc(docRef);
    console.log("data deleted successfully!");

    // clear AsyncStorage data
    await AsyncStorage.removeItem("userData");
    console.log("user data remove from AsybcStorage");
  } catch (error) {
    console.log("error deleting data:", error);
  }
};
