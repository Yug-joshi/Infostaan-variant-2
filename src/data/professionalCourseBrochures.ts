export interface ProfessionalCourseBrochure {
  id: string;
  title: string;
  preview: string;
}

export const PROFESSIONAL_COURSE_BROCHURES: ProfessionalCourseBrochure[] = [
  {
    id: 'acca',
    title: 'ACCA',
    preview: 'A professional accountancy qualification from the Association of Chartered Certified Accountants. The brochure describes it as globally accepted and offers a flexible, one-paper-at-a-time route.',
  },
  {
    id: 'ai-bfsi',
    title: 'AI Certification in Business & Finance (BFSI)',
    preview: 'An AI certification for finance careers, built around practical workflows and projects. The brochure highlights learning to use AI tools in business and finance.',
  },
  {
    id: 'cfa',
    title: 'CFA',
    preview: 'The Chartered Financial Analyst qualification covers investment management, financial analysis, and ethics across three levels.',
  },
  {
    id: 'cfp',
    title: 'CFP',
    preview: 'The Certified Financial Planner certification focuses on personal finance, including investment, retirement, tax, risk, and estate planning.',
  },
  {
    id: 'cma-us',
    title: 'CMA (US)',
    preview: 'The Certified Management Accountant program develops skills in financial planning, analysis, control, and decision support.',
  },
  {
    id: 'fmaa',
    title: 'FMAA',
    preview: 'The Financial and Managerial Accounting Associate is an entry-level global certification from the Institute of Management Accountants (IMA), USA, covering practical accounting and finance fundamentals.',
  },
  {
    id: 'iboc-cisi',
    title: 'IBOC / CISI',
    preview: 'The Investment Banking Operations Certificate prepares learners for financial operations and administration, and is aligned with the CISI International Introduction to Securities & Investment qualification.',
  },
];
