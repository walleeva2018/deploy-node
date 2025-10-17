<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { religionCasteStore, getCastesForReligion } from '$lib/stores/religionCasteStore';

  export let selectedReligion: string = '';
  export let selectedCaste: string = '';
  export let religionError: string = '';
  export let casteError: string = '';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher<{
    religionChange: string;
    casteChange: string;
  }>();

  let availableCastes: string[] = [];

  // Load religion-caste data on mount
  onMount(async () => {
    try {
      await religionCasteStore.fetchData();
    } catch (error) {
      console.error('Failed to load religion-caste data:', error);
    }
  });

  // Update available castes when religion changes
  $: {
    if (selectedReligion && $religionCasteStore.data.length > 0) {
      availableCastes = getCastesForReligion(selectedReligion, $religionCasteStore.data);
      // Reset caste if it's not valid for the new religion
      if (selectedCaste && !availableCastes.includes(selectedCaste)) {
        selectedCaste = '';
        dispatch('casteChange', selectedCaste);
      }
    } else {
      availableCastes = [];
      if (!selectedReligion) {
        selectedCaste = '';
      }
    }
  }

  function handleReligionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedReligion = target.value;
    dispatch('religionChange', selectedReligion);
  }

  function handleCasteChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedCaste = target.value;
    dispatch('casteChange', selectedCaste);
  }
</script>

<div class="religion-caste-container">
  <!-- Religion Dropdown -->
  <div class="form-group">
    <label for="religion" class="form-label">
      Religion
    </label>
    <select
      id="religion"
      bind:value={selectedReligion}
      on:change={handleReligionChange}
      class="form-select"
      class:error={religionError}
      disabled={disabled || $religionCasteStore.loading}
    >
      <option value="">
        {$religionCasteStore.loading ? 'Loading...' : 'Select a Religion'}
      </option>
      {#each $religionCasteStore.data.map(item => item.religion) as religion}
        <option value={religion}>{religion}</option>
      {/each}
    </select>
    {#if religionError}
      <p class="error-message">{religionError}</p>
    {/if}
    {#if $religionCasteStore.error}
      <p class="error-message">{$religionCasteStore.error}</p>
    {/if}
  </div>

  <!-- Caste Dropdown -->
  <div class="form-group">
    <label for="caste" class="form-label">
      Caste
    </label>
    <select
      id="caste"
      bind:value={selectedCaste}
      on:change={handleCasteChange}
      class="form-select"
      class:error={casteError}
      disabled={disabled || !selectedReligion}
    >
      <option value="">Select a Caste</option>
      {#each availableCastes as caste}
        <option value={caste}>{caste}</option>
      {/each}
    </select>
    {#if casteError}
      <p class="error-message">{casteError}</p>
    {/if}
    {#if !selectedReligion}
      <p class="help-text">Please select a religion first</p>
    {/if}
  </div>
</div>

<style>
  .religion-caste-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .religion-caste-container {
      grid-template-columns: 1fr 1fr;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .form-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background-color: white;
    transition: all 0.2s;
  }

  .form-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-select:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .form-select.error {
    border-color: #ef4444;
  }

  .form-select.error:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin: 0;
  }

  .help-text {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
    font-style: italic;
  }
</style>
