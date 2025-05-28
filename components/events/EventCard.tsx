import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { IEvent } from '../../types/event';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  event: IEvent;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const EventCard = ({ event, onEdit, onDelete }: Props) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderRightActions = () => (
    <View style={styles.actions}>
      <TouchableOpacity
        onPress={() => onEdit?.(event.id)}
        style={[styles.actionButton, { backgroundColor: '#facc15' }]}
      >
        <Ionicons name="create-outline" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete?.(event.id)}
        style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('EventDetail', { event })}>
        <View style={styles.card}>
          {event.imageUrl ? (
            <Image source={{ uri: event.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, { backgroundColor: '#e5e7eb' }]} />
          )}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{event.title}</Text>

            <View style={styles.row}>
              <Ionicons name="calendar" size={14} color="#6b7280" />
              <Text style={styles.text}>{event.date} {event.startTime} - {event.endTime}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="location" size={14} color="#6b7280" />
              <Text style={styles.text}>{event.location}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="people" size={14} color="#6b7280" />
              <Text style={styles.text}>Cupos: {event.capacity - event.spotsLeft}/{event.capacity} ocupados</Text>
            </View>

            {event.categories.length > 0 && (
              <View style={styles.row}>
                <Ionicons name="pricetag" size={14} color="#6b7280" />
                <Text style={styles.text} numberOfLines={1}>{event.categories.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  image: {
    width: 100,
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f2937',
  },
  text: {
    fontSize: 13,
    color: '#4b5563',
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 8,
    marginRight: 16,
  },
  actionButton: {
    width: 44,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
