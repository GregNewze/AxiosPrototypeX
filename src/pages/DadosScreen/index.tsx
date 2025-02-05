import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { db } from "../../config/firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore"; // Importando o onSnapshot

const DadosScreen = () => {
  const [cards, setCards] = useState<any[]>([]);

  // Buscar os cards do Firestore
  const fetchCards = () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        // Usando o onSnapshot para escutar mudanças em tempo real
        const unsubscribe = onSnapshot(collection(db, "cards"), (querySnapshot) => {
          const cardsArray: any[] = [];
          querySnapshot.forEach((doc) => {
            const cardData = doc.data();
            if (cardData.userId === user.uid) {
              cardsArray.push({ ...cardData, id: doc.id });
            }
          });
          setCards(cardsArray); // Atualiza os cards sempre que a coleção mudar
        });

        // Retorna a função de unsubscribe para limpar a escuta quando o componente for desmontado
        return unsubscribe;
      } else {
        console.error("Usuário não autenticado");
      }
    } catch (e) {
      console.error("Erro ao buscar cards: ", e);
    }
  };

  useEffect(() => {
    const unsubscribe = fetchCards();

    // Cleanup para cancelar a escuta quando o componente for desmontado
    return () => unsubscribe && unsubscribe();
  }, []);

  const renderItem = (item: any) => (
    <View style={styles.card} key={item.id}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>Tipo: {item.materialType}</Text>
        
        {/* Bola verde ou vermelha e o texto */}
        <View style={styles.statusContainer}>
          <View
            style={[ 
              styles.ball, 
              item.Qntd > 0 ? { backgroundColor: "green" } : { backgroundColor: "red" }
            ]}
          />
          <Text style={styles.statusText}>
            {item.Qntd > 0 ? "Disponível" : "Indisponível"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cards.length === 0 ? (
        <Text style={styles.noDataText}>Sem dados no momento.</Text>
      ) : (
        <ScrollView
        style={styles.cardList}
          contentContainerStyle={{ paddingBottom: 70 }}
        >
          {cards.map((item) => renderItem(item))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardList:{
    marginTop:20,
    paddingHorizontal:20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
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
    fontSize: 14,
    color: "#777",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ball: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#777",
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default DadosScreen;
