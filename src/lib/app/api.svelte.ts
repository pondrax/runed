import { Client, type DB, type QueryOptions } from '$lib/db/client';
import { resource, type ResourceOptions, type ResourceReturn } from 'runed';
import { alert, app } from './app.svelte';
import { delay } from './utils.svelte';

export const client = new Client<DB>();

export const api = {
	send(
		input: string | URL,
		params: RequestInit = {},
		options: ResourceOptions<any> = { debounce: 300 }
	) {
		const query = $state(params);
		const records = resource(
			() => ({ ...query }),
			async (params: any) => {
				const request = new Request(input, params);
				return await client.send(request);
			},
			options
		) as ResourceReturn<any> & {
			query: typeof query;
		};
		records.query = query;
		return records;
	},
	findMany<TableName extends keyof DB['schema'], Query extends QueryOptions<DB, TableName>>(
		table: TableName,
		params: Query = {} as Query,
		options: ResourceOptions<{}> = { debounce: 300 }
	) {
		const query = $state(params);
		const records = resource(
			() => ({ ...query }),
			async () => {
				return client.from(table).findMany(query);
			},
			options
		) as ResourceReturn<any> & {
			query: typeof query;
		};
		records.query = query;
		return records;
	}
};

client.beforeSend(async ({ request }) => {
	app.loading = true;
	return request;
});

client.afterSend(async ({ request, response, data }) => {
	if (!response.ok) {
		if (data?.error?.routine == '_bt_check_unique') {
			alert({ message: 'Data Telah ada', type: 'error' });
		} else {
			alert({ message: data?.message, error: data?.error?.issues, type: 'error' });
		}
		app.loading = false;
		throw new Error(data);
	}
	if (request.method === 'POST') {
		if (
			request.url.indexOf('/records') > 0 &&
			!request.url.includes('hidden') &&
			!location.pathname.includes('/auth')
		) {
			alert({ message: 'Data Disimpan', timeout: 3000 });
		}
		if (request.url.indexOf('/auth-with-password') > 0) {
			alert({ message: 'Otentikasi Berhasil', timeout: 3000 });
		}
	}
	await delay(500);
	app.loading = false;
	return data;
});
