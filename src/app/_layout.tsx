import "expo-dev-client";
import "../../global.css";

import LogRocket from "@logrocket/react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Slot } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { Messages } from "@/constants/Messages";
import { database, expo } from "@/db";
import { Alert } from "@/lib/Alert";
import { ThemeProvider } from "@/providers/ThemeProvider";
import migrations from "../../drizzle/migrations";

/**
 * Layout principal da aplicação
 * Gerencia atualizações e inicialização do aplicativo
 */
export default function Layout() {
  useDrizzleStudio(expo);

  const { success, error } = useMigrations(database, migrations);

  useEffect(() => {
    /**
     * Inicializa o aplicativo verificando atualizações e carregando configurações
     */
    const initializeApp = async () => {
      checkForUpdates();
      LogRocket.init("gcrcj1/registra-la", {
        updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
        expoChannel: Updates.channel,
      });
    };

    // Inicializa o aplicativo
    initializeApp();
  }, []);

  /**
   * Verifica se há atualizações disponíveis
   */
  const checkForUpdates = async () => {
    // Não verifica atualizações em ambiente de desenvolvimento
    if (__DEV__) return;

    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.confirm(
          "Atualização disponível",
          Messages.confirmations.update,
          async () => {
            try {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            } catch (error) {
              console.error(Messages.errors.update.install, error);
              Alert.error(Messages.errors.update.install);
            }
          }
        );
      }
    } catch (error) {
      console.error(Messages.errors.update.check, error);
    }
  };

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
