import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { Register } from "../model/Register";
import migrations from "./migrations";
import schema from "./schema";
// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    migrations,
    // (optional database name or file system path)
    dbName: "registra",
    // (recommended option, should work flawlessly out of the box on iOS. On Android,
    // additional installation steps have to be taken - disable if you run into issues...)
    jsi: false /* Platform.OS === 'ios' */,
    // (optional, but you should implement this method)
    onSetUpError: (error) => {
        console.log("Database setup error", error);
    },
});

// Then, make a Watermelon database from it!
export const database = new Database({
    adapter,
    modelClasses: [],
});
export const registerCollection = database.get<Register>("register");
