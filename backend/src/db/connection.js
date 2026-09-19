import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import config from '../config/env.js';
import { initializeSchema } from './schema.js';

fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });

const db = new Database(config.databasePath);

// SQLite ignores foreign keys unless this is switched on for every connection.
db.pragma('foreign_keys = ON');

initializeSchema(db);

export default db;
