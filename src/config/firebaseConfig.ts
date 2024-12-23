// src/config/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; // Para usar o Firebase Storage

// Configuração do Firebase com os dados que você forneceu
const firebaseConfig = {
  apiKey: "AIzaSyAPXGbkh81a8o5MmYJoquO-Q3uinRO-JWg",  // API Key
  authDomain: "axiosprototipo.firebaseapp.com", // Substitua com seu domínio de autenticação
  projectId: "axiosprototipo", // Project ID
  storageBucket: "axiosprototipo.appspot.com", // Storage Bucket
  messagingSenderId: "590409890798", // Sender ID
  appId: "1:590409890798:android:72b8c9ff3060dcc8272cff", // App ID
  measurementId: "G-XXXXXX" // Measurement ID (se necessário, caso esteja usando o Google Analytics)
};

// Inicializa o Firebase com a configuração
const app = initializeApp(firebaseConfig);

// Obtenha instâncias dos serviços que você usará
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Instância do Firebase Storage

export { auth, db, storage };
