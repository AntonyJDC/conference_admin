import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import EventListScreen from '../app/events/EventListScreen';
import StatsScreen from '../app/stats/StatsScreen';
import { EditEventScreen } from '../components/events/EditEventModal';
import { CreateEventScreen } from 'components/events/CreateEventPage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="EventList"
          component={EventListScreen}
          options={{ title: 'BizEvents' }}
        />
        <Stack.Screen
          name="EditEvent"
          component={EditEventScreen}
          options={{ title: 'Editar evento' }}
        />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
