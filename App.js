import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native-ui-lib";


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
          Titulo: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Corpo: {notification && notification.request.content.body}</Text>
      </View>

      <Button
        label="Enviar Notificação"
        text50
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

  let dados = [
    {
      titulo: "CUPOM",
      corpo: "Seu Cupom de 50% já está te esperando." 
    },
    {
      titulo: "HUMOR",
      corpo: "Venha para o Lanche do Careca Lindo!"
    },
    {
      titulo: "OFERTA",
      corpo: "Aproveite as nossas ofertas de Black Friday",
    }
  ];

  for (const dado of dados) {
    await Notifications.scheduleNotificationAsync({
      //O que enviar junto com a notificação? título, mensagem (body), etc.
      content: {
        title: dado.titulo,
        body: dado.corpo,
      },
      trigger: { seconds: 1 }, //quanto tempo esperar antes de lançar a notificação?
    });
  }

  
}
