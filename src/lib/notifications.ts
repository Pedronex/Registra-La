import { ConfigData } from '@/db/schema/config'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

const defaultNotificationConfig = {
  importance: Notifications.AndroidImportance.MAX,
  enableVibrate: true,
  vibrationPattern: [0, 500, 250, 1000, 250, 1000],
  lightColor: '#FF231F',

  lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
}

// Configura o handler de notificações para exibir alertas quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
  handleSuccess(notificationId) {
    console.log(`Notificação ${notificationId} disparada com sucesso!`)
  },
})

// Solicita permissão de notificação
async function requestPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Falha ao obter token para notificação push!')
    return false
  }

  // Específico para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('entrance', {
      name: 'Entrada',
      ...defaultNotificationConfig,
    })
    await Notifications.setNotificationChannelAsync('lunch', {
      name: 'Almoço',
      ...defaultNotificationConfig,
    })
    await Notifications.setNotificationChannelAsync('returnLunch', {
      name: 'Retorno',
      ...defaultNotificationConfig,
    })
    await Notifications.setNotificationChannelAsync('exit', {
      name: 'Saída',
      ...defaultNotificationConfig,
    })
  }

  return true
}

type NotificationPoint = {
  id: string
  totalMinutes: number
  title: string
  body: string
}

// Agenda as notificações diárias com base na configuração
export async function scheduleWorkdayNotifications(config: ConfigData) {
  const hasPermission = await requestPermissions()
  if (!hasPermission) return

  // Cancela todas as notificações agendadas para evitar duplicatas
  await Notifications.cancelAllScheduledNotificationsAsync()

  // Se as notificações estiverem desativadas, não agenda novas
  if (!config.notifications) {
    console.log('Notificações desativadas. Nenhum agendamento foi criado.')
    return
  }

  const workDays = Array.isArray(config.workDays) ? config.workDays : []
  if (workDays.length === 0) {
    console.log('Nenhum dia de trabalho selecionado. Nenhum agendamento foi criado.')
    return
  }

  const notificationPoints: NotificationPoint[] = [
    {
      id: 'entrance',
      totalMinutes: config.entraceTime,
      title: 'Hora de bater o ponto!',
      body: 'Não se esqueça de registrar sua entrada.',
    },
    {
      id: 'lunch',
      totalMinutes: config.entraceBufferTime || 0,
      title: 'Hora do almoço!',
      body: 'Não se esqueça de registrar sua saída para o almoço.',
    },
    {
      id: 'returnLunch',
      totalMinutes: config.exitBufferTime || 0,
      title: 'Fim do almoço!',
      body: 'Não se esqueça de registrar seu retorno do almoço.',
    },
    {
      id: 'exit',
      totalMinutes: config.exitTime,
      title: 'Fim do expediente!',
      body: 'Não se esqueça de registrar sua saída.',
    },
  ]

  console.log('Agendando notificações para a jornada de trabalho...')
  for (const point of notificationPoints) {
    if (point.totalMinutes === 0) continue

    const hour = Math.floor(point.totalMinutes / 60)
    const minute = point.totalMinutes % 60

    for (const day of workDays) {
      const expoWeekday = day === 0 ? 1 : day + 1

      await Notifications.scheduleNotificationAsync({
        content: {
          title: point.title,
          body: point.body,
          vibrate: [200, 100, 200],
          data: {
            url: `/add`,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: expoWeekday,
          hour,
          minute,
          repeats: true,
          channelId: point.id,
        } as Notifications.WeeklyTriggerInput,
      })
    }
  }
  console.log('Notificações agendadas com sucesso!')
}

export function useNotificationObserver() {}
