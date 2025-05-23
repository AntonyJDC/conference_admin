import { Text, View } from 'react-native';
import { Container } from '../../components/layout/Container';
import { ScreenContent } from '../../components/ui/ScreenContent';

export default function StatsScreen() {
  return (
    <Container>
      <ScreenContent title="Estadísticas">
        <View className="w-full items-center">
          <Text className="text-gray-600">Aquí irá el resumen de eventos y participación.</Text>
        </View>
      </ScreenContent>
    </Container>
  );
}
