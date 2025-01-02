import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { HapticTab } from "@/components/HapticTab";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.grey,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute", // Allows blur effect on iOS
            backgroundColor: "transparent",
          },
          default: {
            backgroundColor: theme.background,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Chats",
          tabBarAllowFontScaling: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
              color={color}
              size={30}
              accessibilityLabel="Chats Tab"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Story"
        options={{
          title: "Story",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "reload-circle-sharp" : "reload-circle-sharp"}
              color={color}
              accessibilityLabel="Story Tab"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Setting",
          headerShown: true, // Enables header for Settings screen
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
              accessibilityLabel="Settings Tab"
            />
          ),
        }}
      />
    </Tabs>
  );
}
