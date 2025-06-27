import { createId } from '.';
import { PersistedState } from 'runed';

export type Alert = {
	id?: string;
	message: string;
	error: any;
	type?: 'success' | 'error' | 'warning';
	timeout?: number;
	pause: () => void;
	start: () => void;
	clear: () => void;
};
type App = {
	sidebar: boolean;
	loading: boolean;
	theme: 'light' | 'dark' | 'cupcake';
	alerts: Alert[];
};

// export const app = new PersistedState<App>('app', {
// 	sidebar: true,
// 	loading: false,
// 	theme: 'cupcake',
// 	alerts: []
// });

export const app: { current: App } = $state({
	current: {
		sidebar: true,
		loading: false,
		theme: 'light',
		alerts: []
	}
});

export const alert = ({ message, error, type = 'success', timeout = -1 }: Partial<Alert>) => {
	let timeoutId: ReturnType<typeof setTimeout>;

	const alert = {
		id: createId(),
		message,
		error,
		type,
		timeout,
		clear: () => {
			app.current.alerts = app.current.alerts.filter((a) => a.id !== alert.id);
		},
		start: () => {
			if (timeout < 0) timeout = 100000;
			timeoutId = setTimeout(alert.clear, timeout);
		},
		pause: () => {
			clearTimeout(timeoutId);
		}
	} as Alert;

	alert.start();

	app.current.alerts = [alert, ...app.current.alerts];

	return alert;
};
