import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Para ícones do MaterialIcons
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Importação das telas
import MonitoramentoScreen from "../MonitoramentoScreen";
import RegistroScreen from "../RegistroScreen";
import DataScreen from "../DadosScreen"; // Agora importa DataScreen
import HamburguerBar from "../HamburguerBar"; // Importe a tela HamburguerBar

// Tipagem de navegação
const Tab = createBottomTabNavigator();

const AppNavigator = ({ navigation }: any) => {
  const [headerTitle, setHeaderTitle] = useState("Coleta de Dados");

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;

          // Usando ícones do MaterialIcons para todas as telas
          if (route.name === "Monitoramento") {
            iconName = focused ? "camera-indoor" : "camera-outdoor"; // Câmera de segurança
          } else if (route.name === "Registro") {
            iconName = focused ? "assignment" : "assignment"; // Ícone de prancheta
          } else if (route.name === "Coleta de Dados") {
            iconName = focused ? "bar-chart" : "bar-chart"; // Gráfico com eixos
          } else {
            iconName = "error"; // Ícone padrão de erro, caso não corresponda a nenhuma tela
          }

          return (
            <MaterialIcons
              name={iconName}
              size={24} // Tamanho do ícone
              color={color} // Cor do ícone, com base na seleção
            />
          );
        },
        tabBarStyle: {
          backgroundColor: "#d3d3d3",
          borderTopWidth: 0,
          height: 55,
          borderRadius: 15,
          marginBottom: 15,
          marginHorizontal: 19,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginBottom: 5,
        },
        tabBarActiveTintColor: "black", // Cor do ícone ativo
        tabBarInactiveTintColor: "gray", // Cor do ícone inativo
      })}
    >
      <Tab.Screen
        name="Coleta de Dados"
        component={DataScreen}
        options={{
          tabBarLabel: "Coleta de Dados",
          headerShown: true,
          header: () => (
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('HamburguerBar')} // Navega para a tela HamburguerBar
                style={styles.hamburgerBar} // Estilo do botão hamburger
              >
                <MaterialIcons name="menu" size={30} color="black" />
              </TouchableOpacity>
              <Text style={styles.title}>{headerTitle}</Text> {/* Título abaixo do hamburger */}
              <Image
                source={require("../../assets/logo.png")} // Logo centralizada
                style={styles.logo}
              />
              {/* Linha cinza com curva no canto direito, bem na borda do header */}
              <View style={styles.bottomLine}></View>
              <MaterialIcons
                name="poll" // Ícone relacionado à coleta de dados
                size={24}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            setHeaderTitle("COLETA DE DADOS"); // Atualiza o título quando a aba for pressionada
          },
        })}
      />
      <Tab.Screen
        name="Monitoramento"
        component={MonitoramentoScreen}
        options={{
          tabBarLabel: "Monitoramento",
          headerShown: true,
          header: () => (
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('HamburguerBar')} // Navega para a tela HamburguerBar
                style={styles.hamburgerBar} // Estilo do botão hamburger
              >
                <MaterialIcons name="menu" size={30} color="black" />
              </TouchableOpacity>
              <Text style={styles.title}>{headerTitle}</Text> {/* Título abaixo do hamburger */}
              <Image
                source={require("../../assets/logo.png")} // Logo centralizada
                style={styles.logo}
              />
              {/* Linha cinza com curva no canto direito, bem na borda do header */}
              <View style={styles.bottomLine}></View>
              <MaterialIcons
                name="filter-alt" // Ícone relacionado ao monitoramento
                size={24}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            setHeaderTitle("MONITORAMENTO"); // Atualiza o título quando a aba for pressionada
          },
        })}
      />
      <Tab.Screen
        name="Registro"
        component={RegistroScreen}
        options={{
          tabBarLabel: "Registro",
          headerShown: true,
          header: () => (
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('HamburguerBar')} // Navega para a tela HamburguerBar
                style={styles.hamburgerBar} // Estilo do botão hamburger
              >
                <MaterialIcons name="menu" size={30} color="black" />
              </TouchableOpacity>
              <Text style={styles.title}>{headerTitle}</Text> {/* Título abaixo do hamburger */}
              <Image
                source={require("../../assets/logo.png")} // Logo centralizada
                style={styles.logo}
              />
              {/* Linha cinza com curva no canto direito, bem na borda do header */}
              <View style={styles.bottomLine}></View>
              <MaterialIcons
                name="add-box" // Ícone relacionado ao monitoramento
                size={24}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            setHeaderTitle("REGISTRAR ITENS"); // Atualiza o título quando a aba for pressionada
          },
        })}
      />
    </Tab.Navigator>
  );
};

// Estilos
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row", // Organiza os elementos em linha
    alignItems: "center", // Alinha os itens no centro verticalmente
    justifyContent: "space-between", // Cria espaço entre o título e o ícone
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 25,
    paddingHorizontal: 18,
    position: "relative", // Permite que a linha fique na borda
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginTop: 90,
    marginLeft: 1, // Ajuste da posição do título
  },
  hamburgerBar: {
    position: "absolute", // Mantém o hamburger fixo no topo esquerdo
    top: 60,
    left: 5,
    padding: 10,
  },
  logo: {
    width: 140, // Tamanho da logo
    height: 80, // Tamanho da logo
    resizeMode: "contain", // Garante que a logo se ajuste ao espaço
    position: "absolute", // A logo ficará no centro do cabeçalho
    top: 40, // Ajuste de posicionamento vertical
    left: "50%", // Centraliza horizontalmente
    marginLeft: -53, // Ajuste para centralizar perfeitamente
  },
  bottomLine: {
    position: "absolute", // Linha fica fixada no fundo do cabeçalho
    bottom: 0, // Alinha na borda inferior
    width: "120%", // A linha ocupa toda a largura
    height: 5, // Altura da linha
    backgroundColor: "#3D3D3D", // Cor da linha
    borderTopRightRadius: 50, // Aplica a curva no canto direito
    borderTopLeftRadius: 0, // Garante que o canto esquerdo fique reto
  },
  rightIcon: {
    marginRight: 10,
    marginTop: 90,
    color: "#3D3D3D", // Coloca um espaço à direita do ícone
  },
});

export default AppNavigator;
