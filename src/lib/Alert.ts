/**
 * Utilitário para exibir alertas e diálogos no aplicativo.
 * Encapsula a API de Alert do React Native com funções mais específicas.
 */
import { AlertButton, Alert as RNAlert } from 'react-native';

/**
 * Interface para botões de alerta
 */
interface AlertButtonOptions {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * Classe utilitária para exibir alertas
 */
class AlertUtil {
  /**
   * Exibe um alerta de sucesso
   * @param message Mensagem a ser exibida
   * @param onOk Callback opcional ao pressionar OK
   */
  success(message: string, onOk?: () => void): void {
    RNAlert.alert(
      'Sucesso',
      message,
      [{ text: 'OK', onPress: onOk }]
    );
  }

  /**
   * Exibe um alerta de erro
   * @param message Mensagem de erro
   * @param onOk Callback opcional ao pressionar OK
   */
  error(message: string, onOk?: () => void): void {
    RNAlert.alert(
      'Erro',
      message,
      [{ text: 'OK', onPress: onOk }]
    );
  }

  /**
   * Exibe um alerta informativo
   * @param title Título do alerta
   * @param message Mensagem a ser exibida
   * @param onOk Callback opcional ao pressionar OK
   */
  info(title: string, message: string, onOk?: () => void): void {
    RNAlert.alert(
      title,
      message,
      [{ text: 'OK', onPress: onOk }]
    );
  }

  /**
   * Exibe um alerta de confirmação com botões Sim/Não
   * @param title Título do alerta
   * @param message Mensagem a ser exibida
   * @param onConfirm Callback ao confirmar
   * @param onCancel Callback opcional ao cancelar
   */
  confirm(title: string, message: string, onConfirm: () => void, onCancel?: () => void): void {
    RNAlert.alert(
      title,
      message,
      [
        {
          text: 'Não',
          onPress: onCancel,
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: onConfirm,
        },
      ]
    );
  }

  /**
   * Exibe um alerta personalizado
   * @param title Título do alerta
   * @param message Mensagem a ser exibida
   * @param buttons Array de botões personalizados
   */
  custom(title: string, message: string, buttons: AlertButtonOptions[]): void {
    const alertButtons: AlertButton[] = buttons.map(button => ({
      text: button.text,
      onPress: button.onPress,
      style: button.style,
    }));

    RNAlert.alert(title, message, alertButtons);
  }
}

// Exporta uma instância única do utilitário de alerta
export const Alert = new AlertUtil();