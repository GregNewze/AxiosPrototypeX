import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { db } from "../../config/firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { ScrollView } from 'react-native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const MonitoramentoScreen = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [slotData, setSlotData] = useState<Record<string, { Peso: number | null; Qntd: number | null }>>({});
  const [progress] = useState(new Animated.Value(0));

  // Função para determinar status com base na quantidade
  const getStatus = (quantity: number | null) => {
    if (quantity === null) {
      return { label: "Carregando...", color: "gray" };
    } else if (quantity > 10) {
      return { label: "Disponível", color: "green" };
    } else if (quantity > 5) {
      return { label: "Intermediário", color: "#3d3d3d" };
    } else if (quantity > 0) {
      return { label: "Baixa", color: "orange" };
    } else {
      return { label: "Indisponível", color: "red" };
    }
  };

  const fetchCards = useCallback(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const unsubscribe = onSnapshot(collection(db, "cards"), (querySnapshot) => {
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
  }, []);

  const fetchSlotData = (cardId: string, slot: string) => {
    console.log(`Consultando dados para o slot: ${slot}`);

    const unsubscribe = onSnapshot(doc(db, "Balanças", slot), (docSnap) => {
      if (docSnap.exists()) {
        const { Peso, Qntd } = docSnap.data();
        setSlotData((prev) => ({
          ...prev,
          [cardId]: { Peso, Qntd },
        }));
      } else {
        console.error(`Documento para o slot ${slot} não encontrado!`);
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribeCards = fetchCards();

    return () => {
      unsubscribeCards && unsubscribeCards();
    };
  }, [fetchCards]);

  useEffect(() => {
    if (expandedCardId && slotData[expandedCardId]?.Peso !== null) {
      Animated.timing(progress, {
        toValue: (slotData[expandedCardId]?.Peso || 0) / 1000, // Ajuste conforme necessário
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [slotData, expandedCardId]);

  const handleCardPress = async (cardId: string, slot: string) => {
    if (expandedCardId === cardId) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(cardId);
      fetchSlotData(cardId, slot); // Passa o cardId e slot
    }
  };

  const renderItem = ({ item }: any) => {
    const isExpanded = expandedCardId === item.id;
    const currentSlotData = slotData[item.id] || { Peso: null, Qntd: null };
    const { label, color } = getStatus(currentSlotData.Qntd);

    return (
      <TouchableOpacity
        style={[styles.card, isExpanded && styles.expandedCard]}
        onPress={() => handleCardPress(item.id, item.slot)}
      >
        <Image
          source={{
            uri: item.image || "https://example.com/default-image.jpg",
          }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardText}>Tipo: {item.materialType}</Text>
          <Text style={styles.expandedTexta}>
            Quantidade Atual: {currentSlotData.Qntd !== null ? currentSlotData.Qntd : "Carregando..."}
          </Text>
          <Text style={styles.cardText}>ID: {item.id}</Text>
          <Text style={styles.cardText}>Slot: {item.slot}</Text>

          <View style={styles.statusContainer}>
            <View style={[styles.ball, { backgroundColor: color }]} />
            <Text style={styles.statusText}>{label}</Text>
          </View>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedText}>
                Peso Atual: {currentSlotData.Peso !== null ? currentSlotData.Peso : "Carregando..."}g
              </Text>
              <Text style={styles.expandedText}>
                Quantidade Atual: {currentSlotData.Qntd !== null ? currentSlotData.Qntd : "Carregando..."}
              </Text>

              {currentSlotData.Peso !== null ? (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>Progressão:</Text>
                  <View style={styles.progressBarBackground}>
                    <Animated.View
                      style={[styles.progressBar, {
                        width: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      }]}
                    />
                  </View>
                </View>
              ) : (
                <Text>Carregando gráfico...</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {cards.length === 0 ? (
        <Text style={styles.noDataText}>Sem dados no momento.</Text>
      ) : (
        <ScrollView
          style={styles.cardList} // Aplica a margem horizontal ao ScrollView
          contentContainerStyle={{
            paddingBottom: 70, // Ajuste o valor conforme necessário para o espaço extra
          }}
        >
          {cards.map((item) => renderItem({ item }))}
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
    overflow: "hidden",
  },
  expandedCard: {
    backgroundColor: "#f5f5f5",
  },
  cardImage: {
    width: width * 0.38,  // A imagem ocupa 38% da largura da tela
    height: width * 0.38 * (130 / 120),
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 8,
    zIndex: 1, // Garantir que a imagem não cubra o conteúdo

  },
  cardContent: {
    flex: 1,
    padding: 9,
    zIndex: 2, // Garantir que o conteúdo do cartão fique acima da imagem

  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 11,
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
  expandedContent: {
    marginTop: 5,
  },
  expandedText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 0,
    left:-150,
    top:11
  },
  expandedTexto: {
    fontSize: 13,
    color: "#777",
    marginBottom: 0,
  },
  expandedTexta: {
    fontSize: 12,
    color: "#777",
    marginBottom: 0,
  },
  progressContainer: {
    marginTop: 1,
    marginLeft: -40, // Aumentando o valor para mover mais para a esquerda
  },
  
  progressText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginVertical: 11,
    marginHorizontal:-110,
    textAlign: "left", // Garantindo que o texto fique alinhado à esquerda
  },
  
  progressBarBackground: {
    width: "70%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginLeft: -110, // Aumentando o valor para mover mais para a esquerda
  },
  
  progressBar: {
    height: "100%",
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MonitoramentoScreen;
