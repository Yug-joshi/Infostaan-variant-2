import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFMetadata, PublicPDFMetadata } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.resolve(__dirname, 'pdfs.json');

export class PDFRepository {
  private static ensureDataFile(): void {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE_PATH)) {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  public static getAll(): PDFMetadata[] {
    this.ensureDataFile();
    try {
      const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(data) as PDFMetadata[];
    } catch (err) {
      console.error('Error reading PDF metadata file:', err);
      return [];
    }
  }

  public static getPublicAll(): PublicPDFMetadata[] {
    const all = this.getAll();
    return all
      .filter((pdf) => pdf.isPublished)
      .map(({ privateFilePath, originalFileName, ...publicData }) => publicData);
  }

  public static getById(id: string): PDFMetadata | undefined {
    const all = this.getAll();
    return all.find((p) => p.id === id);
  }

  public static getBySlug(slug: string): PDFMetadata | undefined {
    const all = this.getAll();
    return all.find((p) => p.slug === slug || p.id === slug);
  }

  public static getPublicBySlug(slug: string): PublicPDFMetadata | undefined {
    const pdf = this.getBySlug(slug);
    if (!pdf || !pdf.isPublished) return undefined;
    const { privateFilePath, originalFileName, ...publicData } = pdf;
    return publicData;
  }

  public static save(item: PDFMetadata): PDFMetadata {
    const all = this.getAll();
    const existingIndex = all.findIndex((p) => p.id === item.id);
    if (existingIndex >= 0) {
      all[existingIndex] = {
        ...item,
        updatedAt: new Date().toISOString(),
      };
    } else {
      all.unshift(item);
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(all, null, 2), 'utf-8');
    return item;
  }

  public static update(id: string, updates: Partial<PDFMetadata>): PDFMetadata | null {
    const all = this.getAll();
    const existingIndex = all.findIndex((p) => p.id === id);
    if (existingIndex < 0) return null;

    const updated: PDFMetadata = {
      ...all[existingIndex],
      ...updates,
      id, // Immutable ID
      updatedAt: new Date().toISOString(),
    };
    all[existingIndex] = updated;
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(all, null, 2), 'utf-8');
    return updated;
  }

  public static delete(id: string): PDFMetadata | null {
    const all = this.getAll();
    const existingIndex = all.findIndex((p) => p.id === id);
    if (existingIndex < 0) return null;

    const [deleted] = all.splice(existingIndex, 1);
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(all, null, 2), 'utf-8');
    return deleted;
  }
}
