import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth.js';
import { pdfUpload } from '../middleware/upload.js';
import {
  uploadPdfHandler,
  getAllPdfsAdminHandler,
  getPdfByIdAdminHandler,
  updatePdfMetadataHandler,
  deletePdfHandler,
} from '../controllers/adminPdfController.js';

const router = Router();

// Protect ALL routes in this router with administrator authorization
router.use(requireAdminAuth);

/**
 * POST /api/admin/pdfs/upload
 * Multi-part form-data:
 * - pdfFile: binary application/pdf (Required, max 50MB)
 * - coverImage: binary image/jpeg|png|webp (Optional, max 5MB)
 * - title, description, category, price, pages, etc.
 */
router.post(
  '/upload',
  pdfUpload.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  uploadPdfHandler
);

/**
 * GET /api/admin/pdfs
 * List all PDFs with internal administrator details
 */
router.get('/', getAllPdfsAdminHandler);

/**
 * GET /api/admin/pdfs/:id
 * Get single PDF by id
 */
router.get('/:id', getPdfByIdAdminHandler);

/**
 * PUT /api/admin/pdfs/:id
 * Update metadata for a PDF
 */
router.put('/:id', updatePdfMetadataHandler);

/**
 * DELETE /api/admin/pdfs/:id
 * Delete a PDF and remove private storage
 */
router.delete('/:id', deletePdfHandler);

export default router;
