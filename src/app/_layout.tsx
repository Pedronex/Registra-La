import "expo-dev-client";
import "../../global.css";

import { Slot } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";

import { useConfig } from "@/hooks/useConfig";
import { Alert } from "@/lib/Alert";
import { Messages } from "@/constants/Messages";

/**
 * Layout principal da aplicação
 * Gerencia atualizações e inicialização do aplicativo
 */
export default function Layout() {
  // Carrega as configurações do aplicativo
  const { loadConfig } = useConfig();

  useEffect(() => {
    // Inicializa o aplicativo
    initializeApp();
  }, []);

  /**
   * Inicializa o aplicativo verificando atualizações e carregando configurações
   */
  const initializeApp = async () => {
    await loadConfig();
    checkForUpdates();
  };

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
              Alert.error(Messages.errors.update.install);
            }
          }
        );
      }
    } catch (error) {
      console.error(Messages.errors.update.check, error);
    }
  };

  return <Slot />;
}
