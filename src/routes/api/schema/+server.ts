import { env } from '$env/dynamic/private';
import { relations } from '$lib/db/server';
import { json } from '@sveltejs/kit';

export async function GET() {
	const tables: Record<string, any> = {};
	for (const [tableName, prop] of Object.entries(relations.tables)) {
		const columns: Record<string, any> = {};
		for (const [field, detail] of Object.entries(prop)) {
			if (typeof detail !== 'function') {
				const type = detail.columnType?.toLowerCase()?.replace('pg', '');
				if (env?.APP_DEBUG == 'true') {
					columns[field] = {
						...detail.config,
						type
					};
				} else {
					columns[field] = {
						name: detail.name,
						notNull: detail.notNull,
						primaryKey: detail.primaryKey,
						isUnique: detail.isUnique,
						dataType: detail.dataType,
						type
						// uniqueName: detail.uniqueName,
						// hasDefault: detail.hasDefault,
					};
				}
			}
		}
		tables[tableName] = {
			columns
		};
	}
	return json({ tables });
}
