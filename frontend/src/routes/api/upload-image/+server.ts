import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processImage, validateImageFile } from '$lib/utils/imageProcessor';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('image') as File;

		if (!file) {
			return json({ error: 'No file uploaded' }, { status: 400 });
		}

		// Validate the image file
		try {
			validateImageFile(file);
		} catch (error) {
			return json(
				{ error: error instanceof Error ? error.message : 'Invalid file' },
				{ status: 400 }
			);
		}

		// Process the image (resize to 300x300, convert to JPEG)
		const processedImage = await processImage(file);

		return json({
			success: true,
			image: processedImage
		});
	} catch (error) {
		console.error('Image upload error:', error);
		return json(
			{
				error: error instanceof Error ? error.message : 'Failed to process image'
			},
			{ status: 500 }
		);
	}
};
