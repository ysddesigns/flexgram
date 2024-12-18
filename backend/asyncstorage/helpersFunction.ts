import AsyncStorage from "@react-native-async-storage/async-storage";

//saving user data to async storage
export const saveUserToStorage = async (userData: any) => {
  try {
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    console.log("user data save to async storage successfully");
  } catch (error) {
    console.log("Error saving user data to async storage", error);
    throw new Error();
  }
};

export const getUserFromStorage = async () => {
  try {
    const userDta = await AsyncStorage.getItem("userData");
    return userDta ? JSON.parse(userDta) : null;
  } catch (error) {
    console.log("Error getting user from asyncstorage:", error);
    return null;
  }
};
