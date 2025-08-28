import { View, Text, Image } from "react-native";
import AeroBackground from "../../components/AeroBackground";
import Glass from "../../components/Glass";

export default function Home() {
  return (
    <View className="flex-1">
      <AeroBackground />
      <View className="flex-1 px-5 pt-14 gap-5">
        <Text className="text-2xl font-semibold text-neutral-800">Home</Text>
        <Glass>
          <Text className="text-neutral-800 text-base">
            Weekly reveal placeholder
          </Text>
        </Glass>

        <Glass>
          <Text className="text-neutral-800 text-base">
            Recently played placeholder
          </Text>
        </Glass>
      </View>
    </View>
  );
}
