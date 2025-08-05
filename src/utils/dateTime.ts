/**
 * Utilitários para manipulação de data e hora no aplicativo.
 * Centraliza funções de formatação e cálculos relacionados a tempo.
 */

/**
 * Formata uma data para o formato local (DD/MM/YYYY)
 * @param date Data a ser formatada ou string no formato YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
}

/**
 * Formata uma hora para o formato HH:MM
 * @param time String no formato HH:MM ou objeto Date
 */
export function formatTime(time: string | Date): string {
  if (typeof time === 'string') {
    return time; // Assume que já está no formato correto
  }
  
  return time.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Calcula a duração em minutos entre dois horários
 * @param startTime Horário de início no formato HH:MM
 * @param endTime Horário de fim no formato HH:MM
 * @returns Duração em minutos
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return endMinutes - startMinutes;
}

/**
 * Converte minutos para o formato de horas e minutos (HH:MM)
 * @param minutes Total de minutos
 */
export function minutesToHoursAndMinutes(minutes: number): string {
  const hours = Math.floor(Math.abs(minutes) / 60);
  const mins = Math.abs(minutes) % 60;
  
  const sign = minutes < 0 ? '-' : '';
  return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Verifica se uma data é hoje
 * @param date Data a ser verificada ou string no formato YYYY-MM-DD
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}