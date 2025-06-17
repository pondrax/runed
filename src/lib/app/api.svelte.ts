import { Client } from '$lib/db/client';
import type { DB } from '$lib/db/server/types';
import { resource } from 'runed';

export const client = new Client<DB>();

export const api = <
	TableName extends keyof DB['schema'],
	Options extends Parameters<DB['query'][TableName]['findMany']>[0]
>(
	table: TableName,
	options: Options
) => {
	const query = $state(options);
	const request = client.from(table);
	const records = resource(
		() => ({ ...query }),
		async () => request.findMany(query)
	);
	return { records, request, query };
};
