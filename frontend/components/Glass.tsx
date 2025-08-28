// components/Glass.tsx
import { ReactNode } from "react";
import { BlurView } from "expo-blur";
import { View } from "react-native";

export default function Glass({
  children,
  className = "",
  intensity = 40,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  return (
    <View
      className={`rounded-3xl overflow-hidden border border-white/70 shadow-2xl ${className}`}
      style={{
        shadowColor: "#ff2fb2",
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      <BlurView
        intensity={intensity}
        tint="light"
        style={{ padding: 12, backgroundColor: "rgba(255,255,255,0.28)" }}
      >
        {children}
      </BlurView>
    </View>
  );
}
