const sharp = require('sharp');

/**
 * Process base64 image: resize to 300x300 and convert to JPEG
 * @param {string} base64Image - Base64 encoded image string
 * @returns {Promise<string>} - Processed base64 encoded JPEG image
 */
async function processImage(base64Image) {
  try {
    // If no image provided, return null
    if (!base64Image) {
      return null;
    }

    // Remove data URL prefix if present (data:image/png;base64,)
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Process image with Sharp: resize to 300x300 and convert to JPEG
    const processedBuffer = await sharp(imageBuffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 85,
        mozjpeg: true
      })
      .toBuffer();

    // Convert back to base64
    const processedBase64 = processedBuffer.toString('base64');

    // Return with data URL prefix for JPEG
    return `data:image/jpeg;base64,${processedBase64}`;

  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

module.exports = { processImage };
