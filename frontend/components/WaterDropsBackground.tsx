import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WaterDropsBackground() {
  return (
    <View className="absolute inset-0">
      {/* soft gradient base */}
      <LinearGradient
        colors={["#ffffff", "#fafaff", "#fff5ff"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* faint pink/purple glow overlay */}
      <LinearGradient
        colors={["#ff2fb220", "#a855f720", "#00e5ff20"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* water droplets */}
      <View className="absolute left-10 top-20 h-16 w-16 rounded-full bg-white/40 blur-xl border border-white/60" />
      <View className="absolute right-16 top-40 h-12 w-12 rounded-full bg-white/30 blur-lg border border-white/50" />
      <View className="absolute left-28 bottom-32 h-20 w-20 rounded-full bg-white/35 blur-xl border border-white/60" />
      <View className="absolute right-10 bottom-24 h-14 w-14 rounded-full bg-white/30 blur-lg border border-white/40" />
      <View className="absolute left-5 bottom-16 h-10 w-10 rounded-full bg-white/25 blur-md border border-white/40" />

      {/* tiny sparkle drops */}
      <View className="absolute left-24 top-12 h-3 w-3 rounded-full bg-white/70" />
      <View className="absolute right-20 top-16 h-2.5 w-2.5 rounded-full bg-fuchsia-200/60" />
      <View className="absolute left-8 bottom-28 h-2 w-2 rounded-full bg-pink-200/70" />
    </View>
  );
}
