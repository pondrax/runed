export type HookOptions = {
	beforeSend?: (context: { request: Request }) => Promise<Request> | Request;
	afterSend?: (context: { request: Request; response: Response; data: any }) => Promise<any> | any;
};

export type GenericSchema = {
	schema: Record<string, any>;
	query: {
		[K in keyof GenericSchema['schema']]: {
			findMany: (options: any) => any;
			findFirst: (options: any) => any;
		};
	};
};

export type QueryOptions<T extends GenericSchema, TableName extends keyof T['schema']> = Parameters<
	T['query'][TableName]['findMany']
>[0] & {
	search?: string;
	total?: boolean;
};

export type PaginatedResponse<T> = {
	items: T[];
	meta: {
		columns: Extract<keyof T, string>[];
	};
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	elapsed: number;
};
