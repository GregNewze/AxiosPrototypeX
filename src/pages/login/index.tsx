import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";  // Importando funções do Firebase Authentication
import { auth } from "../../config/firebaseConfig"; // Importando a configuração do Firebase

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Função para validar o email
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para validar a senha
  const validatePassword = (senha: string): boolean => {
    return senha.length >= 6;
  };

  // Função de login com Firebase
  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }

    if (!validatePassword(senha)) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      // Tentando fazer login com Firebase
      await signInWithEmailAndPassword(auth, email, senha);
      navigation.navigate("ColetaDeDados");  // Navegar para a próxima tela após login bem-sucedido
    } catch (error) {
      Alert.alert("Erro", "Falha no login. Verifique seu e-mail e senha.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.ellipse}></View>
      <View style={styles.ellipseSecondary}></View>
      <View style={styles.speechBubble}>
        <Text style={styles.welcomeText}>Olá, seja bem-vindo ao Axios!</Text>
      </View>

      <Text style={styles.loginText}>LOGIN</Text>

      <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Text>{showPassword ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin} // Chama a função de login com Firebase
        >
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.registerLink}>
            Não tem conta?{" "}
            <Text style={{ textDecorationLine: "underline", color: "#000" }}>
              Cadastre-se!
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    position: "relative",
  },
  ellipse: {
    position: "absolute",
    width: 930,
    height: 930,
    top: 286,
    left: -127,
    backgroundColor: "#4e4f52",
    borderRadius: 500,
    opacity: 0.1,
  },
  ellipseSecondary: {
    position: "absolute",
    width: 240,
    height: 232,
    top: -66,
    left: -74,
    backgroundColor: "#4e4f52",
    borderRadius: 160,
    opacity: 0.1,
  },
  speechBubble: {
    position: "absolute",
    top: 150,
    left: 170,
    width: "60%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  loginText: {
    top: 180,
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    marginBottom: 20,
  },
  loginContainer: {
    top: 70,
    width: "100%",
    alignItems: "center",
    marginTop: 120,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  loginButton: {
    width: "60%",
    backgroundColor: "#636363",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  registerLink: {
    top: -11,
    fontSize: 10,
    color: "#000",
    fontWeight: "bold",
  },
});

export default LoginScreen;
