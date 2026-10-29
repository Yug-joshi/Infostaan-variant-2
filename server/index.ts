import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { serveCoverImageHandler } from './controllers/publicPdfController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic CORS header for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-key'
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Infostaan PDF API',
  });
});

// Public cover images endpoint (Only covers, private PDFs are NEVER statically served)
app.get('/api/covers/:filename', serveCoverImageHandler);

// Public PDF metadata endpoints
app.use('/api/pdfs', publicRoutes);

// Protected Admin PDF upload and management endpoints
app.use('/api/admin/pdfs', adminRoutes);

// 404 handler for undefined API routes
app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'NotFound', message: 'API endpoint not found.' });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: 'FileSizeLimit',
        message: 'File size exceeds maximum allowed limit (50MB for PDF, 5MB for cover).',
      });
      return;
    }
    res.status(400).json({ error: 'UploadError', message: err.message });
    return;
  }

  res.status(500).json({
    error: 'InternalServerError',
    message: err.message || 'An unexpected error occurred.',
  });
});

// Start server
const isMain = process.argv[1] && fileURLToPath(import.meta.url).includes(path.basename(process.argv[1]));
if (isMain || process.env.RUN_SERVER === 'true') {
  app.listen(PORT, () => {
    console.log(`[INFOSTAAN API] PDF Server running on http://localhost:${PORT}`);
    console.log(`[INFOSTAAN API] Admin upload endpoint: POST http://localhost:${PORT}/api/admin/pdfs/upload`);
    console.log(`[INFOSTAAN API] Public catalog endpoint: GET http://localhost:${PORT}/api/pdfs`);
  });
}

export default app;
