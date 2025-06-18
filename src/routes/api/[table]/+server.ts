import { env } from '$env/dynamic/private';
import { db, relations, t } from '$lib/db/server';
import { json } from '@sveltejs/kit';

export async function GET({ params, url: { searchParams } }) {
	const start = Date.now();
	const tableName = params.table as keyof typeof db.query;
	const query = {
		search: searchParams.get('search'),
		with: JSON.parse(searchParams.get('with') || '{}'),
		limit: Number(searchParams.get('limit') || 15),
		offset: Number(searchParams.get('offset') || 0),
		orderBy: JSON.parse(searchParams.get('orderBy') || '{}'),
		where: JSON.parse(searchParams.get('where') || '{}'),
		total: searchParams.get('total') == 'false' ? false : true
	};

	const columns: string[] = [];
	const filter = [];
	for (const [key, prop] of Object.entries(relations.tables[tableName])) {
		if (typeof prop !== 'function') {
			columns.push(key);
			if (query.search) {
				if (prop.columnType == 'PgText') {
					filter.push({ [key]: { ilike: `%${query.search}%` } });
				} else {
					filter.push({
						RAW: (table: any) => t.sql`${table[key]}::text ILIKE ${`%${query.search}%`}`
					});
				}
			}
		}
	}

	// @ts-ignore
	const raw = db.query[tableName].findMany({
		...query,
		where: {
			AND: [{ OR: filter }, query.where]
		}
	});
	const rawSQL = raw.toSQL();
	// console.log(filter, rawSQL);
	const startQuery = Date.now();
	const items = await raw;

	const result: Record<string, any> = {
		meta: {
			columns,
			debug: env.APP_DEBUG == 'true' && {
				SQL: rawSQL,
				elapsed: Date.now() - startQuery
			}
		},
		items,
		elapsed: Date.now() - start,
		page: query.offset / query.limit + 1,
		perPage: query.limit
	};
	if (query.total) {
		const totalItems = await countSQL(raw.toSQL());
		result.totalItems = totalItems;
		result.totalPages = Math.ceil(totalItems / query.limit);
	}
	return json(result);
}

async function countSQL(raw: { sql: string; params: any[] }) {
	// Step 1: Replace only the outer SELECT list
	let sqlCount = raw.sql.replace(/^select\s+.*?\s+from\s+/is, 'select count(*) as count from ');

	// Step 2: Remove the last ORDER BY and everything after it
	const lastOrderByIndex = sqlCount.toLowerCase().lastIndexOf('order by');
	if (lastOrderByIndex !== -1) {
		sqlCount = sqlCount.slice(0, lastOrderByIndex).trim();
	}

	// Step 3: Replace $1, $2, ... with parameter values
	const compiledSql = sqlCount.replace(/\$(\d+)/g, (_, index) => {
		const value = raw.params[Number(index) - 1];
		return `'${String(value).replace(/'/g, "''")}'`; // escape single quotes
	});

	// console.log(compiledSql, '\n\n\n', raw.sql)

	// Step 4: Execute and extract count
	const result = await db.execute(compiledSql);
	return Number(result?.at(0)?.count);
}

export async function POST({ params, request }) {
	const { table } = params;
	const data = await request.json();
	console.log(data);
	return json({ message: `Data received for table: ${table}`, data });
}

export async function PUT({ params, request }) {
	const { table } = params;
	const data = await request.json();
	console.log(data);
	return json({ message: `Data updated for table: ${table}`, data });
}

export async function DELETE({ params, request }) {
	const { table } = params;
	const data = await request.json();
	console.log(data);
	return json({ message: `Data deleted for table: ${table}`, data });
}
