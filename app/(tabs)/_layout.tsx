import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { HapticTab } from "@/components/HapticTab";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
              color={color}
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
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Setting",
          headerShown: true,

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
