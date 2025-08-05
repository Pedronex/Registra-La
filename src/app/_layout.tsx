import "expo-dev-client";

import "../../global.css";

import { Slot } from "expo-router";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

import { database } from "@/db";
import { useEffect } from "react";

export default function Layout() {
  useEffect(() => {
    async function verifyUpdate() {
      if (__DEV__) return;

      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          Alert.alert(
            "Atualização disponível",
            "Tem certeza que deseja atualizar?",
            [
              {
                text: "Sim",
                onPress: async () => {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                },
              },
              {
                text: "Cancelar",
                style: "cancel",
              },
            ]
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
    async function verifyDatabase() {
      try {
        const data = await database.localStorage.get("Register");

        if (data) {
          return data;
        }
        return;
      } catch (error) {
        console.error("Erro ao verificar o banco: " + (error as Error).message);
        console.error(error);
      }
    }
    verifyDatabase();
    verifyUpdate();
  }, []);

  return <Slot />;
}
