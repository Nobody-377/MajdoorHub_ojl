import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Briefcase, IndianRupee, User } from 'lucide-react-native';

import WorkerDashboard from '../worker/WorkerDashboard';
import JobRequests from '../worker/JobRequest';
import ActiveJob from '../worker/ActiveJob';
import WorkerProfile from '../worker/WorkerProfileEdit';
import NotificationsScreen from '../customer/NotificationsScreen';

import colors from '../utils/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function WorkerTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Dashboard') return <Home size={size} color={color} />;
          if (route.name === 'Jobs') return <Briefcase size={size} color={color} />;
          if (route.name === 'Earnings') return <IndianRupee size={size} color={color} />;
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
      <Tab.Screen name="Dashboard" component={WorkerDashboard} />
      <Tab.Screen name="Jobs" component={JobRequests} />
      <Tab.Screen name="Earnings" component={WorkerDashboard} /> 
      <Tab.Screen name="Profile" component={WorkerProfile} />
    </Tab.Navigator>
  );
}

export default function WorkerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={WorkerTabs} />
      <Stack.Screen name="ActiveJob" component={ActiveJob} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
