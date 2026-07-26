const fs = require("fs");
const path = require("path");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/apiError");
const env = require("../../config/env");
const { uploadFile, uploadMultiple: uploadCloudinaryMultiple, deleteFile: deleteCloudinaryFile } = require("../../services/upload/cloudinary.service");

const getFileUrl = (req, filename, subfolder) => {
  const protocol = req.protocol || "http";
  const host = req.get("host") || `localhost:${env.PORT || 5000}`;
  const folderPath = subfolder ? `${subfolder}/` : "";
  return `${protocol}://${host}/uploads/${folderPath}${filename}`;
};

/**
 * POST /upload/single
 * Upload a single file (image, video, audio, PDF, document)
 */
const uploadSingle = catchAsync(async (req, res) => {
  const file = req.file || (req.files && req.files[0]);
  if (!file) {
    throw new ApiError(400, "No image or file uploaded");
  }

  // If file was saved to disk via Multer diskStorage
  if (file.filename) {
    const subfolder = file.subfolder || req.body.folder || "others";
    const url = getFileUrl(req, file.filename, subfolder);
    const relPath = `/uploads/${subfolder}/${file.filename}`;
    return res.status(200).json({
      success: true,
      data: {
        url,
        path: relPath,
        folder: subfolder,
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  }

  // Cloudinary fallback if memory buffer
  const folder = req.body.folder || "kkit";
  const result = await uploadFile(file, folder);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * POST /upload/multiple
 * Upload multiple files (max 10)
 */
const uploadMultipleFiles = catchAsync(async (req, res) => {
  const files = req.files || [];
  if (!files || files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  const results = files.map((file) => {
    if (file.filename) {
      const subfolder = file.subfolder || req.body.folder || "others";
      return {
        url: getFileUrl(req, file.filename, subfolder),
        path: `/uploads/${subfolder}/${file.filename}`,
        folder: subfolder,
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      };
    }
    return file;
  });

  res.status(200).json({
    success: true,
    data: results,
  });
});

/**
 * DELETE /upload/:filename
 * Delete a file locally or from Cloudinary
 */
const deleteSingle = catchAsync(async (req, res) => {
  const { filename } = req.params;
  const folder = req.query.folder || req.params.folder;

  let filePath;
  if (folder) {
    filePath = path.join(__dirname, "../../public/uploads", folder, filename);
  } else {
    filePath = path.join(__dirname, "../../public/uploads", filename);
    if (!fs.existsSync(filePath)) {
      const subfolders = ["users", "courses", "team", "blogs", "payments", "portfolio", "others"];
      for (const sub of subfolders) {
        const candidate = path.join(__dirname, "../../public/uploads", sub, filename);
        if (fs.existsSync(candidate)) {
          filePath = candidate;
          break;
        }
      }
    }
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    try {
      await deleteCloudinaryFile(filename, req.query.resourceType || "auto");
    } catch (e) {
      // ignore
    }
  }

  res.status(200).json({
    success: true,
    message: "File deleted successfully",
  });
});

/**
 * POST /upload/delete-multiple
 */
const deleteMultipleFiles = catchAsync(async (req, res) => {
  const { filenames, publicIds } = req.body;
  const list = filenames || publicIds || [];

  list.forEach((item) => {
    const filePath = path.join(__dirname, "../../public/uploads", item);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  res.status(200).json({
    success: true,
    message: "Files deleted successfully",
  });
});

module.exports = { uploadSingle, uploadMultipleFiles, deleteSingle, deleteMultipleFiles };
