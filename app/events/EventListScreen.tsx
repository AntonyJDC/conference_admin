import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEventStore } from '../../store/eventStore';
import { EventCard } from '../../components/events/EventCard';
import { IEvent } from '../../types/event';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

export default function EventListScreen() {
  const { events, loading, loadEvents, deleteEvent } = useEventStore();
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar evento', '¿Estás seguro de que deseas eliminar este evento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEvent(id);
          } catch (err) {
            Alert.alert('Error', 'No se pudo eliminar el evento.');
            console.error(err);
          }
        },
      },
    ]);
  };

  const handleEdit = (event: IEvent) => {
    navigation.navigate('EditEvent', { event });
  };

  const handleAdd = () => {
    navigation.navigate({ name: 'CreateEvent' } as never);

  };

  return (
    <View style={{ flex: 1 }}>
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEvents} />}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onDelete={handleDelete}
            onEdit={() => handleEdit(item)}
          />
        )}
        ListEmptyComponent={
          !loading ? <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay eventos</Text> : null
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
