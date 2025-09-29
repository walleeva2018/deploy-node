<script lang="ts">
	import { toasts, removeToast, type Toast } from '$lib/stores/toast';
	import { slide } from 'svelte/transition';

	function getToastClasses(type: Toast['type']) {
		const baseClasses = 'p-4 rounded-md shadow-lg border flex items-center gap-3 min-w-72 max-w-md';

		switch (type) {
			case 'success':
				return `${baseClasses} bg-green-50 text-green-800 border-green-200`;
			case 'error':
				return `${baseClasses} bg-red-50 text-red-800 border-red-200`;
			case 'info':
			default:
				return `${baseClasses} bg-blue-50 text-blue-800 border-blue-200`;
		}
	}

	function getIconSvg(type: Toast['type']) {
		switch (type) {
			case 'success':
				return `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
				</svg>`;
			case 'error':
				return `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
				</svg>`;
			case 'info':
			default:
				return `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
				</svg>`;
		}
	}
</script>

{#if $toasts.length > 0}
	<div class="fixed top-4 right-4 z-50 space-y-2">
		{#each $toasts as toast (toast.id)}
			<div
				transition:slide={{ duration: 300 }}
				class={getToastClasses(toast.type)}
			>
				<div class="flex-shrink-0">
					{@html getIconSvg(toast.type)}
				</div>
				<div class="flex-1">
					{toast.message}
				</div>
				<button
					on:click={() => removeToast(toast.id)}
					class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
				>
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}