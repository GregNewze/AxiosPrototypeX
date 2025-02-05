import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const SobreScreen: React.FC = ({ navigation }: any) => {
  const openInstagram = () => {
    Linking.openURL("https://www.instagram.com/projetoaxios?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botão de Voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="chevron-left" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>Projeto Axios</Text>

        {/* Descrição */}
        <View style={styles.textContainer}>
          <Text style={styles.description}>
            O <Text style={styles.highlight}>Projeto Axios</Text> é um sistema automatizado de{" "}
            <Text style={styles.highlight}>gestão de estoque</Text> desenvolvido especialmente para laboratórios educacionais.
          </Text>
          <Text style={styles.description}>
            Utilizando a tecnologia <Text style={styles.highlight}>IoT</Text>, o sistema monitora e otimiza o uso de materiais.
          </Text>
          <Text style={styles.description}>
            O objetivo é <Text style={styles.highlight}>reduzir desperdícios</Text>,{" "}
            <Text style={styles.highlight}>melhorar a eficiência</Text> e garantir a{" "}
            <Text style={styles.highlight}>disponibilidade de recursos</Text>.
          </Text>
          <Text style={styles.description}>
            Acesso rápido e prático via app móvel, trazendo informações essenciais ao seu alcance.
          </Text>
          
          {/* Link do Instagram */}
          <TouchableOpacity style={styles.instagramLink} onPress={openInstagram}>
            <AntDesign name="instagram" size={30} color="#E1306C" />
            <Text style={styles.instagramText}>@projetoaxios</Text>
          </TouchableOpacity>

          {/* Criadores do Projeto */}
          <Text style={styles.description}>Criadores:</Text>
          <Text style={styles.creator}>Érico Nunes</Text>
          <Text style={styles.creator}>Gabriel Pedro Sarges</Text>
          <Text style={styles.creator}>Kil Anne Rodrigues</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f9",
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 50,
  },
  content: {
    marginTop: 80,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  textContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    color: "#555",
    marginBottom: 15,
    textAlign: "justify",
  },
  highlight: {
    color: "#007BFF",
    fontWeight: "600",
  },
  instagramLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  instagramText: {
    fontSize: 18,
    color: "#E1306C",
    fontWeight: "600",
    marginLeft: 10,
  },
  creator: {
    fontSize: 18,
    lineHeight: 28,
    color: "#555",
    marginBottom: 10,
    textAlign: "justify",
    fontWeight: "bold",
  },
});

export default SobreScreen;