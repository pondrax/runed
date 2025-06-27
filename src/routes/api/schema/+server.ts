import { env as pub } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';
import { relations } from '$lib/db/server';
import { json } from '@sveltejs/kit';

export async function GET() {
	const tables: Record<string, any> = {};
	// console.log(relations.config.users.posts.fieldName);
	for (const [tableName, prop] of Object.entries(relations.schema)) {
		const columns: Record<string, any> = {};
		for (const [field, detail] of Object.entries(prop)) {
			if (typeof detail !== 'function') {
				const type = detail.columnType?.toLowerCase()?.replace('pg', '');
				const related = Object.keys(
					relations.config?.[tableName as keyof typeof relations.config] ?? {}
				);
				// console.log(related);
				if (pub.PUBLIC_APP_DEBUG == 'true') {
					columns[field] = {
						...detail.config,
						type,
						related
					};
				} else {
					columns[field] = {
						name: detail.name,
						notNull: detail.notNull,
						primaryKey: detail.primaryKey,
						isUnique: detail.isUnique,
						dataType: detail.dataType,
						type,
						related
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
