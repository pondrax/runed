import { db, t } from '$lib/db/server';
import { json } from '@sveltejs/kit';

export async function GET() {
	const res = await db.query.users.findMany({
		where: {
			AND: [{ RAW: (table) => t.sql`${table.age}::text like '%11%'` }]
		}
	});
	return json({
		message: 'Alive',
		res
	});
}
