// models/Register.ts
import { Model } from '@nozbe/watermelondb'
import { date, field, readonly } from '@nozbe/watermelondb/decorators'

export class Register extends Model {
    static table = 'registers'

    @field('type') type!: string            // entrada, saída, folga, etc.
    @field('time') time!: string            // Hora: "08:00"
    @field('date') date!: string            // Data: "2025-07-23"
    @field('photo') photo?: string          // Caminho da foto ou URI base64
    @field('location') location?: string    // Coordenadas ou endereço
    @field('description') description?: string
    @field('nsr') nsr?: string              // Número de série do registro
    @field('is_full_day') isFullDay!: boolean

    @field('start_time') startTime?: string
    @field('end_time') endTime?: string
    @field('duration') duration?: number    // Em minutos
    @field('operation') operation?: 'add' | 'sub'

    @readonly @date('created_at') createdAt!: Date
    @readonly @date('updated_at') updatedAt!: Date
}
