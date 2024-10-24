/**
 * Upload image to IMGBB API
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 * @throws {Error} - If the upload fails
 * @example
 * const url = await uploadImage(file);
 * console.log(url);
 */

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB API key is not defined");
  }
  formData.append("key", apiKey);

  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.data.url;
}
