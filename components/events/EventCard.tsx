import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { IEvent } from '../../types/event';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  event: IEvent;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const EventCard = ({ event, onEdit, onDelete }: Props) => {
  const renderRightActions = () => (
    <View style={styles.actions}>
      <TouchableOpacity
        onPress={() => onEdit?.(event.id)}
        style={[styles.actionButton, { backgroundColor: '#facc15' }]}
      >
        <Ionicons name="create" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete?.(event.id)}
        style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
      >
        <Ionicons name="trash" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.card}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: '#e5e7eb' }]} />
        )}

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
          <Text style={styles.text}>🗓 {event.date} {event.startTime}-{event.endTime}</Text>
          <Text style={styles.text}>📍 {event.location}</Text>
          <Text style={styles.text}>🧑‍🤝‍🧑 {event.spotsLeft}/{event.capacity}</Text>
          <Text style={styles.text} numberOfLines={1}>🏷 {event.categories.join(', ')}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 2,
    padding: 8,
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    color: '#1f2937',
  },
  text: {
    fontSize: 13,
    color: '#4b5563',
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
