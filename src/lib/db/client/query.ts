import type { Client } from '.';
import type { QueryResult } from '../server/types';
import type { GenericSchema } from './types';

export class QueryBuilder<
	DatabaseSchema extends GenericSchema,
	TableName extends keyof DatabaseSchema['schema']
> {
	constructor(
		private table: TableName,
		private client: Client<DatabaseSchema>
	) {}

	async findMany<Options extends Parameters<DatabaseSchema['query'][TableName]['findMany']>[0]>(
		options: Options
	): Promise<{
		//@ts-ignore
		items: QueryResult<TableName, Options>[];
		page: number;
		perPage: number;
		totalItems: number;
		totalPages: number;
		elapsed: number;
	}> {
		const url = this.client.buildUrl(String(this.table), options as Record<string, unknown>);

		const request = new Request(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result = await this.client.executeRequest(request);

		return result;
	}

	async findFirst<Options extends Parameters<DatabaseSchema['query'][TableName]['findFirst']>[0]>(
		options: Options
	) {
		const url = this.client.buildUrl(String(this.table), options as Record<string, unknown>);

		if (!url) return;
		const request = new Request(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result = await this.client.executeRequest(request);

		// @ts-ignore
		return result as QueryResult<TableName, Options>;
	}
}
