import type { DB, QueryResult } from '../server/types';
import { BaseClient } from './base';
import { QueryBuilder } from './query';
import type { GenericSchema } from './types';

export class Client<DatabaseSchema extends GenericSchema> extends BaseClient {
	constructor(baseUrl?: string) {
		super(baseUrl);
	}

	from<TableName extends keyof DatabaseSchema['schema']>(
		table: TableName
	): QueryBuilder<DatabaseSchema, TableName> {
		return new QueryBuilder(table, this);
	}
}

export const client = new Client<DB>();
// const u = await client.from('users').findMany({});
// const user = client.from('users');
// const userMany = await user.findMany({
// 	limit: 10,
// 	offset: 0,
// 	orderBy: {},
// 	with: {
// 		posts: true
// 	}
// });

// userMany;
// const userOne = await user.findFirst({});
// // client.
