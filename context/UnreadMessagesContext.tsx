import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UnreadMessagesContext = createContext<any>(null);

export const UnreadMessagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [unreadCount, setUnreadCount] = useState<number | any>(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem("newMessages");
        const newMessages = storedMessages ? JSON.parse(storedMessages) : {};
        const count = Object.values(newMessages).reduce(
          (total: any, num) => total + num,
          0
        );
        setUnreadCount(count);
      } catch (error) {
        console.log("Error loading unread messages count", error);
      }
    };
    loadUnreadCount();
  }, []);

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};
