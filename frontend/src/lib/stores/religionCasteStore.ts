import { writable, derived } from 'svelte/store';
import type { ReligionCasteMapping } from '$lib/data/religionCasteData';

const API_BASE_URL = 'https://deploy-node-omega.vercel.app/api';

interface ReligionCasteState {
  data: ReligionCasteMapping[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

// Create the store
function createReligionCasteStore() {
  const { subscribe, set } = writable<ReligionCasteState>({
    data: [],
    loading: false,
    error: null,
    loaded: false
  });

  return {
    subscribe,

    // Fetch all religion-caste data from API
    async fetchData() {
      // Check if already loaded
      let currentState: ReligionCasteState = { data: [], loading: false, error: null, loaded: false };
      const unsubscribe = subscribe(state => { currentState = state; });
      unsubscribe();

      if (currentState.loaded && currentState.data.length > 0) {
        return;
      }

      set({ data: [], loading: true, error: null, loaded: false });

      try {
        const response = await fetch(`${API_BASE_URL}/religions`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const religions = result.data || result;

        // Fetch castes for each religion in parallel
        const dataPromises = religions.map(async (religion: string) => {
          const casteResponse = await fetch(`${API_BASE_URL}/religions/${encodeURIComponent(religion)}/castes`);
          const casteResult = await casteResponse.json();
          const castes = casteResult.data || casteResult;

          return {
            religion,
            castes
          };
        });

        const data = await Promise.all(dataPromises);

        set({
          data,
          loading: false,
          error: null,
          loaded: true
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch religion-caste data';
        set({
          data: [],
          loading: false,
          error: errorMessage,
          loaded: false
        });
        console.error('Failed to load religion-caste data:', error);
      }
    },

    // Reset the store
    reset() {
      set({
        data: [],
        loading: false,
        error: null,
        loaded: false
      });
    }
  };
}

export const religionCasteStore = createReligionCasteStore();

// Derived stores for easy access
export const religions = derived(
  religionCasteStore,
  $store => $store.data.map(item => item.religion)
);

export const getCastesByReligion = (religion: string) => {
  return derived(
    religionCasteStore,
    $store => {
      const mapping = $store.data.find(item => item.religion === religion);
      return mapping ? mapping.castes : [];
    }
  );
};

// Helper function to get castes synchronously (for use in components)
export function getCastesForReligion(religion: string, data: ReligionCasteMapping[]): string[] {
  const mapping = data.find(item => item.religion === religion);
  return mapping ? mapping.castes : [];
}
