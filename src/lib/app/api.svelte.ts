import { Client, type DB, type QueryOptions } from '$lib/db/client';
import { alert, app } from './app.svelte';
import { resource } from './utils.svelte';

export const client = new Client<DB>();

export const api = {
  send(
    input: string | URL,
    params: RequestInit = {}
  ) {
    const query = $state(params);
    const records = resource(
      async (params: any) => {
        const request = new Request(input, params);
        return await client.send(request);
      },
      () => ({ ...query }),
      // options
    );
    const result: typeof records & {
      query?: typeof query;
    } = records;

    result.query = query;
    return result;
  },
  get<TableName extends keyof DB['schema'], Query extends QueryOptions<DB, TableName>>(
    table: TableName,
    params: Query = {} as Query
  ) {
    const query: Query = $state({
      search: '',
      offset: 0,
      limit: 15,
      total: true,
      ...params
    });
    const request = client.from(table);
    const records = resource(
      async () => {
        return request.findMany(query);
      },
      () => ({ ...query }),
      // options
    );
    const result = records as typeof records & {
      query: typeof query;
      request: typeof request;
    };

    result.query = query;
    result.request = request;
    return result;
  }
};

client.beforeSend(async ({ request }) => {
  app.current.loading = true;
  return request;
});

client.afterSend(async ({ request, response, data }) => {
  if (!response.ok) {
    if (data?.error?.routine == '_bt_check_unique') {
      alert({ message: 'Data Telah ada', type: 'error' });
    } else {
      alert({ message: data?.message, error: data?.error?.issues, type: 'error' });
    }
    app.current.loading = false;
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
  setTimeout(() => {
    app.current.loading = false;
  }, 1000);
  return data;
});
