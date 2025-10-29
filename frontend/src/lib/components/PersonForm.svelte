<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Person, PersonFormData } from '$lib/api/person';
	import type { ReligionCasteMapping } from '$lib/api/religion';
	import ReligionCaste from './ReligionCaste.svelte';
	import ImageUpload from './ImageUpload.svelte';

	export let person: Person | null = null;
	export let submitLabel = 'Submit';
	export let loading = false;
	export let religionCasteData: ReligionCasteMapping[] = [];

	const dispatch = createEventDispatcher<{
		submit: PersonFormData;
		cancel: void;
	}>();

	let formData = {
		firstName: person?.firstName || '',
		lastName: person?.lastName || '',
		email: person?.email || '',
		phone: person?.phone || '',
		street: person?.address?.street || '',
		city: person?.address?.city || '',
		state: person?.address?.state || '',
		zipCode: person?.address?.zipCode || '',
		country: person?.address?.country || '',
		religion: person?.religion || '',
		caste: person?.caste || '',
		image: person?.image || ''
	};

	let errors: Record<string, string> = {};

	function validateForm() {
		errors = {};

		if (!formData.firstName.trim()) {
			errors.firstName = 'First name is required';
		}

		if (!formData.lastName.trim()) {
			errors.lastName = 'Last name is required';
		}

		if (!formData.email.trim()) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = 'Please enter a valid email address';
		}

		if (!formData.phone.trim()) {
			errors.phone = 'Phone number is required';
		}

		return Object.keys(errors).length === 0;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		dispatch('submit', {
			firstName: formData.firstName.trim(),
			lastName: formData.lastName.trim(),
			email: formData.email.trim(),
			phone: formData.phone.trim(),
			street: formData.street.trim() || undefined,
			city: formData.city.trim() || undefined,
			state: formData.state.trim() || undefined,
			zipCode: formData.zipCode.trim() || undefined,
			country: formData.country.trim() || undefined,
			religion: formData.religion.trim() || undefined,
			caste: formData.caste.trim() || undefined,
			image: formData.image || undefined
		});
	}

	function handleCancel() {
		dispatch('cancel');
	}
</script>

<form on:submit={handleSubmit} class="space-y-6 w-full">
	<!-- Profile Image Upload -->
	<div class="border-b pb-6">
		<ImageUpload
			currentImage={formData.image}
			disabled={loading}
			on:imageChange={(e) => formData.image = e.detail}
		/>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
				First Name *
			</label>
			<input
				type="text"
				id="firstName"
				name="firstName"
				bind:value={formData.firstName}
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				class:border-red-300={errors.firstName}
				class:focus:ring-red-500={errors.firstName}
				class:focus:border-red-500={errors.firstName}
				placeholder="Enter first name"
				required
			/>
			{#if errors.firstName}
				<p class="mt-1 text-sm text-red-600">{errors.firstName}</p>
			{/if}
		</div>

		<div>
			<label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
				Last Name *
			</label>
			<input
				type="text"
				id="lastName"
				name="lastName"
				bind:value={formData.lastName}
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				class:border-red-300={errors.lastName}
				class:focus:ring-red-500={errors.lastName}
				class:focus:border-red-500={errors.lastName}
				placeholder="Enter last name"
				required
			/>
			{#if errors.lastName}
				<p class="mt-1 text-sm text-red-600">{errors.lastName}</p>
			{/if}
		</div>
	</div>

	<div>
		<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
			Email Address *
		</label>
		<input
			type="email"
			id="email"
			name="email"
			bind:value={formData.email}
			class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			class:border-red-300={errors.email}
			class:focus:ring-red-500={errors.email}
			class:focus:border-red-500={errors.email}
			placeholder="Enter email address"
			required
		/>
		{#if errors.email}
			<p class="mt-1 text-sm text-red-600">{errors.email}</p>
		{/if}
	</div>

	<div>
		<label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
			Phone Number *
		</label>
		<input
			type="tel"
			id="phone"
			name="phone"
			bind:value={formData.phone}
			class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			class:border-red-300={errors.phone}
			class:focus:ring-red-500={errors.phone}
			class:focus:border-red-500={errors.phone}
			placeholder="Enter phone number"
			required
		/>
		{#if errors.phone}
			<p class="mt-1 text-sm text-red-600">{errors.phone}</p>
		{/if}
	</div>

	<div class="border-t pt-4">
		<h4 class="text-sm font-medium text-gray-700 mb-4">Religion & Caste (Optional)</h4>
		<ReligionCaste
			bind:selectedReligion={formData.religion}
			bind:selectedCaste={formData.caste}
			religionError={errors.religion || ''}
			casteError={errors.caste || ''}
			disabled={loading}
			{religionCasteData}
		/>
	</div>

	<div class="border-t pt-4">
		<h4 class="text-sm font-medium text-gray-700 mb-4">Address (Optional)</h4>

		<div class="space-y-4">
			<div>
				<label for="street" class="block text-sm font-medium text-gray-700 mb-2">
					Street Address
				</label>
				<input
					type="text"
					id="street"
					name="street"
					bind:value={formData.street}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Enter street address"
				/>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div>
					<label for="city" class="block text-sm font-medium text-gray-700 mb-2">
						City
					</label>
					<input
						type="text"
						id="city"
						name="city"
						bind:value={formData.city}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="City"
					/>
				</div>

				<div>
					<label for="state" class="block text-sm font-medium text-gray-700 mb-2">
						State
					</label>
					<input
						type="text"
						id="state"
						name="state"
						bind:value={formData.state}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="State"
					/>
				</div>

				<div>
					<label for="zipCode" class="block text-sm font-medium text-gray-700 mb-2">
						ZIP Code
					</label>
					<input
						type="text"
						id="zipCode"
						name="zipCode"
						bind:value={formData.zipCode}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="ZIP"
					/>
				</div>
			</div>

			<div>
				<label for="country" class="block text-sm font-medium text-gray-700 mb-2">
					Country
				</label>
				<input
					type="text"
					id="country"
					name="country"
					bind:value={formData.country}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Country"
				/>
			</div>
		</div>
	</div>

	<div class="flex space-x-3 pt-4">
		<button
			type="submit"
			disabled={loading}
			class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
		>
			{loading ? 'Processing...' : submitLabel}
		</button>
		<button
			type="button"
			on:click={handleCancel}
			disabled={loading}
			class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
		>
			Cancel
		</button>
	</div>
</form>