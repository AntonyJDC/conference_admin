import {
  View,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEventStore } from '../../store/eventStore';
import { EventCard } from '../../components/events/EventCard';
import { IEvent } from '../../types/event';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function EventListScreen() {
  const { events, loading, loadEvents, deleteEvent } = useEventStore();
  const [tab, setTab] = useState<'activos' | 'finalizados'>('activos');
  const [search, setSearch] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [filterStatus, setFilterStatus] = useState<'todos' | 'activos' | 'finalizados'>('todos');


  useEffect(() => {
    loadEvents();
  }, []);

  const now = dayjs();
  const filteredEvents = events
    .filter((e) => {
      const isAfter = dayjs(`${e.date} ${e.endTime}`).isAfter(now);
      if (filterStatus === 'activos') return isAfter;
      if (filterStatus === 'finalizados') return !isAfter;
      return true;
    })
    .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));


  const groupedEvents = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      const date = event.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    }, {} as Record<string, IEvent[]>);
  }, [filteredEvents]);

  useEffect(() => {
    const allOpen: { [key: string]: boolean } = {};
    Object.keys(groupedEvents).forEach((date) => {
      allOpen[date] = true;
    });
    setOpenSections(allOpen);
  }, [Object.keys(groupedEvents).join(',')]);

  const toggleSection = (date: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSections((prev) => ({ ...prev, [date]: !prev[date] }));
  };

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
    navigation.navigate('CreateEvent');
  };

  return (
    <View style={{ flex: 1, paddingTop: 8 }}>
      <TextInput
        placeholder="Buscar evento..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />
      <View style={styles.filterTags}>
        {['todos', 'activos', 'finalizados'].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilterStatus(status as any)}
            style={[
              styles.filterTag,
              filterStatus === status && styles.filterTagActive
            ]}
          >
            <Text style={[
              styles.filterTagText,
              filterStatus === status && styles.filterTagTextActive
            ]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : filteredEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>No hay eventos</Text>
        </View>
      ) : (
        <ScrollView>
          {Object.entries(groupedEvents).map(([date, events]) => (
            <View key={date}>
              <TouchableOpacity
                onPress={() => toggleSection(date)}
                style={styles.accordionHeader}
              >
                <Text style={styles.accordionHeaderText}>{dayjs(date).format('dddd, D MMMM YYYY')}</Text>
                <Ionicons
                  name={openSections[date] ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#374151"
                />
              </TouchableOpacity>
              {openSections[date] && (
                <View>
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDelete={handleDelete}
                      onEdit={() => handleEdit(event)}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontWeight: '600',
    color: '#374151',
  },
  activeTabText: {
    color: 'white',
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    fontSize: 14,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
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
  filterTags: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 10,
  },
  filterTag: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
  },
  filterTagActive: {
    backgroundColor: '#2563eb',
  },
  filterTagText: {
    color: '#374151',
    fontWeight: '500',
  },
  filterTagTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280', // gris neutro
    fontWeight: '500',
  },

});
