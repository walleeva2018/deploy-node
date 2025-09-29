export interface Person {
	_id?: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address?: {
		street?: string;
		city?: string;
		state?: string;
		zipCode?: string;
		country?: string;
	};
	createdAt?: string;
	updatedAt?: string;
}

export interface PersonFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	street?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	country?: string;
}

const API_BASE_URL = 'https://deploy-node-omega.vercel.app/api';

export class PersonAPI {
	static async getAll(): Promise<Person[]> {
		try {
			const response = await fetch(`${API_BASE_URL}/persons`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data.data || data.persons || data;
		} catch (error) {
			console.error('Error fetching persons:', error);
			throw error;
		}
	}

	static async getById(id: string): Promise<Person> {
		try {
			const response = await fetch(`${API_BASE_URL}/persons/${id}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data.data || data.person || data;
		} catch (error) {
			console.error('Error fetching person:', error);
			throw error;
		}
	}

	static async create(person: PersonFormData): Promise<Person> {
		try {
			const payload = {
				firstName: person.firstName,
				lastName: person.lastName,
				email: person.email,
				phone: person.phone,
				address: {
					street: person.street || '',
					city: person.city || '',
					state: person.state || '',
					zipCode: person.zipCode || '',
					country: person.country || ''
				}
			};

			const response = await fetch(`${API_BASE_URL}/persons`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data.data || data.person || data;
		} catch (error) {
			console.error('Error creating person:', error);
			throw error;
		}
	}

	static async update(id: string, person: Partial<Person>): Promise<Person> {
		try {
			const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(person),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data.data || data.person || data;
		} catch (error) {
			console.error('Error updating person:', error);
			throw error;
		}
	}

	static async delete(id: string): Promise<void> {
		try {
			const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error('Error deleting person:', error);
			throw error;
		}
	}
}