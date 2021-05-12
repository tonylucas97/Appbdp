import React from "react"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
const Stack = createStackNavigator();

import Login from "./components/Login/Login";
import Resumo from "./components/Resumo/Resumo";
import LogedNavigator from "./components/LogedNavigator/LogedNavigator";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="LogedNavigator" component={LogedNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}