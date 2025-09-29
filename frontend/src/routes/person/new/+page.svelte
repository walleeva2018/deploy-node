<script lang="ts">
	import { goto } from '$app/navigation';
	import { PersonAPI, type PersonFormData } from '$lib/api/person';
	import { addToast } from '$lib/stores/toast';
	import PersonForm from '$lib/components/PersonForm.svelte';

	async function handleSubmit(event: CustomEvent<PersonFormData>) {
		const formData = event.detail;

		try {
			await PersonAPI.create(formData);
			addToast('Person created successfully', 'success');
			goto('/');
		} catch (error) {
			addToast('Failed to create person', 'error');
		}
	}

	function handleCancel() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Add New Person - Person Manager</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Add New Person</h1>
		<p class="text-gray-600 mt-1">Create a new person record</p>
	</div>

	<div class="bg-white shadow-sm rounded-lg p-6">
		<PersonForm
			on:submit={handleSubmit}
			on:cancel={handleCancel}
			submitLabel="Create Person"
		/>
	</div>
</div>