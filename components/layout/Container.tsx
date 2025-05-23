import { SafeAreaView } from 'react-native';
import { View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="m-4">{children}</View>
    </SafeAreaView>
  );
};
