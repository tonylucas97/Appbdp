import React from "react"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
const Stack = createStackNavigator();

import Login from "./components/Login/Login";
import Resumo from "./components/Resumo/Resumo";
import LogedNavigator from "./components/LogedNavigator/LogedNavigator";
import NovaMercadoria from "./components/Mercadoria/NovaMercadoria";
import DetalheMercadoria from "./components/Mercadoria/DetalheMercadoria";
import NomeClienteVenda from "./components/Venda/NomeClienteVenda";
import CarrinhoVenda from "./components/Venda/CarrinhoVenda";
import FinalizarVenda from "./components/Venda/FinalizarVenda";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="LogedNavigator" component={LogedNavigator} />
          <Stack.Screen name="NovaMercadoria" component={NovaMercadoria} />
          <Stack.Screen name="DetalheMercadoria" component={DetalheMercadoria} />
          <Stack.Screen name="NomeClienteVenda" component={NomeClienteVenda} />
          <Stack.Screen name="CarrinhoVenda" component={CarrinhoVenda} />
          <Stack.Screen name="FinalizarVenda" component={FinalizarVenda} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}