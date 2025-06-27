import dayjs from 'dayjs';
export const d = dayjs;

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



export function resource<T, P>(
  fn: (params: P, options: { data: T | undefined, signal: AbortSignal }) => Promise<T>,
  params: () => P,
  options = { lazy: false, debounce: 300 }
) {
  let abortController: AbortController | null = null;
  let current = $state<T>();
  let loading = $state<boolean>(false);
  let error = $state<Error | null>(null);
  let query = $state(params())
  let source = $state(params())

  $effect(() => {
    ($state.snapshot(query));
    source = query;
    refresh()
  })
  $effect(() => {
    source = params();
    refresh()
  })

  const refresh = debounce(refetch, options.debounce);

  async function refetch() {
    console.log('refresh')
    if (options.lazy) {
      options.lazy = false
      return;
    }

    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    loading = true;
    error = null;

    fn(source, { data: current, signal: abortController.signal })
      .then((result) => {
        current = result;
        loading = false;
      })
      .catch((err) => {
        error = err;
      });
  }

  return {
    get current() {
      return current;
    },
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    get query() {
      return query;
    },
    set query(value) {
      query = value
    },
    refresh
  };
}