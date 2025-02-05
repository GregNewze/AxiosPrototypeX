import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Image,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { db } from "../../config/firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

const Card = ({ item, onEdit, onDelete }: any) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>Tipo: {item.materialType}</Text>
        
        {/* Exibindo o ID e o Slot */}
        <Text style={styles.cardText}>ID: {item.id}</Text>
        <Text style={styles.cardText}>Slot: {item.slot}</Text>

        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.icon} onPress={() => onEdit(item)}>
            <MaterialIcons name="edit" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={() => onDelete(item.id)}>
            <MaterialIcons name="delete" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const RegistroScreen = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [slot, setSlot] = useState(""); // Estado para o número do slot
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchCards = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const cardsRef = collection(db, "cards");
      const unsubscribe = onSnapshot(cardsRef, (querySnapshot) => {
        const cardsArray: any[] = [];
        querySnapshot.forEach((doc) => {
          const cardData = doc.data();
          if (cardData.userId === user.uid) {
            cardsArray.push({ ...cardData, id: doc.id });
          }
        });
        setCards(cardsArray);
      });

      return unsubscribe;
    } else {
      console.error("Usuário não autenticado");
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const addCard = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const newCard = {
          image,
          name,
          materialType,
          slot, // Adicionando o slot
          quantity: 0, // Removendo a quantidade do novo card
          userId: user.uid,
        };

        await addDoc(collection(db, "cards"), newCard);
        setIsModalVisible(false);
        resetForm();
      } else {
        console.error("Usuário não autenticado");
      }
    } catch (e) {
      console.error("Erro ao adicionar card: ", e);
    }
  };

  const editCard = (item: any) => {
    setEditingItem(item);
    setImage(item.image);
    setName(item.name);
    setMaterialType(item.materialType);
    setSlot(item.slot); // Carregando o slot para edição
    setIsModalVisible(true);
  };

  const saveEditedCard = async () => {
    if (!editingItem) return;

    try {
      const cardRef = doc(db, "cards", editingItem.id);
      await updateDoc(cardRef, {
        image,
        name,
        materialType,
        slot, // Mantendo o slot
        quantity: editingItem.quantity, // Mantendo a quantidade existente
      });
      setIsModalVisible(false);
      setEditingItem(null);
      resetForm();
    } catch (e) {
      console.error("Erro ao editar card: ", e);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cards", id));
    } catch (e) {
      console.error("Erro ao excluir card: ", e);
    }
  };

  const handleAddPress = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const resetForm = () => {
    setImage("");
    setName("");
    setMaterialType("");
    setSlot(""); // Resetando o slot
    setEditingItem(null);
  };

  // Função para garantir que o slot seja apenas de 1 a 6
  const handleSlotChange = (text: string) => {
    const value = text.replace(/[^1-6]/g, ''); // Permitir apenas números de 1 a 6
    setSlot(value);
  };

  return (
    <View style={styles.container}>
      <ScrollView
  style={styles.cardList}
  contentContainerStyle={{
    paddingBottom: 70, // Ajuste o valor conforme necessário para o espaço extra
  }}
>
        {cards.length === 0 ? (
          <Text style={styles.noDataText}>Sem dados no momento.</Text>
        ) : (
          cards.map((item) => (
            <Card key={item.id} item={item} onEdit={editCard} onDelete={deleteCard} />
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Produto</Text>
              <TextInput
                placeholder="Nome"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo de Material</Text>
              <TextInput
                placeholder="Tipo de Material"
                value={materialType}
                onChangeText={setMaterialType}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Slot (1 a 6)</Text>
              <TextInput
                value={slot}
                onChangeText={handleSlotChange}
                keyboardType="numeric"
                maxLength={1}
                style={styles.input}
                placeholder="Digite o Slot"
              />
            </View>

            <View style={styles.container}>
              <TouchableOpacity style={styles.butaoimagem} onPress={pickImage}>
                <Text style={styles.buttonTexta}>ADICIONAR IMAGEM</Text>
              </TouchableOpacity>
              {image ? <Image source={{ uri: image }} style={styles.selectedImage} /> : null}
            </View>

            <TouchableOpacity
              onPress={editingItem ? saveEditedCard : addCard}
              style={[styles.button, styles.addButton]}
            >
              <Text style={styles.buttonText}>{editingItem ? "SALVAR EDIÇÃO" : "CRIAR CARD"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={[styles.buttonCA, styles.cancelButton]}
            >
              <Text style={styles.buttonTexto}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Seus estilos existentes aqui...
  button: {
    backgroundColor: "#081534", // Cor de fundo vibrante
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12, // Bordas arredondadas para o botão
    shadowColor: "#000", // Sombras para dar profundidade
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Sombra no Android
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: 240, // Largura ajustada para o botão
    height: 50, // Altura ajustada para o botão
  },
  addButton: {
    borderRadius: 12,
    fontWeight: "bold",
    marginTop:200
  },
  buttonTexto:{
    color: "white", // Texto branco sobre fundo escuro
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },
  buttonCA:{
    // Cor de fundo vibrante
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12, // Bordas arredondadas para o botão
    shadowColor: "#000", // Sombras para dar profundidade
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Sombra no Android
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: 240, // Largura ajustada para o botão
    height: 50, // Altura ajustada para o botão
  },
  cancelButton: {
    backgroundColor:"red",

  },
  buttonText: {
    color: "white", // Texto branco sobre fundo escuro
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },
  buttonTexta: {
    color: "black", // Texto branco
    fontSize: 10,
    fontWeight: "bold",
  },
  container: { flex: 1, backgroundColor: "#fff" },
  cardList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  butaoimagem:{
    backgroundColor: "white", // Cor de fundo vibrante
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12, // Bordas arredondadas para o botão
    shadowColor: "#000", // Sombras para dar profundidade
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Sombra no Android
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: 240, // Largura ajustada para o botão
    height: 50, // Altura ajustada para o botão
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#333",
    borderRadius: 60,
    padding: 13,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  inputLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardImage: {
    width: "35%",
    height: 135,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 8,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 12,
    color: "#777",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ball: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: "#777",
  },
  iconsContainer: {
    position: "absolute",  // Fixar no canto inferior esquerdo
    bottom: 20,  // Distância do fundo
    left: 170,    // Distância da esquerda
    flexDirection: "row", // Colocar os ícones lado a lado
    alignItems: "center",
    top:94
  },
  icon: {
    marginRight: 2, // Espaçamento entre os ícones
  },
  deleteIcon: {
    color: "red",
  },

  picker: {
    width: '100%',
    height: 70,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    
  },
});

export default RegistroScreen;
