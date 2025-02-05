import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Animated } from "react-native";
import Logo from '../../assets/logo.png'; // Imagem do logo
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const LoadingScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [opacity] = useState(new Animated.Value(0)); // Estado para controle de opacidade

  useEffect(() => {
    // Animação de opacidade
    Animated.timing(opacity, {
      toValue: 1, // Valor final da opacidade
      duration: 2000, // Duração da animação (2 segundos)
      useNativeDriver: true,
    }).start();

    // Verificar o estado de autenticação
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Usuário está logado
        navigation.navigate('ColetaDeDados');
      } else {
        // Usuário não está logado
        setLoading(false); // Mostrar botão de iniciar
      }
    });

    return () => {
      unsubscribeAuth(); // Limpa o listener de autenticação
    };
  }, [navigation, opacity]);

  const handleNavigate = () => {
    navigation.navigate("Login"); // Navegar para a tela de login
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={Logo}
        style={[styles.logo, { opacity }]} // Aplica a animação de opacidade na logo
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleNavigate}>
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Fundo branco
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginBottom: 0,
  },
  loader: {
    marginBottom: 20, // Espaço para o loader
  },
  button: {
    borderWidth: 1,
    borderColor: "black", // Cor do contorno
    borderRadius: 25, // Bordas arredondadas
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#000", // Fundo do botão
    marginTop: -60,
  },
  buttonText: {
    fontSize: 14,
    color: "white", // Cor do texto
  },
});

export default LoadingScreen;