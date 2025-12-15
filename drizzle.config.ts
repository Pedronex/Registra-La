import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/db/schema',
  out: './src/db/migrations',
  casing: 'snake_case',
  migrations: {
    prefix: 'index',
    table: 'migrations'
  },
  breakpoints: true
})
