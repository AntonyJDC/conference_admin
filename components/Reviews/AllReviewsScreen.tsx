import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@env';
import { RootStackParamList } from '../../navigation/types';

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type RouteProps = RouteProp<RootStackParamList, 'AllReviews'>;

export default function AllReviewsScreen() {
  const { params } = useRoute<RouteProps>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/reviews/${params.eventId}/get`);
        setReviews(res.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewAuthor}>Anónimo</Text>
      <View style={styles.reviewStars}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < item.rating ? 'star' : 'star-outline'}
            size={16}
            color="#facc15"
          />
        ))}
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todas las opiniones</Text>
      {loading ? (
        <Text>Cargando reseñas...</Text>
      ) : reviews.length === 0 ? (
        <Text>No hay opiniones para este evento.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1f2937',
  },
  reviewCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  reviewAuthor: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f2937',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 13,
    color: '#374151',
  },
});
