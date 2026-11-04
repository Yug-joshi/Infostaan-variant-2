export interface ProfessionalCourseBrochure {
  id: string;
  title: string;
  category: string;
  summary: string;
  learningGroups: { title?: string; topics: string[] }[];
  highlights: string[];
  careerAreas?: string[];
  idealFor: string;
  eligibility: string;
}

export const PROFESSIONAL_COURSE_BROCHURES: ProfessionalCourseBrochure[] = [
  {
    id: 'acca',
    title: 'ACCA – Association of Chartered Certified Accountants',
    category: 'Accounting & Finance',
    summary: 'Build a career in professional accounting with the globally recognised ACCA qualification. Develop expertise across accounting, taxation, audit, financial management and strategic business leadership.',
    learningGroups: [{
      topics: [
        'Business and Technology',
        'Financial Accounting',
        'Management Accounting',
        'Corporate and Business Law',
        'Taxation',
        'Financial Reporting',
        'Audit and Assurance',
        'Financial Management',
        'Strategic Business Reporting',
        'Advanced Financial Management',
      ],
    }],
    highlights: [
      'Globally accepted in more than 180 countries, as stated in the brochure.',
      'Flexible examination structure with one paper at a time.',
      'The brochure mentions a duration of 6 months to 3 years.',
      'Up to 9 paper exemptions may be available, subject to eligibility.',
    ],
    idealFor: 'Students and aspiring professionals interested in accounting, auditing, taxation and finance.',
    eligibility: 'Contact FPA Edutech for applicable entry requirements and an exemption assessment.',
  },
  {
    id: 'cfa',
    title: 'CFA – Chartered Financial Analyst',
    category: 'Investment & Finance',
    summary: 'Develop knowledge of investment analysis, financial markets and portfolio management through the CFA programme, with a focus on financial analysis, investment decisions and professional ethics.',
    learningGroups: [{
      topics: [
        'Ethical and Professional Standards',
        'Financial Reporting and Analysis',
        'Economics',
        'Equity Investments',
        'Fixed Income',
        'Derivatives',
        'Alternative Investments',
        'Corporate Finance',
        'Portfolio Management',
        'Quantitative Methods',
      ],
    }],
    highlights: [
      'Three levels of study.',
      'The brochure states international recognition across 170+ countries.',
      'Focus on investment management and financial analysis.',
      'The brochure outlines career opportunities across investment and financial services.',
    ],
    careerAreas: [
      'Investment Management',
      'Investment Banking',
      'Corporate Finance',
      'Equity Research',
      'Risk Management',
      'Wealth Management',
      'Financial Consulting',
    ],
    idealFor: 'Students, graduates and professionals interested in investment research, financial markets and portfolio management.',
    eligibility: 'Contact FPA Edutech for current CFA programme eligibility.',
  },
  {
    id: 'cfp',
    title: 'CFP – Certified Financial Planner',
    category: 'Financial Planning & Wealth Management',
    summary: 'Learn how to help individuals plan and manage their financial goals. The CFP certification focuses on personal financial planning, investment management, retirement, taxation, risk and estate planning.',
    learningGroups: [{
      topics: [
        'Basics of Financial Planning',
        'Investment Planning',
        'Personal Financial Management',
        'Retirement Planning',
        'Tax Planning',
        'Risk Management',
        'Estate Planning',
        'Integrated Financial Planning',
        'Financial Plan Construction',
        'Microsoft Excel and Financial Mathematics',
      ],
    }],
    highlights: [
      'Governed by the Financial Planning Standards Board – India.',
      'The brochure describes the certification and its personal finance focus.',
      'The brochure mentions an approximate duration of 6 months to 1 year.',
      'Includes specialist examinations and an integrated financial planning assessment.',
    ],
    careerAreas: [
      'Financial Advisor',
      'Wealth Manager',
      'Financial Planner',
      'Investment and Financial Planning Roles',
    ],
    idealFor: 'People interested in personal finance, investment and wealth planning.',
    eligibility: 'The brochure describes a regular pathway for applicants with 12th-standard or equivalent qualifications and a fast-track pathway for relevant professional qualifications and at least three years of BFSI work experience. Confirm the applicable pathway with FPA Edutech.',
  },
  {
    id: 'cma-us',
    title: 'CMA (USA) – Certified Management Accountant',
    category: 'Management Accounting & Finance',
    summary: 'Develop professional skills in management accounting, financial planning, business performance analysis and strategic financial management through the US CMA qualification.',
    learningGroups: [
      {
        title: 'Part 1 – Financial Planning, Performance & Analytics',
        topics: [
          'External Financial Reporting',
          'Planning, Budgeting and Forecasting',
          'Performance Management',
          'Cost Management',
          'Internal Controls',
          'Technology and Analytics',
        ],
      },
      {
        title: 'Part 2 – Strategic Financial Management',
        topics: [
          'Financial Statement Analysis',
          'Corporate Finance',
          'Decision Analysis',
          'Risk Management',
          'Investment Decisions',
          'Professional Ethics',
        ],
      },
    ],
    highlights: [
      'Certification awarded by the Institute of Management Accountants (IMA), USA.',
      'Two examination parts, which may be taken in either order according to the brochure.',
      'The brochure mentions a preparation duration of 6–12 months.',
      'Exam centres are available in India.',
      'The brochure lists exam windows in January–February, May–June and September–October.',
    ],
    idealFor: 'Commerce graduates, accounting professionals and people interested in management accounting and corporate finance.',
    eligibility: 'The brochure describes starting after 12th standard; a degree and two years of relevant work experience are required for the CMA designation. Confirm current requirements with FPA Edutech.',
  },
  {
    id: 'fmaa',
    title: 'FMAA – Financial & Managerial Accounting Associate',
    category: 'Accounting & Finance Fundamentals',
    summary: 'Build a foundation in accounting, financial management and business fundamentals with the FMAA certification offered by the Institute of Management Accountants (IMA), USA.',
    learningGroups: [{
      topics: [
        'Financial Statement Preparation and Analysis',
        'General Accounting and Financial Management',
        'Planning and Budgeting',
        'Cost Management and Performance Metrics',
        'Professional Ethics',
      ],
    }],
    highlights: [
      'Entry-level global certification.',
      'The brochure states there are no specific eligibility requirements or prerequisites.',
      'One on-demand computer-based examination at Prometric centres.',
      '80 multiple-choice questions over two hours.',
      'Passing score: 200 out of 300 marks, with no negative marking.',
    ],
    idealFor: 'School, junior college and university students; early-career and non-finance professionals; and aspiring accounting and finance professionals.',
    eligibility: 'Open to all backgrounds, with no prerequisites stated in the brochure.',
  },
  {
    id: 'iboc-cisi',
    title: 'IBOC – Investment Banking Operations Certificate',
    category: 'Investment Banking & Financial Operations',
    summary: 'Prepare for careers in financial operations, fund administration and investment banking support. The IBOC programme combines CISI-aligned securities and investment learning with practical training in fund accounting and financial reporting.',
    learningGroups: [{
      topics: [
        'Introduction to Securities and Investment',
        'Global Securities Operations',
        'End-to-End Fund Accounting',
        'Mutual Fund Accounting',
        'Hedge Fund Accounting',
        'Private Equity Fund Accounting',
        'Real Estate Fund Accounting',
        'Financial Reporting',
        'IFRS and US GAAP',
        'Generative AI for Automation',
        'Excel and Financial Modelling',
      ],
    }],
    highlights: [
      'The brochure describes two CISI-recognised papers.',
      'The brochure mentions a 9-month duration.',
      'Live online training modules.',
      'Practical learning in financial operations and fund accounting.',
      'Includes financial modelling and valuation learning.',
    ],
    careerAreas: [
      'Investment Banking Operations',
      'Fund Accounting',
      'Financial Reporting',
      'Fund Administration',
      'Investment Operations',
    ],
    idealFor: 'Undergraduates, graduates and working professionals interested in investment operations, financial reporting and fund administration.',
    eligibility: 'The brochure identifies undergraduates, graduates and professionals as suitable learners. Contact FPA Edutech for specific admission requirements.',
  },
  {
    id: 'ai-bfsi',
    title: 'AI Certification in Business & Finance',
    category: 'Artificial Intelligence & Finance',
    summary: 'Learn to apply artificial intelligence to business and finance workflows, with practical projects in financial analysis, automation, business strategy, research and productivity.',
    learningGroups: [
      {
        title: 'Foundation Level – 40 Hours',
        topics: [
          'AI Foundations for Business Thinking',
          'Prompting, AI research and spotting AI mistakes',
          'Personal finance and market analysis',
          'AI-assisted business analysis',
          'Building a business with AI',
          'Marketing, branding and storytelling',
          'Practical AI projects',
        ],
      },
      {
        title: 'Advanced / Professional Level – 60 Hours',
        topics: [
          'AI Foundations for Finance Professionals',
          'Financial Statement Analysis',
          'Financial Modelling and Valuation',
          'Forecasting and Scenario Analysis',
          'Audit and Reconciliation Automation',
          'AI in Growth, Risk and Real-World Decisions',
          'Business Strategy and AI Agents',
          'Workflow Automation using Make.com and n8n',
          'AI-Powered Career and Job Search Tools',
        ],
      },
    ],
    highlights: [
      'Foundation and advanced/professional learning paths.',
      'The brochure lists 40 hours for foundation and 60 hours for advanced/professional.',
      'Project-based learning with a capstone project.',
      'Industry expert sessions and LMS access are mentioned in the brochure.',
    ],
    idealFor: 'Students, graduates, finance and business professionals, and people interested in applying AI to business and finance.',
    eligibility: 'Contact FPA Edutech for the recommended entry level and batch suitability.',
  },
];
