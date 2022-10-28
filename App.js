import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";

/**
 * Lembrar dos 3 passos:
 *  1) Obter o token (função pronta)
 *  2) Enviar a notificação: pode ser local ou remota
 *  3) Responder à notificação
 */

/**
 * Configurações gerais:
 * - O que fazer quando chega uma notificação? exibir um alerta? um som? etc.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Componente principal App
 */
export default function App() {
  /**
   * Estado da aplicação (state)
   */
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  /**
   * Referências aos objetos "ouvintes" (listeners)
   */
  const notificationListener = useRef();
  const responseListener = useRef();

  /**
   * Efeito colateral, lembra do ciclo de vida da aplicação? componentDidMount?
   * useEffect é a forma "hook" de fazer isso =)
   */
  useEffect(() => {
   
    //Terceiro passo (avisar a aplicação que chegou uma nova notificação)
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification); //armazenar a notificação no estado (state)
      }
    );
    //Terceiro passo (evento executado quando o usuário clica na notificação)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    /**
     * Descadastrar-se (parar de ouvir) do sistema de notificações.
     * Lembra-se do "fim" do ciclo de vida (quando o componente vai ser removido)? componentWillUnmount?
     * O retorno do hook useEffect é uma função (lambda) responsável pela limpeza/encerramento
     * de serviços.
     * */
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  /**
   * Renderização (padrão do react/jsx)
   */
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <Text>Your expo push token: {expoPushToken}</Text>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>

      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification(); //Segundo Passo: lançar a notificação (local)
        }}
      />

    </View>
  );
}

/**
 * Passo 2: LOCAL (o próprio App dispara a notificação)
 */
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    //O que enviar junto com a notificação? título, mensagem (body), etc.
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 }, //quanto tempo esperar antes de lançar a notificação?
  });
}

/**
 * Passo 2: REMOTO (a notificação é disparada por um agente externo, via Push)
 */
// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
async function sendPushNotification(expoPushToken) {
  /**
   * Isso é o que importa: o que você quer mandar para a notificação? título, mensagem, som, etc.
   */
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Remoto via fetch",
    body: "And here is the body!",
    data: { data: "goes here" },
  };

  /**
   * Não se preocupe com isso ainda.. vamos aprender sobre APIs na aula sobre REST =)
   */
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
