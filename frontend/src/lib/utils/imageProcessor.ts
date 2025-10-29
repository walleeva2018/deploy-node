import sharp from 'sharp';

/**
 * Process an image file: resize to 300x300 and convert to JPEG
 * @param file - The uploaded image file
 * @returns Base64 encoded processed image
 */
export async function processImage(file: File): Promise<string> {
	try {
		// Convert File to ArrayBuffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Process image with Sharp: resize to 300x300 and convert to JPEG
		const processedBuffer = await sharp(buffer)
			.resize(300, 300, {
				fit: 'cover', // Crop to fill the dimensions
				position: 'center'
			})
			.jpeg({
				quality: 85, // Good quality while keeping file size reasonable
				progressive: true
			})
			.toBuffer();

		// Convert to base64
		const base64 = processedBuffer.toString('base64');
		return `data:image/jpeg;base64,${base64}`;
	} catch (error) {
		console.error('Error processing image:', error);
		throw new Error('Failed to process image');
	}
}

/**
 * Validate image file
 * @param file - The file to validate
 * @returns true if valid, throws error otherwise
 */
export function validateImageFile(file: File): boolean {
	// Check file type
	const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
	if (!validTypes.includes(file.type)) {
		throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
	}

	// Check file size (max 10MB)
	const maxSize = 10 * 1024 * 1024; // 10MB in bytes
	if (file.size > maxSize) {
		throw new Error('File size too large. Maximum size is 10MB.');
	}

	return true;
}
