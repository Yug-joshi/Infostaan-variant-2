import { Request, Response } from 'express';
import { PROFESSIONAL_COURSE_BROCHURES } from '../data/courseCatalog.js';
import { appendGoogleSheetRow, GoogleSheetsConfigurationError } from '../services/googleSheets.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d().\-\s]{7,24}$/;

export const createCourseInquiryHandler = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, currentEducation, courseId, consent } = req.body ?? {};
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
  const cleanEducation = typeof currentEducation === 'string' ? currentEducation.trim() : '';
  const course = typeof courseId === 'string'
    ? PROFESSIONAL_COURSE_BROCHURES.find((item) => item.id === courseId)
    : undefined;

  if (
    cleanName.length < 2 ||
    cleanName.length > 100 ||
    cleanEmail.length > 254 ||
    !EMAIL_PATTERN.test(cleanEmail) ||
    !PHONE_PATTERN.test(cleanPhone) ||
    cleanPhone.replace(/\D/g, '').length < 7 ||
    cleanEducation.length < 2 ||
    cleanEducation.length > 100 ||
    !course ||
    consent !== true
  ) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Enter valid contact and education details, select a listed course, and agree to share your details with the course partner.',
    });
    return;
  }

  const row = [
    new Date().toISOString(),
    cleanName,
    cleanEmail,
    cleanPhone,
    cleanEducation,
    course.id,
    course.title,
    'Infostaan website',
    'Professional Courses collaboration',
  ];

  try {
    await appendGoogleSheetRow(row);
    res.status(201).json({
      success: true,
      message: 'Your course inquiry has been recorded.',
    });
  } catch (error) {
    console.error('Saving course inquiry failed:', error);
    if (error instanceof GoogleSheetsConfigurationError) {
      res.status(503).json({
        error: 'InquiryServiceNotConfigured',
        message: 'The inquiry form is temporarily unavailable. Please try again later.',
      });
      return;
    }
    res.status(502).json({
      error: 'InquirySubmissionFailed',
      message: 'We could not save your request. Please try again later.',
    });
  }
};
