import { writable, derived } from 'svelte/store';
import type { ReligionCasteMapping } from '$lib/data/religionCasteData';

const API_BASE_URL = 'https://chunia.com:5000';

interface Religion {
  _id: string;
  name: string;
}

interface Caste {
  _id: string;
  name: string;
  religionId: string;
}

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
        // Fetch all religions from new API endpoint
        const response = await fetch(`${API_BASE_URL}/religion`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const religions: Religion[] = await response.json();

        // Fetch castes for each religion in parallel
        const dataPromises = religions.map(async (religion: Religion) => {
          const casteResponse = await fetch(`${API_BASE_URL}/caste/${religion._id}`);

          if (!casteResponse.ok) {
            console.warn(`Failed to fetch castes for religion ${religion.name}`);
            return {
              religion: religion.name,
              castes: []
            };
          }

          const castes: Caste[] = await casteResponse.json();

          return {
            religion: religion.name,
            castes: castes.map((caste: Caste) => caste.name)
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
