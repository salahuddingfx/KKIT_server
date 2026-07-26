const cloudinary = require("cloudinary").v2;
const env = require("../../config/env");

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Detect resource type from mimetype
 */
const getResourceType = (mimetype) => {
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "video"; // Cloudinary treats audio as video resource_type
  if (mimetype === "application/pdf" || mimetype.includes("word")) return "raw";
  return "image";
};

/**
 * Upload a single file to Cloudinary
 */
const uploadFile = async (file, folder = "kkit", resourceType = "auto") => {
  const b64 = file.buffer.toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;

  const detectedType = resourceType === "auto" ? getResourceType(file.mimetype) : resourceType;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder,
    resource_type: detectedType,
    // For videos: auto-generate a thumbnail
    ...(detectedType === "video" ? { eager: [{ format: "jpg", width: 640, height: 360, crop: "fill" }] } : {}),
  });

  const response = {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    resourceType: result.resource_type,
    bytes: result.bytes,
  };

  // Attach video thumbnail if available
  if (result.eager && result.eager.length > 0) {
    response.thumbnail = result.eager[0].secure_url;
  }

  return response;
};

/**
 * Upload multiple files to Cloudinary
 */
const uploadMultiple = async (files, folder = "kkit") => {
  const uploads = files.map((file) => uploadFile(file, folder));
  return Promise.all(uploads);
};

/**
 * Delete a file from Cloudinary by publicId
 */
const deleteFile = async (publicId, resourceType = "auto") => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

/**
 * Delete multiple files
 */
const deleteMultiple = async (publicIds) => {
  return cloudinary.api.delete_resources(publicIds);
};

module.exports = { uploadFile, uploadMultiple, deleteFile, deleteMultiple, cloudinary };
