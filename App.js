import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native-ui-lib";

import Notificacao from './src/pages/Notificacao'

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
      <Text green10 text30 style={{ alignItems: "center", justifyContent: "center" }}>
        Sistema de Notificações
      </Text>

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
        label="Enviar Notificação"
        text50
        onPress={async () => {
          await schedulePushNotification(); //Segundo Passo: lançar a notificação (local)
        }}
      />

      <Button
        text50
        label='Listagem'
        onPress={() => {this.navigation.push('Notificacao',{})}}
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
      title: "Este é o Título de uma Notificação 📬",
      body: "E este é o Conteúdo da Notificação",
      data: { data: "Outros dados aqui." },
    },
    trigger: { seconds: 1 }, //quanto tempo esperar antes de lançar a notificação?
  });
}
