import "expo-dev-client";
import "../../global.css";

import LogRocket from "@logrocket/react-native";
import * as Sentry from "@sentry/react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { isRunningInExpoGo } from "expo";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Slot, useNavigationContainerRef } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { Messages } from "@/constants/Messages";
import { database, expo } from "@/db";
import { Alert } from "@/lib/Alert";
import { ThemeProvider } from "@/providers/ThemeProvider";
import migrations from "../../drizzle/migrations";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: "https://6fdffe0d95c46b28fb9ddcd2ee654e18@o4509791498534912.ingest.us.sentry.io/4509791499976704",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

/**
 * Layout principal da aplicação
 * Gerencia atualizações e inicialização do aplicativo
 */
function Layout() {
  useDrizzleStudio(expo);
  const ref = useNavigationContainerRef();

  const { success, error } = useMigrations(database, migrations);

  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

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

export default Sentry.wrap(Layout);
