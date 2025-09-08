import "expo-dev-client";
import "../../global.css";

import LogRocket from "@logrocket/react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Slot } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { database, expo } from "@/db";
import { useUpdate } from "@/hooks/useUpdate";
import { ThemeProvider } from "@/providers/ThemeProvider";
import migrations from "../../drizzle/migrations";

/**
 * Layout principal da aplicação
 * Gerencia atualizações e inicialização do aplicativo
 */
export default function Layout() {
  useDrizzleStudio(expo);

  const { success, error } = useMigrations(database, migrations);
  const { loadUpdates } = useUpdate();

  useEffect(() => {
    loadUpdates();
    /**
     * Inicializa o aplicativo verificando atualizações e carregando configurações
     */
    const initializeApp = async () => {
      LogRocket.init("gcrcj1/registra-la", {
        updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
        expoChannel: Updates.channel,
      });
    };

    // Inicializa o aplicativo
    initializeApp();
  }, [loadUpdates]);
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
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
