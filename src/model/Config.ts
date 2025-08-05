// models/Config.ts
import { Model } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

export class Config extends Model {
    static table = 'config'

    @field('work_hours') workHours!: number            // Horas de trabalho por dia
    @field('tolerance') tolerance?: number            // Tolerância em minutos
}
