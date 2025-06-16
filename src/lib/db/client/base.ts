import type { HookOptions } from './types';

export class BaseClient {
	protected hooks: HookOptions = {};
	protected baseUrl: string = '';

	constructor(baseUrl?: string) {
		this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
	}

	protected normalizePath(path: string): string {
		return path.replace(/^\/|\/$/g, '');
	}

	buildUrl(path: string, query: Record<string, unknown> = {}) {
		const normalizedPath = this.normalizePath(path);
		const url = new URL(`${this.baseUrl}/api/${normalizedPath}`);

		Object.entries(query).forEach(([key, value]) => {
			if (value == null) return;
			url.searchParams.append(key, ['with'].includes(key) ? JSON.stringify(value) : String(value));
		});

		return url.toString();
	}

	beforeSend(hook: HookOptions['beforeSend']) {
		this.hooks.beforeSend = hook;
		return this;
	}

	afterSend(hook: HookOptions['afterSend']) {
		this.hooks.afterSend = hook;
		return this;
	}

	async executeRequest(request: Request) {
		if (this.hooks.beforeSend) {
			request = await this.hooks.beforeSend({ request });
		}

		const response = await fetch(request);
		let data;
		try {
			data = await response.json();
		} catch {
			data = { message: 'Internal Server Error' };
		}

		if (this.hooks.afterSend) {
			return this.hooks.afterSend({ request, response, data });
		}

		return data;
	}
}
