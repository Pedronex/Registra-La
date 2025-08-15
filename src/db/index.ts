import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';
const expo = SQLite.openDatabaseSync('db.db');
const database = drizzle(expo);

export { database, expo, useDrizzleStudio };

