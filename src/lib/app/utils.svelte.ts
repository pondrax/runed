export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// debounce.ts
export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 100): T {
	let timeout: ReturnType<typeof setTimeout>;

	return function (this: unknown, ...args: Parameters<T>) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn.apply(this, args), delay);
	} as T;
}

// throttle.ts
export function throttle<T extends (...args: any[]) => void>(fn: T, delay = 100): T {
	let lastCall = 0;
	let timeout: ReturnType<typeof setTimeout>;

	return function (this: unknown, ...args: Parameters<T>) {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			fn.apply(this, args);
		} else {
			clearTimeout(timeout);
			timeout = setTimeout(() => fn.apply(this, args), delay);
		}
	} as T;
}
