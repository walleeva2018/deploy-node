<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Person } from '$lib/api/person';

	export let person: Person;

	const dispatch = createEventDispatcher<{
		delete: void;
	}>();

	function handleDelete() {
		dispatch('delete');
	}
</script>

<div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
	<div class="p-6">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center space-x-3">
				<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
					<span class="text-blue-600 font-medium text-lg">
						{person.firstName.charAt(0).toUpperCase()}
					</span>
				</div>
				<div>
					<h3 class="text-lg font-medium text-gray-900">{person.firstName} {person.lastName}</h3>
					<p class="text-sm text-gray-500">{person.phone}</p>
				</div>
			</div>
		</div>

		<div class="space-y-2 mb-6">
			<div class="flex items-center text-gray-600">
				<svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
				</svg>
				<span class="text-sm">{person.email}</span>
			</div>
			{#if person.religion || person.caste}
				<div class="flex items-center text-gray-600">
					<svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
					<span class="text-sm">
						{#if person.religion}{person.religion}{/if}{#if person.religion && person.caste} - {/if}{#if person.caste}{person.caste}{/if}
					</span>
				</div>
			{/if}
			{#if person.address?.city || person.address?.state}
				<div class="flex items-center text-gray-600">
					<svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<span class="text-sm">
						{#if person.address?.city}{person.address.city}{/if}{#if person.address?.city && person.address?.state}, {/if}{#if person.address?.state}{person.address.state}{/if}
					</span>
				</div>
			{/if}
		</div>

		<div class="flex items-center justify-between space-x-2">
			<a
				href="/person/{person._id}"
				class="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
			>
				View Details
			</a>
			<a
				href="/person/{person._id}/edit"
				class="flex-1 text-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
			>
				Edit
			</a>
			<button
				on:click={handleDelete}
				class="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
			>
				Delete
			</button>
		</div>
	</div>
</div>