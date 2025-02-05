// src/services/cardService.ts
import { db } from "../config/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Função para obter todos os cards do usuário
export const getCards = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return [];

  const querySnapshot = await getDocs(collection(db, "cards"));
  const cards: any[] = [];
  
  querySnapshot.forEach((docSnap) => {
    const cardData = docSnap.data();
    if (cardData.userId === user.uid) {
      cards.push({ ...cardData, id: docSnap.id });
    }
  });
  
  return cards;
};

// Função para adicionar um novo card
export const addCard = async (newCard: any) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "cards"), { ...newCard, userId: user.uid });
};

// Função para editar um card
export const updateCard = async (id: string, updatedCard: any) => {
  const cardRef = doc(db, "cards", id);
  await updateDoc(cardRef, updatedCard);
};

// Função para excluir um card
export const deleteCard = async (id: string) => {
  const cardRef = doc(db, "cards", id);
  await deleteDoc(cardRef);
};
