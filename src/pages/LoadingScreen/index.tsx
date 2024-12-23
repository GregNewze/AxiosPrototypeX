import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Logo from '../../assets/logo.png'
import { style } from "./style";

const LoadingScreen = ({ navigation }: any) => {
  const handleNavigate = () => {
    navigation.navigate("Login"); // Navegar para a tela de login
  };

  return (
    <View style={styles.container}>
        <Image
        source={Logo}
        style={style.logo}
        />
      <TouchableOpacity style={styles.button} onPress={handleNavigate}>
        <Text style={styles.buttonText}>Prosseguir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Fundo branco
  },
  button: {
    borderWidth: 1,
    borderColor: "black", // Cor do contorno
    borderRadius: 25, // Bordas arredondadas
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 14,
    color: "black", // Cor do texto
  },
});

export default LoadingScreen;
