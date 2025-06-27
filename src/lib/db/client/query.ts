import { createId } from '$lib/app';
import type { Client } from '.';
import type { QueryResult } from '../server/types';
import type { GenericSchema, QueryOptions, PaginatedResponse } from './types';

export class QueryBuilder<
	DatabaseSchema extends GenericSchema,
	TableName extends keyof DatabaseSchema['schema']
> {
	constructor(
		private table: TableName,
		private client: Client<DatabaseSchema>
	) {}

	async findMany<Options extends QueryOptions<DatabaseSchema, TableName>>(
		options: Options
	): //@ts-ignore
	Promise<PaginatedResponse<QueryResult<TableName, Options>>> {
		const url = this.client.buildUrl(String(this.table), options as Record<string, unknown>);

		const request = new Request(url);

		const result = await this.client.send(request);

		return result;
	}

	// async findFirst<Options extends QueryOptions<DatabaseSchema, TableName>>(options: Options) {
	// 	const url = this.client.buildUrl(String(this.table), options as Record<string, unknown>);

	// 	if (!url) return;
	// 	const request = new Request(url, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		}
	// 	});

	// 	const result = await this.client.executeRequest(request);

	// 	// @ts-ignore
	// 	return result as QueryResult<TableName, Options>;
	// }

	//@ts-ignore
	async save<Options extends Record<string, Partial<QueryResult<TableName, {}>>>>(
		options: Options,
		single: boolean = false
	) {
		const url = this.client.buildUrl(String(this.table));

		const form = new FormData();
		const dataMap = single ? { [createId()]: options } : options;

		for (const [itemId, data] of Object.entries(dataMap)) {
			for (const [key, value] of Object.entries(data)) {
				// if (value === null) continue;
				if (['created', 'updated'].includes(key)) continue;
				if (value instanceof FileList) {
					Array.from(value).forEach((file, index) => {
						form.append(`${itemId}:${key}[${file.name}]`, file);
					});
				} else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
					form.append(`${itemId}:${key}`, JSON.stringify(value));
				} else {
					form.append(`${itemId}:${key}`, value as any);
				}
			}
		}
		const request = new Request(url, {
			method: 'POST',
			body: form
		});

		const result = await this.client.send(request);

		// @ts-ignore
		return result as QueryResult<TableName, Options>;
	}
}
