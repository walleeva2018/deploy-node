import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'info';
	message: string;
	timeout?: number;
}

export const toasts = writable<Toast[]>([]);

let toastId = 0;

export function addToast(message: string, type: Toast['type'] = 'info', timeout = 4000) {
	const id = String(++toastId);
	const toast: Toast = { id, type, message, timeout };

	toasts.update((all) => [toast, ...all]);

	if (timeout) {
		setTimeout(() => removeToast(id), timeout);
	}

	return id;
}

export function removeToast(id: string) {
	toasts.update((all) => all.filter((t) => t.id !== id));
}