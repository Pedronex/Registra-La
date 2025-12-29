import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as SQLite from 'expo-sqlite'
import { schema } from './schema'
const expo = SQLite.openDatabaseSync('registra_la.db')

const database = drizzle(expo, {
  schema,
  casing: 'snake_case',
})

export { database }

