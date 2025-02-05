import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Definição das propriedades do Menu
interface MenuProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

const HamburgerMenu: React.FC<MenuProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Função para mostrar o modal de confirmação de logout
  const handleLogout = () => {
    setModalVisible(true);
  };

  // Função para deslogar e sair do app (após confirmação)
  const confirmLogout = () => {
    setModalVisible(false);
    // Adicione a lógica de logout aqui
    alert("Você foi deslogado!");
    navigation.navigate("Login");
  };

  // Função para cancelar logout
  const cancelLogout = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Ícone de voltar fixo no canto superior esquerdo */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="chevron-left" size={40} color="#3D3D3D" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        {/* Opções de menu */}
        <MenuOption 
          icon="account-circle" 
          text="Perfil" 
          onPress={() => navigation.navigate("Perfil")} 
        />
        <MenuOption 
          icon="tune" 
          text="Calibrar" 
          onPress={() => navigation.navigate("Calibrar")} 
        />
        <MenuOption 
          icon="info" 
          text="Sobre" 
          onPress={() => navigation.navigate("Sobre")} 
          textStyle={styles.highlightedText}
        />
        <MenuOption 
          icon="exit-to-app" 
          text="Logout" 
          textStyle={styles.logoutText}
          onPress={handleLogout} 
        />

        {/* Logo abaixo das opções */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
        </View>
      </ScrollView>

      {/* Modal de confirmação de logout */}
      <LogoutModal 
        visible={modalVisible} 
        onCancel={cancelLogout} 
        onConfirm={confirmLogout} 
      />
    </View>
  );
};

interface MenuOptionProps {
  icon: keyof typeof MaterialIcons.glyphMap; // Chaves válidas para MaterialIcons
  text: string;
  onPress: () => void;
  textStyle?: object;
}

const MenuOption: React.FC<MenuOptionProps> = ({ icon, text, onPress, textStyle }) => (
  <View style={styles.menuItem}>
    <MaterialIcons name={icon} size={30} color="black" />
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.menuText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  </View>
);

interface LogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onCancel, onConfirm }) => (
  <Modal
    transparent={true}
    animationType="fade"
    visible={visible}
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Você tem certeza que deseja sair?</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity onPress={onCancel} style={styles.modalButtonCancel}>
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} style={styles.modalButtonConfirm}>
            <Text style={styles.modalButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "transparent",
  },
  menuContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  highlightedText: {
    color: "#007BFF", // Azul claro para o texto "Sobre"
  },
  logoutText: {
    color: "red",
  },
  logoContainer: {
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButtonCancel: {
    backgroundColor: "#777",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  modalButtonConfirm: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default HamburgerMenu;