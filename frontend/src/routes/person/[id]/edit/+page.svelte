<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PersonAPI, type Person, type PersonFormData } from '$lib/api/person';
	import { addToast } from '$lib/stores/toast';
	import PersonForm from '$lib/components/PersonForm.svelte';

	let person: Person | null = null;
	let loading = true;
	let updating = false;
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

	async function handleSubmit(event: CustomEvent<PersonFormData>) {
		if (!person?._id) return;

		const formData = event.detail;

		try {
			updating = true;
			const updatedPerson = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone,
				address: {
					street: formData.street || '',
					city: formData.city || '',
					state: formData.state || '',
					zipCode: formData.zipCode || '',
					country: formData.country || ''
				},
				religion: formData.religion || '',
				caste: formData.caste || ''
			};
			await PersonAPI.update(person._id, updatedPerson);
			addToast('Person updated successfully', 'success');
			goto(`/person/${person._id}`);
		} catch (error) {
			addToast('Failed to update person', 'error');
		} finally {
			updating = false;
		}
	}

	function handleCancel() {
		if (person?._id) {
			goto(`/person/${person._id}`);
		} else {
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>{person ? `Edit ${person.firstName} ${person.lastName} - Person Manager` : 'Loading... - Person Manager'}</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
	<div class="mb-6">
		<nav class="flex mb-4">
			<a
				href={person ? `/person/${person._id}` : '/'}
				class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
			>
				<svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Back to Details
			</a>
		</nav>

		<h1 class="text-2xl font-bold text-gray-900">Edit Person</h1>
		{#if person}
			<p class="text-gray-600 mt-1">Update {person.firstName} {person.lastName}'s information</p>
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
		<div class="bg-white shadow-sm rounded-lg p-6">
			<PersonForm
				{person}
				loading={updating}
				on:submit={handleSubmit}
				on:cancel={handleCancel}
				submitLabel="Update Person"
			/>
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