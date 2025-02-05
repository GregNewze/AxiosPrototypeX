import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Ícone de editar
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Ícone de voltar
import { getAuth } from "firebase/auth"; // Importando o Firebase Auth
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions
import * as ImagePicker from "expo-image-picker"; // Biblioteca do Expo para pegar imagens
import { useNavigation } from "@react-navigation/native"; // Para navegação

const PerfilScreen: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState(""); // Restaurando o campo de senha
  const [isEditing, setIsEditing] = useState(false);
  const [newUserName, setNewUserName] = useState(userName);
  const [newBio, setNewBio] = useState(bio);

  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation(); // Navegação

  // Função para abrir a galeria e selecionar a imagem
  const handleProfileImagePress = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setProfileImage(selectedImage); // Atualiza a imagem de perfil
        saveProfileImage(selectedImage); // Salva a imagem no Firestore
      }
    } else {
      alert("Permissão de acesso à galeria negada!");
    }
  };

  // Função para salvar a imagem no Firestore
  const saveProfileImage = async (imageUri: string) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "usuarios", user.uid);
      try {
        await setDoc(
          userRef,
          {
            imagem: imageUri, // Salva a imagem no Firestore
          },
          { merge: true }
        );
        alert("Imagem de Perfil Atualizada.");
      } catch (error) {
        console.error("Erro ao salvar imagem: ", error);
        alert("Erro ao salvar imagem!");
      }
    }
  };

  // Pega o usuário logado e carrega os dados de Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      loadUserData(user.uid); // Carregar os dados do Firestore ao inicializar a tela
    }
  }, []);

  // Função para carregar os dados do usuário
  const loadUserData = async (userId: string) => {
    const docRef = doc(db, "usuarios", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setUserName(userData.nome || "");
      setBio(userData.biografia || "");
      setProfileImage(userData.imagem || null); // Carregar imagem
    }
  };

  // Função para ativar/desativar o modo de edição
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setNewUserName(userName);
      setNewBio(bio);
    } else {
      setUserName(newUserName);
      setBio(newBio);
      saveUserData(); // Salva os dados no Firestore quando terminar a edição
    }
  };

  // Função para salvar os dados no Firestore
  const saveUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "usuarios", user.uid);
      try {
        await setDoc(
          userRef,
          {
            nome: newUserName,
            biografia: newBio,
            senha: password, // Salvar a senha também
            imagem: profileImage, // Salvar imagem
          },
          { merge: true }
        );
        alert("Dados salvos com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar dados: ", error);
        alert("Erro ao salvar dados!");
      }
    }
  };

  // Função de navegação para voltar
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
      >
        <Icon name="chevron-left" size={40} color="#3D3D3D" />
      </TouchableOpacity>

      <View style={styles.profileSection}>
  {/* Imagem de perfil sem interação */}
  
  <Image
    style={styles.profileImage}
    source={
      profileImage
        ? { uri: profileImage }
        : { uri: "https://via.placeholder.com/150" }
    }
  />
  <Text style={styles.userName}>{userName}</Text>
  {bio && <Text style={styles.bio}>{bio}</Text>}

  {/* Ícone para editar imagem de perfil */}
  <TouchableOpacity
    onPress={handleProfileImagePress} // Ação ao clicar no ícone de câmera
    style={styles.editImageIcon}
  >
    <Ionicons name="camera" size={20} color="white" />
  </TouchableOpacity>
</View>

      {/* Se estiver no modo de edição, mostrar campos de input */}
      {isEditing && (
        <View style={styles.editContainer}>
          <Text style={styles.inputLabel}>Nome do Usuário:</Text>
          <TextInput
            style={styles.input}
            value={newUserName}
            onChangeText={setNewUserName}
            placeholder="Novo nome"
          />

          <Text style={styles.inputLabel}>Biografia:</Text>
          <TextInput
            style={styles.input}
            value={newBio}
            onChangeText={setNewBio}
            placeholder="Escreva sua biografia"
            multiline
          />
        </View>
      )}

      {/* Botão para editar ou salvar */}
      <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
        <Ionicons name="create" size={20} color="white" />
        <Text style={styles.editButtonText}>
          {isEditing ? "Salvar" : "Editar Perfil"}
        </Text>
      </TouchableOpacity>

      {/* Seção de informações */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Email</Text>
        <Text style={styles.infoInput}>{auth.currentUser?.email}</Text>
      </View>

      {/* Botão para alterar dados */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Alterar Dados</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Cor mais suave de fundo
    padding: 50,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "transparent",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 35,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 90,
    backgroundColor: "#777", // Cor de fundo cinza claro
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#777", // Cor da borda em tom de cinza
    shadowColor: "black", // Cor da sombra
    shadowOffset: { width: 0, height: 4 }, // Deslocamento da sombra
    shadowOpacity: 0.1, // Opacidade da sombra
    shadowRadius: 8, // Raio de desfoque da sombra
    elevation: 5, // Elevação para sombra em dispositivos Android
  },
  editImageIcon: {
    position: "absolute",
    bottom: 115, // Ajuste de posicionamento
    right: 75, // Ajuste de posicionamento
    backgroundColor: "#333", // Cor escura para o ícone
    borderRadius: 20,
    padding: 5,
    elevation: 3,
  
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
    fontStyle: "italic",
    textAlign: "center",
  },
  editContainer: {
    width: "90%",
    marginVertical: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    fontSize: 16,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 0,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  editButtonText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
  infoSection: {
    width: "90%",
    marginBottom: 25,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  infoInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    color: "#555",
  },
  button: {
    backgroundColor: "#F1F1F1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});

export default PerfilScreen;
