import type { BuildQueryResult, ExtractTablesWithRelations } from 'drizzle-orm';
import { db, relations } from '.';

export type DB = {
	schema: ExtractTablesWithRelations<typeof relations>;
	query: typeof db.query;
};

type Schema = DB['schema'];
type Query = DB['query'];

// export type DebugQueryResult<
// 	TableName extends keyof Schema,
// 	QueryConfig extends Parameters<Query[TableName]['findMany']>[0]
// > = {
// 	$meta: {
// 		columns: keyof Schema[TableName]['columns'];
// 		relations: Schema[TableName]['relations'];
// 	};
// 	items: BuildQueryResult<
// 		Schema,
// 		Schema[TableName],
// 		QueryConfig extends { with: infer With } ? { with: With } : {}
// 	>;
// };

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
// type Item = Tes['items'][number];
