import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, User, FileText } from 'lucide-react-native';

import CustomerHome from '../customer/CustomerHome';
import SearchScreen from '../customer/SearchScreen';
import WorkerProfile from '../customer/WorkerProfile';
import BookingScreen from '../customer/BookingScreen';
import ProfileScreen from '../customer/ProfileScreen';
import BookingsScreen from '../customer/BookingsScreen';
import NotificationsScreen from '../customer/NotificationsScreen';
import AllCategoriesScreen from '../customer/AllCategoriesScreen';
import AllWorkersScreen from '../customer/AllWorkersScreen';

import colors from '../utils/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomerTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') return <Home size={size} color={color} />;
          if (route.name === 'Search') return <Search size={size} color={color} />;
          if (route.name === 'Bookings') return <FileText size={size} color={color} />;
          if (route.name === 'Profile') return <User size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textLight,
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: colors.surface,
          borderTopWidth: 0, 
          elevation: 10, 
          shadowColor: '#000', 
          shadowOpacity: 0.1, 
          shadowRadius: 10, 
          height: 64 + insets.bottom, 
          paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 8,
          paddingTop: 8
        },
      })}
    >
      <Tab.Screen name="Home" component={CustomerHome} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function CustomerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={CustomerTabs} />
      <Stack.Screen name="WorkerProfile" component={WorkerProfile} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="AllCategories" component={AllCategoriesScreen} />
      <Stack.Screen name="AllWorkers" component={AllWorkersScreen} />
    </Stack.Navigator>
  );
}
