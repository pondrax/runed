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
