import { View, Text } from "react-native";
import AeroBackground from "../../components/AeroBackground";
import Glass from "../../components/Glass";

export default function Friends() {
  return (
    <View className="flex-1">
      <AeroBackground />
      <View className="flex-1 px-5 pt-14 gap-5">
        <Text className="text-2xl font-semibold text-neutral-800">Friends</Text>
        <Glass>
          <Text className="text-neutral-800">Friend list placeholder</Text>
        </Glass>
        <Glass>
          <Text className="text-neutral-800">Invites placeholder</Text>
        </Glass>
      </View>
    </View>
  );
}
