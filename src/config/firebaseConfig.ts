import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; // Para usar o Firebase Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase com os dados que você forneceu
const firebaseConfig = {
  apiKey: "AIzaSyAPXGbkh81a8o5MmYJoquO-Q3uinRO-JWg",  // API Key
  authDomain: "axiosprototipo.firebaseapp.com", // Substitua com seu domínio de autenticação
  projectId: "axiosprototipo", // Project ID
  storageBucket: "axiosprototipo.appspot.com", // Storage Bucket
  messagingSenderId: "590409890798", // Sender ID
  appId: "1:590409890798:android:72b8c9ff3060dcc8272cff", 
};

// Inicializa o Firebase apenas se ainda não foi inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa o Firebase Auth com persistência de sessão
const auth = getAuth(app);

// Obtenha instâncias dos serviços que você usará
const db = getFirestore(app);
const storage = getStorage(app); // Instância do Firebase Storage

export { auth, db, storage, app, firebaseConfig };