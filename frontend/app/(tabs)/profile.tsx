import { View, Text, Image } from "react-native";
import AeroBackground from "../../components/AeroBackground";
import Glass from "../../components/Glass";
import { useEffect, useState } from "react";
import { getSession, clearSession } from "../../lib/auth";
import { Pressable } from "react-native";

export default function Profile() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    getSession().then((s) => {
      if (s) {
        setName(s.displayName);
        setAvatar(s.avatarUrl ?? null);
      }
    });
  }, []);

  return (
    <View className="flex-1">
      <AeroBackground />
      <View className="flex-1 px-5 pt-14 gap-5">
        <Text className="text-2xl font-semibold text-neutral-800">Profile</Text>

        <Glass>
          <View className="flex-row items-center gap-4">
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <View className="h-16 w-16 rounded-full bg-white/70" />
            )}
            <View>
              <Text className="text-neutral-800 text-lg">{name}</Text>
              <Text className="text-neutral-500">Last.fm connected</Text>
            </View>
          </View>
        </Glass>

        <Pressable
          onPress={async () => {
            await clearSession();
            location.reload();
          }}
          className="self-start rounded-glass bg-white/60 border border-white/60 shadow-glass px-4 py-3"
        >
          <Text className="text-neutral-800">Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}
