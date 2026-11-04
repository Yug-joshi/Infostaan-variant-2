import { Router } from 'express';
import {
  createPaymentOrderHandler,
  createIntegrationTestOrderHandler,
  createIntegrationTestQrHandler,
  downloadPurchasedPdfHandler,
  getIntegrationTestQrStatusHandler,
  getPaymentConfigHandler,
  verifyPaymentHandler,
} from '../controllers/paymentController.js';

const router = Router();

router.get('/config', getPaymentConfigHandler);
router.post('/integration-test/orders', createIntegrationTestOrderHandler);
router.post('/integration-test/qr', createIntegrationTestQrHandler);
router.get('/integration-test/qr/:qrId/status', getIntegrationTestQrStatusHandler);
router.post('/orders', createPaymentOrderHandler);
router.post('/verify', verifyPaymentHandler);
router.get('/download/:token', downloadPurchasedPdfHandler);

export default router;
