const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ApiError = require("../utils/apiError");

const UPLOAD_DIR = path.join(__dirname, "../public/uploads");

const STANDARD_SUBFOLDERS = ["users", "courses", "team", "blogs", "payments", "portfolio", "others"];

STANDARD_SUBFOLDERS.forEach((sub) => {
  const dirPath = path.join(UPLOAD_DIR, sub);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Disk Storage with dynamic subfolder destination
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = (req.body && req.body.folder) || (req.query && req.query.folder) || "others";
    if (folder === "uploads" || folder === "upload") folder = "others";
    folder = folder.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!folder) folder = "others";

    const targetDir = path.join(UPLOAD_DIR, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    file.subfolder = folder;
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Memory Storage (for buffer processing if needed)
const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg|avif|ico/;
  const allowedDocTypes = /pdf|doc|docx|txt/;
  const allowedVideoTypes = /mp4|webm|ogg|quicktime/;
  const allowedAudioTypes = /mp3|wav|ogg|m4a/;

  const extname = path.extname(file.originalname).toLowerCase().replace(".", "");
  const mimetype = file.mimetype;

  if (
    allowedImageTypes.test(extname) || allowedImageTypes.test(mimetype) ||
    allowedDocTypes.test(extname) || mimetype === "application/pdf" || mimetype.includes("word") ||
    allowedVideoTypes.test(extname) || allowedVideoTypes.test(mimetype) ||
    allowedAudioTypes.test(extname) || allowedAudioTypes.test(mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only images, videos, audio, PDFs, and documents are allowed"));
  }
};

const uploadDisk = multer({
  storage: diskStorage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

const uploadMemory = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

const uploadSingle = (fieldName = "file") => (req, res, next) => {
  uploadDisk.single(fieldName)(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

const uploadMultiple = (fieldName = "files", maxCount = 10) => (req, res, next) => {
  uploadDisk.array(fieldName, maxCount)(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

const uploadAny = () => (req, res, next) => {
  uploadDisk.any()(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

module.exports = {
  upload: uploadDisk,
  uploadMemory,
  uploadSingle,
  uploadMultiple,
  uploadAny,
  UPLOAD_DIR,
};
