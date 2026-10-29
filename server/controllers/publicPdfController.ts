import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFRepository } from '../data/pdfRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COVERS_DIR = path.resolve(__dirname, '../storage/covers');

export const getPublicPdfsHandler = (req: Request, res: Response): void => {
  const { category, search, sort } = req.query;
  let items = PDFRepository.getPublicAll();

  if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
    items = items.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search && typeof search === 'string' && search.trim().length > 0) {
    const q = search.toLowerCase().trim();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q) ||
        item.topicsCovered.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sort === 'price-low') {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    items.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    items.sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''));
  }

  res.json({
    success: true,
    count: items.length,
    pdfs: items,
  });
};

export const getPublicPdfBySlugHandler = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const pdf = PDFRepository.getPublicBySlug(slug);

  if (!pdf) {
    res.status(404).json({
      error: 'NotFound',
      message: `PDF resource with slug or ID "${slug}" was not found.`,
    });
    return;
  }

  res.json({
    success: true,
    pdf,
  });
};

export const serveCoverImageHandler = (req: Request, res: Response): void => {
  const { filename } = req.params;
  // Prevent directory traversal attacks
  const safeFilename = path.basename(filename);
  const filePath = path.join(COVERS_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'NotFound', message: 'Cover image not found.' });
    return;
  }

  res.sendFile(filePath);
};
