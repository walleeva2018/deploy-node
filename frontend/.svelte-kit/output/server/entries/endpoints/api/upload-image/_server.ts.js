import { json } from "@sveltejs/kit";
import sharp from "sharp";
async function processImage(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const processedBuffer = await sharp(buffer).resize(300, 300, {
      fit: "cover",
      // Crop to fill the dimensions
      position: "center"
    }).jpeg({
      quality: 85,
      // Good quality while keeping file size reasonable
      progressive: true
    }).toBuffer();
    const base64 = processedBuffer.toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
}
function validateImageFile(file) {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.");
  }
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size too large. Maximum size is 10MB.");
  }
  return true;
}
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!file) {
      return json({ error: "No file uploaded" }, { status: 400 });
    }
    try {
      validateImageFile(file);
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : "Invalid file" },
        { status: 400 }
      );
    }
    const processedImage = await processImage(file);
    return json({
      success: true,
      image: processedImage
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to process image"
      },
      { status: 500 }
    );
  }
};
export {
  POST
};
