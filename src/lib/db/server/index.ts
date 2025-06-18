import { drizzle } from 'drizzle-orm/postgres-js';
import { relations } from './schema/relations.js';
import { env } from '$env/dynamic/private';
import postgres from 'postgres';
import * as t from 'drizzle-orm';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

const db = drizzle(client, { relations });

export { db, relations, t };
