// components/AeroBackground.tsx
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function AeroBackground() {
  return (
    <View className="absolute inset-0">
      {/* base wash */}
      <LinearGradient
        colors={["#ffffff", "#faf7ff", "#fff5ff"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* magenta / purple aura */}
      <LinearGradient
        colors={["#ff2fb233", "#a855f733", "#00e5ff22"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* big bubbly blobs */}
      <View className="absolute -left-10 top-8 h-64 w-64 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <View className="absolute right-[-20] top-24 h-56 w-56 rounded-full bg-purple-300/30 blur-3xl" />
      <View className="absolute left-10 top-20 h-16 w-16 rounded-full bg-white/40 blur-xl border border-white/60" />
      <View className="absolute right-16 top-40 h-12 w-12 rounded-full bg-white/30 blur-lg border border-white/50" />
      <View className="absolute left-28 bottom-32 h-20 w-20 rounded-full bg-white/35 blur-xl border border-white/60" />
      <View className="absolute right-10 bottom-20 h-14 w-14 rounded-full bg-white/30 blur-lg border border-white/40" />
      <View className="absolute left-5 bottom-16 h-10 w-10 rounded-full bg-white/25 blur-md border border-white/40" />
      <View className="absolute left-10 bottom-10 h-52 w-52 rounded-full bg-pink-200/25 blur-3xl" />
      <View className="absolute right-6 bottom-20 h-40 w-40 rounded-full bg-cyan-200/20 blur-3xl" />

      {/* tiny glow bubbles */}

      <View className="absolute left-24 top-12 h-3 w-3 rounded-full bg-white/70" />
      <View className="absolute right-20 top-16 h-2.5 w-2.5 rounded-full bg-fuchsia-200/60" />
      <View className="absolute left-8 bottom-28 h-2 w-2 rounded-full bg-pink-200/70" />
      <View className="absolute left-6 top-16 h-3 w-3 rounded-full bg-fuchsia-400/70" />
      <View className="absolute left-10 top-24 h-2 w-2 rounded-full bg-pink-400/70" />
      <View className="absolute right-10 top-14 h-2.5 w-2.5 rounded-full bg-purple-400/70" />
      <View className="absolute right-16 bottom-12 h-2 w-2 rounded-full bg-cyan-400/60" />
    </View>
  );
}
