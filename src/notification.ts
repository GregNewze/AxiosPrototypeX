import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// Solicitar permissão do usuário para notificações
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Status de autorização:', authStatus);
  }
};

// Obter Token de FCM
export const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('Token de FCM:', fcmToken);
    // Aqui você pode enviar o token para o seu servidor, se necessário
  } else {
    console.log('Falha ao obter o token de FCM');
  }
};

// Configurar listeners de mensagens
export const configureNotificationListeners = () => {
  // Listener para mensagens recebidas enquanto o app está em primeiro plano
  const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    Alert.alert('Uma nova mensagem FCM chegou!', JSON.stringify(remoteMessage));
  });

  // Listener para mensagens recebidas enquanto o app está em segundo plano
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Mensagem de segundo plano', JSON.stringify(remoteMessage));
  });

  return unsubscribeOnMessage;
};