<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { religionCasteStore, getCastesForReligion } from '$lib/stores/religionCasteStore';

  export let filterReligion: string = '';
  export let filterCaste: string = '';

  const dispatch = createEventDispatcher<{
    filter: { religion: string; caste: string };
    clear: void;
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
    if (filterReligion && $religionCasteStore.data.length > 0) {
      availableCastes = getCastesForReligion(filterReligion, $religionCasteStore.data);
    } else {
      availableCastes = [];
      filterCaste = '';
    }
  }

  function handleFilter() {
    if (filterReligion || filterCaste) {
      dispatch('filter', { religion: filterReligion, caste: filterCaste });
    }
  }

  function handleClear() {
    filterReligion = '';
    filterCaste = '';
    dispatch('clear');
  }

  function handleReligionChange() {
    // Auto-apply filter when religion changes
    handleFilter();
  }

  function handleCasteChange() {
    // Auto-apply filter when caste changes
    handleFilter();
  }
</script>

<div class="filter-container">
  <div class="filter-header">
    <h3 class="filter-title">Filter by Religion & Caste</h3>
    {#if filterReligion || filterCaste}
      <button on:click={handleClear} class="clear-button">
        Clear Filters
      </button>
    {/if}
  </div>

  <div class="filter-controls">
    <!-- Religion Dropdown -->
    <div class="form-group">
      <label for="filter-religion" class="form-label">Religion</label>
      <select
        id="filter-religion"
        bind:value={filterReligion}
        on:change={handleReligionChange}
        class="form-select"
        disabled={$religionCasteStore.loading}
      >
        <option value="">All Religions</option>
        {#each $religionCasteStore.data.map(item => item.religion) as religion}
          <option value={religion}>{religion}</option>
        {/each}
      </select>
    </div>

    <!-- Caste Dropdown -->
    <div class="form-group">
      <label for="filter-caste" class="form-label">Caste</label>
      <select
        id="filter-caste"
        bind:value={filterCaste}
        on:change={handleCasteChange}
        class="form-select"
        disabled={!filterReligion || availableCastes.length === 0}
      >
        <option value="">All Castes</option>
        {#each availableCastes as caste}
          <option value={caste}>{caste}</option>
        {/each}
      </select>
      {#if !filterReligion}
        <p class="help-text">Select a religion first</p>
      {/if}
    </div>
  </div>

  {#if filterReligion || filterCaste}
    <div class="active-filters">
      <span class="filter-label">Active filters:</span>
      {#if filterReligion}
        <span class="filter-tag">
          Religion: {filterReligion}
          <button on:click={() => { filterReligion = ''; handleClear(); }} class="remove-tag">×</button>
        </span>
      {/if}
      {#if filterCaste}
        <span class="filter-tag">
          Caste: {filterCaste}
          <button on:click={() => { filterCaste = ''; handleFilter(); }} class="remove-tag">×</button>
        </span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .filter-container {
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .filter-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .clear-button {
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    color: #374151;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .clear-button:hover {
    background-color: #e5e7eb;
  }

  .filter-controls {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .filter-controls {
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

  .help-text {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
    font-style: italic;
  }

  .active-filters {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  .filter-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }

  .filter-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    background-color: #dbeafe;
    color: #1e40af;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .remove-tag {
    background: none;
    border: none;
    color: #1e40af;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .remove-tag:hover {
    background-color: #bfdbfe;
  }
</style>
