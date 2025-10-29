import { ReligionAPI, type ReligionCasteMapping } from '$lib/api/religion';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const religionCasteData = await ReligionAPI.getAllReligionsWithCastes();

		return {
			religionCasteData
		};
	} catch (error) {
		console.error('Failed to load religion/caste data:', error);
		// Return empty data on error - component can handle this gracefully
		return {
			religionCasteData: [] as ReligionCasteMapping[]
		};
	}
};
