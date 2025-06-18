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

		const request = new Request(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

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
	async save<Options extends Partial<QueryResult<TableName, {}>>>(options: Options) {
		const url = this.client.buildUrl(String(this.table), options as Record<string, unknown>);

		const request = new Request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(options)
		});

		const result = await this.client.send(request);

		// @ts-ignore
		return result as QueryResult<TableName, Options>;
	}
}
