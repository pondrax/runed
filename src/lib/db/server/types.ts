import type { BuildQueryResult, ExtractTablesWithRelations } from 'drizzle-orm';
import { db, relations } from '.';

export type DB = {
	schema: ExtractTablesWithRelations<typeof relations>;
	query: typeof db.query;
};

type Schema = DB['schema'];
type Query = DB['query'];

export type QueryResult<
	TableName extends keyof Schema,
	QueryConfig extends Parameters<Query[TableName]['findMany']>[0]
> = BuildQueryResult<
	Schema,
	Schema[TableName],
	QueryConfig extends { with: infer With } ? { with: With } : {}
>;

// Example usage
type Tes = QueryResult<
	'posts',
	{
		with: {
			author: {
				with: {
					comments: true;
				};
			};
		};
	}
>;

type Keys = Extract<keyof Tes, string>;
// type Item = Tes['items'][number];
