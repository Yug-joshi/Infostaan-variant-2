export interface PDFMetadata {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  pages: number;
  edition: string;
  fileFormat: string;
  fileSize: string;
  language: string;
  previewPages?: string[];
  topicsCovered: string[];
  lastUpdated: string;
  rating?: number;
  reviewsCount?: number;
  // Private / Admin fields
  privateFilePath?: string;
  originalFileName?: string;
  uploadedAt: string;
  updatedAt?: string;
  isPublished: boolean;
}

export type PublicPDFMetadata = Omit<PDFMetadata, 'privateFilePath' | 'originalFileName'>;

export interface CreatePDFInput {
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  pages: number;
  edition?: string;
  language?: string;
  topicsCovered?: string[];
  subtitle?: string;
}
