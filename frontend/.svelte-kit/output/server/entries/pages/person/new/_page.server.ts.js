import { R as ReligionAPI } from "../../../../chunks/religion.js";
const load = async () => {
  try {
    const religionCasteData = await ReligionAPI.getAllReligionsWithCastes();
    return {
      religionCasteData
    };
  } catch (error) {
    console.error("Failed to load religion/caste data:", error);
    return {
      religionCasteData: []
    };
  }
};
export {
  load
};
