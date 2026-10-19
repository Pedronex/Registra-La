import "expo-dev-client";
import "react-native-gesture-handler";
import "../../global.css";

import { database } from "@/db";
import migrations from "@/db/migrations/migrations";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as Notifications from "expo-notifications";
import { router, Slot } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * Layout principal da aplicação
 * Gerencia atualizações e inicialização do aplicativo
 */
export default function Layout() {
  const { success, error } = useMigrations(database, migrations);

  useEffect(() => {
    /**
     * Inicializa o aplicativo verificando atualizações e carregando configurações
     */
    const initializeApp = async () => {
      try {
        if (Updates.channel !== "development") {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        }
      } catch { }
    };

    // Inicializa o aplicativo
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === "string") {
        router.push(url as any);
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      subscription.remove();
      initializeApp();
    };
  }, []);

  // Componente de notificação de atualização foi movido para a página inicial
  if (error) {
    return (
      <View>
        <Text>Erro na migração: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Rodando migrações...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
