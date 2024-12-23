import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Importa o Firebase Auth

const CadastroScreen: React.FC = () => {
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleCadastro = () => {
    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        // Cadastro bem-sucedido
        const user = userCredential.user;
        console.log("Usuário registrado com sucesso:", user);

        // Navegar para a tela de coleta de dados após cadastro
        navigation.navigate("ColetaDeDados");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert("Erro", "Este e-mail já está em uso. Tente outro e-mail.");
        } else {
          Alert.alert("Erro", errorMessage);
        }

        console.error("Erro de cadastro:", errorCode, errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.ellipse}></View>
      <View style={styles.ellipseSecondary}></View>
      <View style={styles.speechBubble}>
        <Text style={styles.welcomeText}>Faça seu cadastro para acessar o Axios!</Text>
      </View>
      <Text style={styles.cadastroText}>CADASTRO</Text>

      <View style={styles.cadastroContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.cadastroButton} onPress={handleCadastro}>
          <Text style={styles.cadastroButtonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>
            Já tem uma conta?{" "}
            <Text style={{ textDecorationLine: "underline", color: "#000" }}>
              Faça login!
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
  cadastroText: {
    top: 215,
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    marginBottom: 20,
  },
  cadastroContainer: {
    top: 90,
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
  cadastroButton: {
    width: "60%",
    backgroundColor: "#636363",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  cadastroButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  loginLink: {
    top: -11,
    fontSize: 10,
    color: "#000",
    fontWeight: "bold",
  },
});

export default CadastroScreen;
