import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import useStore from '../store/useStore';

import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import WorkerNavigator from './WorkerNavigator';

export default function AppNavigator() {
  const { isAuthenticated, role } = useStore();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : role === 'worker' ? (
        <WorkerNavigator />
      ) : (
        <CustomerNavigator />
      )}
    </NavigationContainer>
  );
}
