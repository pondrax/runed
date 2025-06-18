import { api } from './api.svelte';
import { app, alert } from './app.svelte';
import { init } from '@paralleldrive/cuid2';
export const createId = (length = 15) => {
	return init({ length })();
};

export const isDevelopment = process.env.NODE_ENV === 'development';
export { app, api, alert };
