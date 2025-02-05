import 'react-native-gesture-handler'; // Isso deve ser a primeira importação
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Animated, Easing } from 'react-native'; // Importando Easing diretamente de react-native

// Suas telas e componentes...
import LoginScreen from './src/pages/login';
import CadastroScreen from './src/pages/Cadastro';
import LoadingScreen from './src/pages/LoadingScreen';
import ColetaDeDados from './src/pages/ColetaDeDados';
import HamburguerBar from './src/pages/HamburguerBar';  // Tela onde o botão hamburguer estará
import PerfilScreen from './src/pages/Perfil/index';  // Tela de perfil
import CalibrarScreen from './src/pages/Calibrar/index';  // Tela de calibrar
import SobreScreen from './src/pages/Sobre/index';  // Tela de sobre
import { requestUserPermission, configureNotificationListeners } from './src/notification';

const Stack = createNativeStackNavigator();

// Definindo os tipos corretamente para cardStyleInterpolator
type TransitionProps = {
  current: { progress: Animated.AnimatedInterpolation<number> };
  next: { progress: Animated.AnimatedInterpolation<number> };
  layouts: { screen: { width: number } };
};

// Função personalizada para animação
const CustomTransition = {
  cardStyleInterpolator: ({ current, next, layouts }: TransitionProps) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0], // Tela começa fora à direita e vai até a posição central
    });

    return {
      cardStyle: {
        transform: [{ translateX }], // Aplica a transformação de deslocamento para a animação de slide
      },
    };
  },
  // Configuração para a transição ser mais lenta
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 1000, // A transição vai durar 1000ms (1 segundo)
        easing: Easing.out(Easing.ease), // Efeito suave na transição
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 1000, // Duração igual para o fechamento
        easing: Easing.out(Easing.ease),
      },
    },
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
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
          component={ColetaDeDados}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HamburguerBar"
          component={HamburguerBar}
          options={{
            headerShown: false,
            ...CustomTransition, // Aplicando a animação personalizada
          }}
        />
        <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Calibrar"
          component={CalibrarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sobre"
          component={SobreScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
