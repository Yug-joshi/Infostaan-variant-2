import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PDFRepository } from '../data/pdfRepository.js';
import { PDFMetadata } from '../types.js';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const uploadPdfHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const pdfFile = files?.['pdfFile']?.[0];
    const coverImageFile = files?.['coverImage']?.[0];

    if (!pdfFile) {
      res.status(400).json({
        error: 'ValidationError',
        message: 'A PDF file (field "pdfFile") is required.',
      });
      return;
    }

    const {
      title,
      subtitle,
      description,
      category,
      price,
      originalPrice,
      pages,
      edition,
      language,
      topicsCovered,
      coverImageUrl,
    } = req.body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      // Clean up uploaded file if validation fails
      if (pdfFile && fs.existsSync(pdfFile.path)) fs.unlinkSync(pdfFile.path);
      if (coverImageFile && fs.existsSync(coverImageFile.path)) fs.unlinkSync(coverImageFile.path);
      res.status(400).json({ error: 'ValidationError', message: 'Valid "title" is required.' });
      return;
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      if (pdfFile && fs.existsSync(pdfFile.path)) fs.unlinkSync(pdfFile.path);
      if (coverImageFile && fs.existsSync(coverImageFile.path)) fs.unlinkSync(coverImageFile.path);
      res.status(400).json({ error: 'ValidationError', message: 'Valid "description" is required.' });
      return;
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      if (pdfFile && fs.existsSync(pdfFile.path)) fs.unlinkSync(pdfFile.path);
      if (coverImageFile && fs.existsSync(coverImageFile.path)) fs.unlinkSync(coverImageFile.path);
      res.status(400).json({ error: 'ValidationError', message: 'Valid "category" is required.' });
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      if (pdfFile && fs.existsSync(pdfFile.path)) fs.unlinkSync(pdfFile.path);
      if (coverImageFile && fs.existsSync(coverImageFile.path)) fs.unlinkSync(coverImageFile.path);
      res.status(400).json({ error: 'ValidationError', message: '"price" must be a non-negative number.' });
      return;
    }

    const parsedPages = parseInt(pages, 10);
    if (isNaN(parsedPages) || parsedPages <= 0) {
      if (pdfFile && fs.existsSync(pdfFile.path)) fs.unlinkSync(pdfFile.path);
      if (coverImageFile && fs.existsSync(coverImageFile.path)) fs.unlinkSync(coverImageFile.path);
      res.status(400).json({ error: 'ValidationError', message: '"pages" must be a positive integer.' });
      return;
    }

    // Cover image URL handling
    let finalCoverImage = coverImageUrl || '';
    if (coverImageFile) {
      finalCoverImage = `/api/covers/${path.basename(coverImageFile.path)}`;
    }
    if (!finalCoverImage) {
      finalCoverImage = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800';
    }

    // Parse topicsCovered array
    let parsedTopics: string[] = [];
    if (Array.isArray(topicsCovered)) {
      parsedTopics = topicsCovered.map(String);
    } else if (typeof topicsCovered === 'string') {
      try {
        const json = JSON.parse(topicsCovered);
        if (Array.isArray(json)) parsedTopics = json.map(String);
      } catch {
        parsedTopics = topicsCovered.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const id = `pdf-${crypto.randomUUID().slice(0, 8)}`;
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${id.slice(-4)}`;

    const newPdf: PDFMetadata = {
      id,
      slug,
      title: title.trim(),
      subtitle: subtitle ? String(subtitle).trim() : undefined,
      description: description.trim(),
      category: category.trim(),
      price: parsedPrice,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      coverImage: finalCoverImage,
      pages: parsedPages,
      edition: edition ? String(edition).trim() : `${new Date().getFullYear()} Edition`,
      fileFormat: 'PDF',
      fileSize: formatBytes(pdfFile.size),
      language: language ? String(language).trim() : 'English',
      topicsCovered: parsedTopics,
      lastUpdated: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewsCount: 1,
      privateFilePath: pdfFile.path,
      originalFileName: pdfFile.originalname,
      uploadedAt: new Date().toISOString(),
      isPublished: true,
    };

    PDFRepository.save(newPdf);

    res.status(201).json({
      success: true,
      message: 'PDF uploaded and registered successfully.',
      pdf: newPdf,
    });
  } catch (err: any) {
    console.error('Error in uploadPdfHandler:', err);
    res.status(500).json({
      error: 'InternalServerError',
      message: err.message || 'An unexpected error occurred during upload.',
    });
  }
};

export const getAllPdfsAdminHandler = (_req: Request, res: Response): void => {
  const all = PDFRepository.getAll();
  res.json({
    success: true,
    count: all.length,
    pdfs: all,
  });
};

export const getPdfByIdAdminHandler = (req: Request, res: Response): void => {
  const { id } = req.params;
  const pdf = PDFRepository.getById(id);
  if (!pdf) {
    res.status(404).json({ error: 'NotFound', message: `PDF with id "${id}" was not found.` });
    return;
  }
  res.json({ success: true, pdf });
};

export const updatePdfMetadataHandler = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updates = req.body;

  // Protect internal storage path from arbitrary client updates
  delete updates.privateFilePath;
  delete updates.id;

  if (updates.price !== undefined) {
    const p = parseFloat(updates.price);
    if (isNaN(p) || p < 0) {
      res.status(400).json({ error: 'ValidationError', message: 'Price must be a non-negative number.' });
      return;
    }
    updates.price = p;
  }

  if (updates.pages !== undefined) {
    const pg = parseInt(updates.pages, 10);
    if (isNaN(pg) || pg <= 0) {
      res.status(400).json({ error: 'ValidationError', message: 'Pages must be a positive integer.' });
      return;
    }
    updates.pages = pg;
  }

  const updated = PDFRepository.update(id, updates);
  if (!updated) {
    res.status(404).json({ error: 'NotFound', message: `PDF with id "${id}" was not found.` });
    return;
  }

  res.json({
    success: true,
    message: 'PDF metadata updated successfully.',
    pdf: updated,
  });
};

export const deletePdfHandler = (req: Request, res: Response): void => {
  const { id } = req.params;
  const deleted = PDFRepository.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'NotFound', message: `PDF with id "${id}" was not found.` });
    return;
  }

  // Safely delete private file from disk if it exists
  if (deleted.privateFilePath && fs.existsSync(deleted.privateFilePath)) {
    try {
      fs.unlinkSync(deleted.privateFilePath);
    } catch (e) {
      console.error('Failed to unlink private PDF file:', e);
    }
  }

  res.json({
    success: true,
    message: 'PDF and associated private storage removed successfully.',
    id,
  });
};
