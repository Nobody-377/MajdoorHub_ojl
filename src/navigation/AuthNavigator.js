import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../auth/Splash';
import Onboarding from '../auth/Onboarding';
import OTPLogin from '../auth/OTPLogin';
import SignupQuestions from '../auth/SignupQuestions';
import RoleSelection from '../auth/RoleSelection';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="OTPLogin" component={OTPLogin} />
      <Stack.Screen name="SignupQuestions" component={SignupQuestions} />
      <Stack.Screen name="RoleSelection" component={RoleSelection} />
    </Stack.Navigator>
  );
}
