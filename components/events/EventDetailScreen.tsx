import { View, Text, StyleSheet, Image, ScrollView, FlatList, ViewToken, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@env';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Review = {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
};

type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

export default function EventDetailScreen() {

    const { params } = useRoute<EventDetailRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [activeIndex, setActiveIndex] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    if (!params || !params.event) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No se encontró el evento.</Text>
            </View>
        );
    }

    const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const event = params.event;
    const total = event.capacity;
    const occupied = total - event.spotsLeft;
    const available = event.spotsLeft;
    const percent = Math.round((occupied / total) * 100);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_URL}/reviews/${event.id}/get`);
                setReviews(res.data);
            } catch (err) {
                console.error('Error cargando reseñas:', err);
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, []);

    const ratingAverage =
        reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

    const fullStars = Math.floor(ratingAverage);
    const hasHalfStar = ratingAverage - fullStars >= 0.25 && ratingAverage - fullStars < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const renderReview = ({ item }: { item: Review }) => (
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
        <ScrollView
            style={{ flex: 1, backgroundColor: 'white' }}
            contentContainerStyle={{ padding: 16 }}
        >
            {event.imageUrl && <Image source={{ uri: event.imageUrl }} style={styles.image} />}
            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.row}>
                <Ionicons name="calendar-outline" size={16} color="#6b7280" style={styles.icons} />
                <Text style={styles.text}>{dayjs(event.date).format('dddd, D MMMM YYYY')}</Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="time-outline" size={16} color="#6b7280" style={styles.icons} />
                <Text style={styles.text}>{event.startTime} - {event.endTime}</Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="location-outline" size={16} color="#6b7280" style={styles.icons} />
                <Text style={styles.text}>{event.location}</Text>
            </View>

            <View style={styles.row}>
                <Ionicons name="pricetag-outline" size={16} color="#6b7280" style={styles.icons} />
                <Text style={styles.text}>{event.categories.join(', ')}</Text>
            </View>

            {event.description && (
                <>
                    <Text style={styles.subtitle}>Descripción</Text>
                    <Text style={styles.text}>{event.description}</Text>
                </>
            )}

            <Text style={styles.subtitle}>Estado de ocupación</Text>
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${percent}%` }]} />
                <Text style={[styles.progressText, { color: percent > 15 ? 'white' : '#374151' }]}>{percent}%</Text>
            </View>
            <Text style={styles.capacityText}>{occupied} ocupados / {total} cupos ({available} disponibles)</Text>

            {!loadingReviews && (
                <>
                    <Text style={styles.subtitle}>Calificación</Text>
                    <View style={styles.ratingContainer}>
                        <View style={styles.ratingBox}>
                            <Text style={styles.ratingText}>{ratingAverage.toFixed(1)}</Text>
                        </View>
                        <View style={styles.stars}>
                            {[...Array(fullStars)].map((_, i) => (
                                <Ionicons key={`full-${i}`} name="star" size={18} color="#facc15" />
                            ))}
                            {hasHalfStar && <Ionicons name="star-half" size={18} color="#facc15" />}
                            {[...Array(emptyStars)].map((_, i) => (
                                <Ionicons key={`empty-${i}`} name="star-outline" size={18} color="#facc15" />
                            ))}
                        </View>
                    </View>
                    <Text style={styles.reviewCountText}>
                        Basado en {reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'}
                    </Text>
                    {reviews.length === 0 && (
                        <Text style={styles.subtitle}>Aún no hay opiniones para este evento.</Text>
                    )}
                    {reviews.length > 0 && (

                        <Text style={styles.subtitle}>Opiniones de los usuarios:</Text>
                    )}
                    <FlatList
                        data={reviews.slice(0, 5)}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderReview}
                        onViewableItemsChanged={handleViewableItemsChanged}
                        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                        style={{ marginBottom: 8, marginTop: 8 }}
                    />

                    <View style={styles.indicatorContainer}>
                        {reviews.slice(0, 5).map((_, i) => (
                            <View
                                key={i}
                                style={[styles.indicatorDot, activeIndex === i && styles.indicatorDotActive]}
                            />
                        ))}
                    </View>

                    {reviews.length > 5 && (
                        <TouchableOpacity onPress={() => navigation.navigate('AllReviews', { eventId: event.id })}>
                            <Text style={styles.viewAllText}>Ver todas las opiniones</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: 'white' },
    image: { width: '100%', height: 180, borderRadius: 12, marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '700', color: '#1f2937', marginBottom: 12 },
    subtitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 16, marginBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
    text: { fontSize: 14, color: '#374151', flex: 1, flexWrap: 'wrap' },
    icons: { marginRight: 8 },
    progressContainer: {
        height: 24,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginTop: 6,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    progressBar: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#2563eb',
        borderRadius: 12,
    },
    progressText: {
        fontWeight: '600',
        fontSize: 13,
        zIndex: 1,
        position: 'absolute',
    },
    capacityText: { fontSize: 13, color: '#374151', marginTop: 4 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    ratingBox: {
        backgroundColor: '#facc15',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 10,
    },
    ratingText: { color: '#1f2937', fontWeight: '700', fontSize: 14 },
    stars: { flexDirection: 'row' },
    reviewCountText: { fontSize: 13, color: '#6b7280', marginTop: 4 },
    reviewCard: {
        width: 260,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 12,
        paddingVertical: 24,
        marginRight: 12,
        elevation: 2,
    },
    reviewAuthor: { fontWeight: '600', marginBottom: 4, color: '#1f2937' },
    reviewStars: { flexDirection: 'row', marginBottom: 4 },
    reviewComment: { fontSize: 13, color: '#374151' },
    indicatorContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 6 },
    indicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#d1d5db',
        marginHorizontal: 4,
    },
    indicatorDotActive: { backgroundColor: '#2563eb' },
    viewAllText: {
        color: '#2563eb',
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 4,
    },
});