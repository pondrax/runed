import { customType, text, timestamp } from 'drizzle-orm/pg-core';
import { init } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import crypto from 'node:crypto';

const secret = process.env.APP_SECRET;
// const secret = import.meta.env ? import.meta.env.VITE_APP_SECRET : process.env.APP_SECRET;
console.log('APP_SECRET', secret, process.env.APP_SECRET);

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(secret)).digest(); // 32 bytes
const ivLength = 16; // AES block size

function encrypt(value: string): string {
	const iv = crypto.randomBytes(ivLength);
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(value: string): string {
	const [ivHex, encryptedHex] = value.split(':');
	const iv = Buffer.from(ivHex, 'hex');
	const encrypted = Buffer.from(encryptedHex, 'hex');
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
	return decrypted.toString('utf8');
}
export const createId = (length = 15) => {
	const cuid = init({ length });
	return cuid();
};
export const id = (length = 15) =>
	text('id')
		.primaryKey()
		.notNull()
		.$default(() => createId(length));
export const created = timestamp('created', { withTimezone: true, mode: 'string' }).defaultNow();
export const updated = timestamp('updated', { withTimezone: true, mode: 'string' })
	.defaultNow()
	.$onUpdate(() => sql`NOW()` as any);

export const passwordText = customType<{ data: string }>({
	dataType() {
		return 'text';
	},
	fromDriver(value: unknown) {
		try {
			return decrypt(String(value));
		} catch (e) {
			return String(value);
		}
	},
	toDriver(value: string) {
		return encrypt(value);
	}
});

export const encryptedText = customType<{ data: string }>({
	dataType() {
		return 'text';
	},
	fromDriver(value: unknown) {
		try {
			return decrypt(String(value));
		} catch (e) {
			return String(value);
		}
	},
	toDriver(value: string) {
		return encrypt(value);
	}
});

export const file = customType<{ data: string }>({
	dataType() {
		return 'text';
	},
	fromDriver(value: unknown) {
		try {
			return JSON.parse(String(value));
		} catch (e) {
			return String(value);
		}
	},
	toDriver(value: string) {
		return JSON.stringify(value);
	}
});
export const encryptedJson = customType<{ data: string }>({
	dataType() {
		return 'text';
	},
	fromDriver(value: unknown) {
		try {
			return JSON.parse(decrypt(String(value)));
		} catch (e) {
			return String(value);
		}
	},
	toDriver(value: string) {
		return encrypt(JSON.stringify(value));
	}
});

// type ColumnDefinition = {
//   field: string;
//   type: string;
//   notNull?: boolean;
//   unique?: boolean;
//   references?: string;
// };
// export function createPgTable<T extends ColumnDefinition>(
//   tableName: string,
//   columns: T[]
// ) {

//   const pgColumns = {} as Record<T['field'], ReturnType<typeof text> | ReturnType<typeof integer>>;

//   for (const column of columns) {
//     let col;
//     switch (column.type) {
//       case 'integer':
//         col = integer(column.field);
//         break;
//       default:
//         col = text(column.field);
//     }
//     pgColumns[column.field as T['field']] = col;
//   }

//   return pgTable(tableName, {
//     id: text('id').primaryKey().notNull().$defaultFn(() => createId()),
//     ...pgColumns,
//     created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
//     updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
//   });
// }
