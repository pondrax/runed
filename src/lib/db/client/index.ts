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
