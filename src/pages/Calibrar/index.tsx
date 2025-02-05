import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

type RootStackParamList = {
  Calibrar: undefined;
  Login: undefined;
};

type CalibrarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calibrar'>;

interface Props {
  navigation: CalibrarScreenNavigationProp;
}

const CalibrarScreen: React.FC<Props> = ({ navigation }) => {
  const [pesoData, setPesoData] = useState<string | null>(null);
  const [qntdData, setQntdData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (authUser) => {
      if (!authUser) {
        Alert.alert('Erro', 'Você precisa estar logado para acessar esta tela');
        navigation.navigate('Login');
      }
    });

    return () => unsubscribeAuth();
  }, [navigation]);

  useEffect(() => {
    const unsubscribeFirestore = onSnapshot(doc(db, 'Balança', 'PesoAtual'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPesoData(data?.Peso || 'Não disponível');
        setQntdData(data?.Qntd || 'Não disponível');
      } else {
        Alert.alert('Erro', 'Documento não encontrado!');
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao escutar dados do Firestore:", error);
      Alert.alert('Erro', 'Não foi possível escutar os dados do Firestore.');
      setLoading(false);
    });

    return () => unsubscribeFirestore();
  }, []);

  return (
    <View style={styles.container}>
      {/* Ícone de Voltar no canto superior esquerdo */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={40} color="#2196F3" />
      </TouchableOpacity>

      <Text style={styles.title}>Tela de Calibração</Text>
      <Text style={styles.subtitle}>Dados do Firestore:</Text>

      {loading ? (
        <>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </>
      ) : (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Peso Atual: {pesoData}</Text>
          <Text style={styles.dataText}>Quantidade Atual: {qntdData}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    left: 19,
    top: 61,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    marginVertical: 20,
    fontSize: 18,
    color: '#666',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  dataContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  dataText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 5,
  },
});

export default CalibrarScreen;