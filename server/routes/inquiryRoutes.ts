import { Router } from 'express';
import { createCourseInquiryHandler } from '../controllers/courseInquiryController.js';

const router = Router();

router.post('/courses', createCourseInquiryHandler);

export default router;
