import "../globals.css";
import { Tabs, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getSession } from "../../lib/auth";
import { BlurView } from "expo-blur";
import { View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayour() {
  const [checked, setChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      setHasSession(!!s);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;
  if (!hasSession) return <Redirect href="/(auth)" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#0ea5e9",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          position: "absolute",
          height: 68,
          borderTopWidth: 0,
          backgroundColor: "transparent",
          elevation: 0,
        },
        // glass background under the tabs
        tabBarBackground: () => (
          <BlurView
            intensity={50}
            tint="light"
            style={{
              ...Platform.select({
                ios: { backdropFilter: "blur(12px)" as any },
                web: { backdropFilter: "blur(12px)" as any },
                android: {},
              }),
              flex: 1,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.6)",
              borderColor: "rgba(255,255,255,0.7)",
              borderTopWidth: 1,
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pick"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
