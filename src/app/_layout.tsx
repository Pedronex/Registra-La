import 'expo-dev-client'
import 'react-native-gesture-handler'
import '../../global.css'

import LogRocket from '@logrocket/react-native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Slot } from 'expo-router'
import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { Text, View } from 'react-native'

import { database } from '@/db'
import { ThemeProvider } from '@/providers/ThemeProvider'
import migrations from '../../drizzle/migrations'

/**
 * Layout principal da aplicação
 * Gerencia atualizações e inicialização do aplicativo
 */
export default function Layout() {
  const { success, error } = useMigrations(database, migrations)

  useEffect(() => {
    /**
     * Inicializa o aplicativo verificando atualizações e carregando configurações
     */
    const initializeApp = async () => {
      try {
        if (Updates.channel !== 'development') {
          LogRocket.init('gcrcj1/registra-la', {
            updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
            expoChannel: Updates.channel,
          })
        }
      } catch {}
    }

    // Inicializa o aplicativo
    initializeApp()
  }, [])

  // Componente de notificação de atualização foi movido para a página inicial
  if (error) {
    return (
      <View>
        <Text>Erro na migração: {error.message}</Text>
      </View>
    )
  }
  if (!success) {
    return (
      <View>
        <Text>Rodando migrações...</Text>
      </View>
    )
  }

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  )
}
