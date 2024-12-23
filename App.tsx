import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/pages/login";
import CadastroScreen from "./src/pages/Cadastro";
import ColetaDeDadosScreen from "./src/pages/coletadedados"; // Tela de Coleta de Dados
import LoadingScreen from "./src/pages/LoadingScreen"; // Importe a tela de Loading

import { RootStackParamList } from "./src/pages/types"; // Caminho correto para o arquivo types

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          component={LoadingScreen} // Tela de Loading
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ColetaDeDados"
          component={ColetaDeDadosScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
