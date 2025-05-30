import { View, Text, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

type Event = {
  id: string;
  title: string;
  averageRating: number;
  totalReviews: number;
  subscriptions: number;
};

type StatsData = {
  totalEvents: number;
  totalCapacity: number;
  totalSpotsLeft: number;
  totalSubscriptions: number;
  totalPositiveReviews: number;
  totalNegativeReviews: number;
  mostSubscribedEvent?: { title: string; subscriptions: number };
  leastSubscribedEvent?: { title: string; subscriptions: number };
  bestRatedEvent?: { title: string; averageRating: number };
  worstRatedEvent?: { title: string; averageRating: number };
  events: Event[];
};

export default function StatsScreen() {
  const [data, setData] = useState<StatsData | null>(null);
  const chartWidth = Dimensions.get('window').width

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        try {
          const res = await axios.get(`${API_URL}/stats/events`);
          setData(res.data);
        } catch (err) {
          console.error('Error al obtener estadísticas:', err);
        }
      };

      fetchStats();
    }, [])
  );

  type StatCardProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    value: number | string;
  };

  const StatCard = ({ icon, label, value }: StatCardProps) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color="#2563eb" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (!data) {
    return <Text style={{ padding: 20 }}>Cargando estadísticas...</Text>;
  }
  const sortedEvents = [...data.events].sort((a, b) => a.id.localeCompare(b.id));

  const subscriptionData = {
    labels: sortedEvents.map((_, index) => `${index + 1}`),
    datasets: [{ data: sortedEvents.map(e => e.subscriptions) }],
  };

  const reviewedEvents = sortedEvents.filter(e => e.totalReviews > 0);

  const ratingData = {
    labels: reviewedEvents.map((_, index) => `${index + 1}`),
    datasets: [{ data: reviewedEvents.map(e => e.averageRating) }],
  };

  const reviewPieData = [
    {
      name: 'Positivas',
      population: data.totalPositiveReviews,
      color: '#10b981',
      legendFontColor: '#1f2937',
      legendFontSize: 13,
    },
    {
      name: 'Negativas',
      population: data.totalNegativeReviews,
      color: '#ef4444',
      legendFontColor: '#1f2937',
      legendFontSize: 13,
    },
  ];

  const capacityPieData = [
    {
      name: 'Ocupados',
      population: data.totalCapacity - data.totalSpotsLeft,
      color: '#2563eb',
      legendFontColor: '#1f2937',
      legendFontSize: 13,
    },
    {
      name: 'Disponibles',
      population: data.totalSpotsLeft,
      color: '#10b981',
      legendFontColor: '#1f2937',
      legendFontSize: 13,
    },
  ];


  return (
    <FlatList
      style={styles.container}
      data={sortedEvents}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Estadísticas generales</Text>

          <View style={styles.gridRow}>
            <StatCard icon="calendar" label="Eventos" value={data.totalEvents} />
            <StatCard icon="people" label="Suscripciones" value={data.totalSubscriptions} />
            <StatCard icon="thumbs-up" label="Reviews positivas" value={data.totalPositiveReviews} />
            <StatCard icon="thumbs-down" label="Reviews negativas" value={data.totalNegativeReviews} />
          </View>

          <Text style={styles.subtitle}>Eventos destacados</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryItem}>
              📈 Más suscrito: {data.mostSubscribedEvent?.title ?? '---'} ({data.mostSubscribedEvent?.subscriptions} suscripciones)
            </Text>
            <Text style={styles.summaryItem}>
              📉 Menos suscrito: {data.leastSubscribedEvent?.title ?? '---'} ({data.leastSubscribedEvent?.subscriptions} suscripciones)
            </Text>
            <Text style={styles.summaryItem}>
              ⭐ Mejor puntuado: {data.bestRatedEvent?.title ?? '---'} ({data.bestRatedEvent?.averageRating?.toFixed(1)}⭐)
            </Text>
            <Text style={styles.summaryItem}>
              ❌ Peor puntuado: {data.worstRatedEvent?.title ?? '---'} ({data.worstRatedEvent?.averageRating?.toFixed(1)}⭐)
            </Text>
          </View>

          <Text style={styles.title}>Gráficos</Text>
          <Text style={styles.subtitle}>Gráfico de suscripciones por evento</Text>
          <ScrollView horizontal>
            <BarChart data={subscriptionData} width={chartWidth} height={220} chartConfig={chartConfig} yAxisLabel={''} yAxisSuffix={''} />
          </ScrollView>

          <Text style={styles.subtitle}>Distribución de reviews</Text>
          <PieChart
            data={reviewPieData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={"15"}
            absolute
          />

          <Text style={styles.subtitle}>Gráfico de calificaciones promedio</Text>
          <ScrollView horizontal>
            <BarChart
              data={ratingData}
              width={chartWidth}
              height={220}
              fromZero
              chartConfig={chartConfig}
              style={styles.chart} yAxisLabel={''} yAxisSuffix={''} />
          </ScrollView>

          <Text style={styles.subtitle}>Distribución de aforo total</Text>
          <PieChart
            data={capacityPieData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />

          <Text style={styles.title}>Eventos registrados</Text>
        </>
      }

      renderItem={({ item, index }) => (
        <View style={styles.eventRow}>
          <View style={{ maxWidth: '60%' }}>
            <Text style={styles.eventTitle} numberOfLines={1} ellipsizeMode="tail">
              {index + 1}. {item.title}
            </Text>
            <Text style={styles.eventSubtitle}>
              ⭐ {item.averageRating?.toFixed(1)} · {item.totalReviews} reviews
            </Text>
          </View>
          <Text style={styles.eventValue}>{item.subscriptions} suscripciones</Text>
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />

  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: () => '#374151',
  barPercentage: 0.6,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#111827',
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  summaryItem: {
    fontSize: 14,
    color: '#374151',
    marginVertical: 4,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  eventTitle: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    overflow: 'hidden',
  },
  eventSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  eventValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  chart: {
    borderRadius: 8,
  },
});
