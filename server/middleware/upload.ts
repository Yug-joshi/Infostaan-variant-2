import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIVATE_PDF_DIR = path.resolve(__dirname, '../storage/private_pdfs');
const COVERS_DIR = path.resolve(__dirname, '../storage/covers');

// Ensure storage directories exist with restricted access
[PRIVATE_PDF_DIR, COVERS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    if (file.fieldname === 'pdfFile') {
      cb(null, PRIVATE_PDF_DIR);
    } else if (file.fieldname === 'coverImage') {
      cb(null, COVERS_DIR);
    } else {
      cb(new Error(`Unexpected field: ${file.fieldname}`), '');
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    cb(null, `${sanitizedBase}_${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.fieldname === 'pdfFile') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type: pdfFile must be an application/pdf'));
    }
  } else if (file.fieldname === 'coverImage') {
    const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedImageMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type: coverImage must be JPEG, PNG, or WebP'));
    }
  } else {
    cb(new Error(`Unknown upload field: ${file.fieldname}`));
  }
};

export const pdfUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max for PDF
    files: 2,
  },
});
