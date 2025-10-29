<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PersonAPI, type Person } from '$lib/api/person';
	import { addToast } from '$lib/stores/toast';

	let person: Person | null = null;
	let loading = true;
	let error = '';

	$: id = $page.params.id;

	onMount(async () => {
		if (id) {
			await loadPerson(id);
		}
	});

	async function loadPerson(personId: string) {
		try {
			loading = true;
			error = '';
			person = await PersonAPI.getById(personId);
		} catch (err) {
			error = 'Failed to load person details';
			addToast('Failed to load person details', 'error');
		} finally {
			loading = false;
		}
	}

	async function handleDelete() {
		if (!person?._id || !confirm('Are you sure you want to delete this person?')) return;

		try {
			await PersonAPI.delete(person._id);
			addToast('Person deleted successfully', 'success');
			goto('/');
		} catch (err) {
			addToast('Failed to delete person', 'error');
		}
	}
</script>

<svelte:head>
	<title>{person ? `${person.firstName} ${person.lastName} - Person Manager` : 'Loading... - Person Manager'}</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
	<div class="mb-6">
		<nav class="flex mb-4">
			<a
				href="/"
				class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
			>
				<svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Back to Home
			</a>
		</nav>

		{#if person}
			<h1 class="text-3xl font-bold text-gray-900">{person.firstName} {person.lastName}</h1>
			<p class="text-gray-600 mt-1">Person Details</p>
		{/if}
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
			<p class="font-medium">Error loading person</p>
			<p class="text-sm mt-1">{error}</p>
			<button
				on:click={() => id && loadPerson(id)}
				class="mt-2 text-red-800 hover:text-red-900 font-medium text-sm underline"
			>
				Try again
			</button>
		</div>
	{:else if person}
		<div class="bg-white shadow-sm rounded-lg p-8">
			<div class="flex items-center space-x-4 mb-8">
				{#if person.image}
					<img
						src={person.image}
						alt="{person.firstName} {person.lastName}"
						class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
					/>
				{:else}
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
						<span class="text-blue-600 font-bold text-2xl">
							{person.firstName.charAt(0).toUpperCase()}
						</span>
					</div>
				{/if}
				<div>
					<h2 class="text-2xl font-bold text-gray-900">{person.firstName} {person.lastName}</h2>
					<p class="text-gray-600">{person.phone}</p>
				</div>
			</div>

			<div class="space-y-6 mb-8">
				<div>
					<div class="block text-sm font-medium text-gray-700 mb-2">Email Address</div>
					<div class="flex items-center p-3 bg-gray-50 rounded-md">
						<svg class="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
						</svg>
						<span class="text-gray-900">{person.email}</span>
					</div>
				</div>

				<div>
					<div class="block text-sm font-medium text-gray-700 mb-2">Phone Number</div>
					<div class="flex items-center p-3 bg-gray-50 rounded-md">
						<svg class="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
						</svg>
						<span class="text-gray-900">{person.phone}</span>
					</div>
				</div>

				{#if person.religion || person.caste}
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">Religion & Caste</div>
						<div class="flex items-center p-3 bg-gray-50 rounded-md">
							<svg class="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
							<span class="text-gray-900">
								{#if person.religion}{person.religion}{/if}{#if person.religion && person.caste} - {/if}{#if person.caste}{person.caste}{/if}
							</span>
						</div>
					</div>
				{/if}

				{#if person.address && (person.address.street || person.address.city || person.address.state || person.address.country)}
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">Address</div>
						<div class="flex items-start p-3 bg-gray-50 rounded-md">
							<svg class="w-5 h-5 mr-3 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<div class="text-gray-900">
								{#if person.address.street}
									<div>{person.address.street}</div>
								{/if}
								<div>
									{#if person.address.city}{person.address.city}{/if}{#if person.address.city && (person.address.state || person.address.zipCode)}, {/if}{#if person.address.state}{person.address.state}{/if}{#if person.address.zipCode} {person.address.zipCode}{/if}
								</div>
								{#if person.address.country}
									<div>{person.address.country}</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="flex space-x-3">
				<a
					href="/person/{person._id}/edit"
					class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
				>
					Edit Person
				</a>
				<button
					on:click={handleDelete}
					class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
				>
					Delete Person
				</button>
			</div>
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-500">Person not found</p>
			<a href="/" class="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block">
				Go back home
			</a>
		</div>
	{/if}
</div>