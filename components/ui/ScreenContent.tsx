import { View, Text } from 'react-native';

type ScreenContentProps = {
  title: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, children }: ScreenContentProps) => {
  return (
    <View className="items-center justify-start p-4">
      <Text className="text-2xl font-bold text-blue-600 mb-4">{title}</Text>
      {children}
    </View>
  );
};
