const API_BASE_URL = "https://chunia.com:5000";
class ReligionAPI {
  static async getAllReligions() {
    try {
      const response = await fetch(`${API_BASE_URL}/religion`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching religions:", error);
      throw error;
    }
  }
  static async getCastesByReligionId(religionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/caste/${religionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching castes for religion ${religionId}:`, error);
      throw error;
    }
  }
  static async getAllReligionsWithCastes() {
    try {
      const religions = await this.getAllReligions();
      const mappings = await Promise.all(
        religions.map(async (religion) => {
          try {
            const castes = await this.getCastesByReligionId(religion._id);
            return {
              religion: religion.name,
              castes: castes.map((caste) => caste.name)
            };
          } catch (error) {
            console.warn(`Failed to fetch castes for ${religion.name}`);
            return {
              religion: religion.name,
              castes: []
            };
          }
        })
      );
      return mappings;
    } catch (error) {
      console.error("Error fetching religion-caste mappings:", error);
      throw error;
    }
  }
}
export {
  ReligionAPI as R
};
