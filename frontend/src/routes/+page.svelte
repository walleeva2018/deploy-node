<script lang="ts">
	import { onMount } from 'svelte';
	import { PersonAPI, type Person, type PersonFormData } from '$lib/api/person';
	import { addToast } from '$lib/stores/toast';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import PersonForm from '$lib/components/PersonForm.svelte';
	import PersonFilter from '$lib/components/PersonFilter.svelte';

	let persons: Person[] = [];
	let loading = true;
	let error = '';
	let showCreateForm = false;
	let creating = false;
	let searchQuery = '';
	let filterReligion = '';
	let filterCaste = '';
	let isFiltered = false;

	$: filteredPersons = persons.filter(person => {
		if (!searchQuery.trim()) return true;
		const query = searchQuery.toLowerCase();
		return (
			person.firstName.toLowerCase().includes(query) ||
			person.lastName.toLowerCase().includes(query) ||
			person.email.toLowerCase().includes(query) ||
			person.phone.includes(query) ||
			(person.address?.city || '').toLowerCase().includes(query) ||
			(person.address?.state || '').toLowerCase().includes(query)
		);
	});

	onMount(async () => {
		await loadPersons();
	});

	async function loadPersons() {
		try {
			loading = true;
			error = '';
			persons = await PersonAPI.getAll();
			isFiltered = false;
		} catch (err) {
			error = 'Failed to load persons. Please check your internet connection or try again later';
			addToast('Failed to load persons', 'error');
		} finally {
			loading = false;
		}
	}

	async function handleFilter(event: CustomEvent<{ religion: string; caste: string }>) {
		const { religion, caste } = event.detail;

		if (!religion && !caste) {
			await loadPersons();
			return;
		}

		try {
			loading = true;
			error = '';
			filterReligion = religion;
			filterCaste = caste;
			persons = await PersonAPI.filterByReligionCaste(religion, caste);
			isFiltered = true;
			addToast(`Found ${persons.length} person(s)`, 'info');
		} catch (err) {
			error = 'Failed to filter persons';
			addToast('Failed to filter persons', 'error');
		} finally {
			loading = false;
		}
	}

	async function handleClearFilter() {
		filterReligion = '';
		filterCaste = '';
		searchQuery = '';
		await loadPersons();
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this person?')) return;

		try {
			await PersonAPI.delete(id);
			persons = persons.filter(p => p._id !== id);
			addToast('Person deleted successfully', 'success');
		} catch (err) {
			addToast('Failed to delete person', 'error');
		}
	}

	async function handleCreate(event: CustomEvent<PersonFormData>) {
		const formData = event.detail;

		try {
			creating = true;
			const newPerson = await PersonAPI.create(formData);
			persons = [newPerson, ...persons];
			addToast('Person created successfully', 'success');
			showCreateForm = false;
		} catch (error) {
			addToast('Failed to create person', 'error');
		} finally {
			creating = false;
		}
	}

	function handleCancelCreate() {
		showCreateForm = false;
	}

	function toggleCreateForm() {
		showCreateForm = !showCreateForm;
	}
</script>

<svelte:head>
	<title>Person Manager - Home</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Person Manager</h1>
			<p class="text-gray-600 mt-1">Manage your contacts with full CRUD operations</p>
		</div>
		<div class="flex flex-col sm:flex-row gap-3">
			<button
				on:click={toggleCreateForm}
				class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
			>
				{showCreateForm ? 'Cancel' : 'Add New Person'}
			</button>
			<a
				href="/person/new"
				class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
			>
				Full Form
			</a>
		</div>
	</div>

	{#if showCreateForm}
		<div class="bg-white border border-gray-200 rounded-lg shadow-sm max-w-4xl mx-auto">
			<div class="p-4 border-b border-gray-200">
				<h2 class="text-lg font-medium text-gray-900">Add New Person</h2>
				<p class="text-sm text-gray-600">Fill out the form below to add a new person</p>
			</div>
			<div class="p-4">
				<div class="max-w-3xl mx-auto">
					<PersonForm
						loading={creating}
						on:submit={handleCreate}
						on:cancel={handleCancelCreate}
						submitLabel="Create Person"
					/>
				</div>
			</div>
		</div>
	{/if}

	{#if !loading && !showCreateForm}
		<PersonFilter
			bind:filterReligion
			bind:filterCaste
			on:filter={handleFilter}
			on:clear={handleClearFilter}
		/>
	{/if}

	{#if !loading && !showCreateForm && persons.length > 0}
		<div class="bg-white rounded-lg shadow-sm p-4">
			<div class="flex items-center space-x-3">
				<svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search by name, email, phone, or location..."
					class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
				{#if searchQuery}
					<button
						on:click={() => searchQuery = ''}
						class="text-gray-400 hover:text-gray-600"
					>
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
			{#if searchQuery && filteredPersons.length < persons.length}
				<p class="text-sm text-gray-600 mt-2">
					Showing {filteredPersons.length} of {persons.length} people
				</p>
			{/if}
		</div>
	{/if}

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
			<p class="font-medium">Error loading persons</p>
			<p class="text-sm mt-1">{error}</p>
			<button
				on:click={loadPersons}
				class="mt-2 text-red-800 hover:text-red-900 font-medium text-sm underline"
			>
				Try again
			</button>
		</div>
	{:else if persons.length === 0}
		<div class="text-center py-12">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
			<h3 class="mt-2 text-lg font-medium text-gray-900">No persons found</h3>
			<p class="mt-1 text-gray-500">Get started by adding your first person.</p>
			<div class="mt-6">
				<a
					href="/person/new"
					class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
				>
					Add Person
				</a>
			</div>
		</div>
	{:else if persons.length === 0 && isFiltered}
		<div class="text-center py-12">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
			<h3 class="mt-2 text-lg font-medium text-gray-900">No persons found with this filter</h3>
			<p class="mt-1 text-gray-500">
				No persons match {filterReligion}{filterReligion && filterCaste ? ' - ' : ''}{filterCaste}.
			</p>
			<p class="mt-2 text-sm text-gray-600">
				Try adding religion/caste information to existing persons or create new persons with these details.
			</p>
			<div class="mt-6 flex gap-3 justify-center">
				<button
					on:click={handleClearFilter}
					class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					Clear Filter
				</button>
				<button
					on:click={toggleCreateForm}
					class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
				>
					Add New Person
				</button>
			</div>
		</div>
	{:else if filteredPersons.length === 0 && searchQuery}
		<div class="text-center py-12">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<h3 class="mt-2 text-lg font-medium text-gray-900">No matches found</h3>
			<p class="mt-1 text-gray-500">Try adjusting your search terms.</p>
			<button
				on:click={() => searchQuery = ''}
				class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
			>
				Clear search
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredPersons as person (person._id)}
				<PersonCard {person} on:delete={() => handleDelete(person._id || '')} />
			{/each}
		</div>
	{/if}
</div>