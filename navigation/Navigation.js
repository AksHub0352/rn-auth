
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SubmitDataScreen from '../screens/SubmitDataScreen';
import RetrieveDataScreen from '../screens/RetrieveDataScreen';

const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FormSubmit" component={SubmitDataScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RetrieveData" component={RetrieveDataScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default Navigation;
