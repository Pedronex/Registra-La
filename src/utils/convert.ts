export function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':')
  return Number(hours) * 60 + Number(minutes)
}

export function convertMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const min = minutes % 60
  if (hours < 0) {
    return `-${String(hours * -1).padStart(2, '0')}:${min.toString().padStart(2, '0')}`
  }
  return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
}

export function convertTimeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

export function convertSecondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const min = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours < 0) {
    return `-${String(hours * -1).padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
