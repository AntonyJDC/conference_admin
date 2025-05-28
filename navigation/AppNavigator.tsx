import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import EventListScreen from '../app/events/EventListScreen';
import StatsScreen from '../app/stats/StatsScreen';
import { EditEventScreen } from '../components/events/EditEventModal';
import { CreateEventScreen } from 'components/events/CreateEventPage';
import EventDetailScreen from 'components/events/EventDetailScreen';
import AllReviewsScreen from 'components/Reviews/AllReviewsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'Eventos' ? 'list' : 'bar-chart';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Eventos" component={EventListScreen} />
      <Tab.Screen name="Estadísticas" component={StatsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Inicio"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditEvent"
          component={EditEventScreen}
          options={{ title: 'Editar evento' }}
        />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Crear evento' }} />
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{ title: 'Detalle del evento' }}
        />
        <Stack.Screen
          name="AllReviews"
          component={AllReviewsScreen}
          options={{ title: 'Reseñas del evento' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
