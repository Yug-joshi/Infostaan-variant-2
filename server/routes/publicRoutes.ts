import { Router } from 'express';
import {
  getPublicPdfsHandler,
  getPublicPdfBySlugHandler,
  serveCoverImageHandler,
} from '../controllers/publicPdfController.js';

const router = Router();

/**
 * Public routes for viewing and searching available PDFs
 * No admin credentials needed; private paths and admin metadata are excluded.
 */
router.get('/', getPublicPdfsHandler);
router.get('/:slug', getPublicPdfBySlugHandler);

export default router;
