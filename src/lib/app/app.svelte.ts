import { createId } from '.';

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
	theme: 'light' | 'dark';
	alerts: Alert[];
};
export const app: App = $state({
	sidebar: true,
	loading: false,
	theme: 'light',
	alerts: []
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
			app.alerts = app.alerts.filter((a) => a.id !== alert.id);
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

	app.alerts = [alert, ...app.alerts];

	return alert;
};
