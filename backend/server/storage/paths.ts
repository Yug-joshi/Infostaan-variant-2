import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storageDir = process.env.PDF_STORAGE_DIR || path.resolve(__dirname, '.');

export const PRIVATE_PDF_DIR = path.join(storageDir, 'private_pdfs');
export const COVERS_DIR = path.join(storageDir, 'covers');