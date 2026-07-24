// middleware/upload.js

import multer from "multer";
import path from "path";
import fs from "fs";

// ======================================================
// CREATE UPLOADS FOLDER IF NOT EXISTS
// ======================================================

const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// ======================================================
// STORAGE CONFIGURATION
// ======================================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName +
        path.extname(file.originalname)
    );
  },
});

// ======================================================
// ALLOWED FILE TYPES
// ======================================================

const allowedMimeTypes = [

  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",

  // PDF
  "application/pdf",
];

// ======================================================
// FILE FILTER
// ======================================================

const fileFilter = (
  req,
  file,
  cb
) => {

  try {

    // OPTIONAL FILE SUPPORT
    if (!file) {
      return cb(null, true);
    }

    // MIME TYPE VALIDATION
    if (
      allowedMimeTypes.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      console.warn(
        "❌ Invalid file type:",
        file.mimetype
      );

      cb(
        new Error(
          "Only JPG, JPEG, PNG and PDF files are allowed"
        ),
        false
      );
    }

  } catch (error) {

    console.error(
      "UPLOAD_FILE_FILTER_ERROR:",
      error.message
    );

    cb(error, false);
  }
};

// ======================================================
// MULTER CONFIG
// ======================================================

const upload = multer({

  storage,

  fileFilter,

  limits: {

    // 10MB
    fileSize:
      10 * 1024 * 1024,
  },
});

export default upload;