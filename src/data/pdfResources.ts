import { PDFResource, PurchasedPdfItem } from '../types';

export const PDF_CATEGORIES = [
  'All',
  'Cutoffs & Admissions',
  'College Guides',
  'Career Roadmaps',
  'Course Handbooks',
] as const;

export const INITIAL_PDF_RESOURCES: PDFResource[] = [
  {
    id: 'pdf-fyjc-cutoffs-2025',
    slug: 'fyjc-mumbai-cutoffs-handbook-2025',
    title: 'FYJC Mumbai Cutoffs & Merit Analysis Handbook 2025-26',
    subtitle: 'Complete round-wise cutoff analysis for 350+ Mumbai junior colleges across Western, Central, and South zones.',
    description: 'Comprehensive reference guide analyzing cutoffs across Arts, Commerce, and Science for all Mumbai colleges. Includes seat allocation patterns, round-wise percentage drop data, quota insights, and minority reservation breakdowns.',
    category: 'Cutoffs & Admissions',
    price: 149,
    originalPrice: 299,
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    pages: 64,
    edition: '2025-26 Official Edition',
    fileFormat: 'PDF',
    fileSize: '6.8 MB',
    language: 'English',
    previewPages: [
      'Table of Contents: Zone-wise analysis of Mumbai Junior Colleges',
      'Cutoff Trends 2022-2024: Science, Commerce, and Arts comparison',
      'Category Wise & Gujarati/Sindhi/Linguistic Minority Seat matrix',
      'Special Round strategies and vacancy allocation roadmap'
    ],
    topicsCovered: [
      'Round 1 to Special Round cutoff trends for 350+ colleges',
      'Stream-wise percentage brackets (Arts, Commerce, Science)',
      'Minority & In-house quota seat distribution',
      'Commute-distance vs cutoff ranking matrices'
    ],
    lastUpdated: '2025-06-15',
    rating: 4.9,
    reviewsCount: 142,
  },
  {
    id: 'pdf-commerce-ca-guide-2025',
    slug: 'mumbai-commerce-colleges-ca-guide',
    title: 'Mumbai Top Commerce Colleges & CA Articleship Guide',
    subtitle: 'How to balance B.Com / BAF / BMS degree attendance with CA Foundation, Inter & Articleship in Mumbai.',
    description: 'The definitive strategic blueprint for Mumbai commerce students pursuing Chartered Accountancy. Evaluates Mithibai, Podar, H.R., Hinduja, NM, and Jai Hind on attendance flexibility, morning batch timings, faculty support, and CA firm placements.',
    category: 'College Guides',
    price: 199,
    originalPrice: 399,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    pages: 78,
    edition: '2025 Revised Edition',
    fileFormat: 'PDF',
    fileSize: '8.2 MB',
    language: 'English',
    previewPages: [
      'Executive Summary: Top 10 CA-friendly colleges in South & Suburban Mumbai',
      'Comparative Timetable: Morning lecture hours vs coaching timings',
      'Big 4 & Mid-tier Articleship recruitment track record by college'
    ],
    topicsCovered: [
      'Morning batch schedule comparisons across top 10 institutions',
      'Articleship NOC policies and attendance requirements breakdown',
      'Campus placement statistics for finance, audit, and tax roles',
      'Choosing between B.Com, BAF, and BFM alongside CA Inter'
    ],
    lastUpdated: '2025-05-20',
    rating: 4.8,
    reviewsCount: 98,
  },
  {
    id: 'pdf-autonomous-colleges-guide',
    slug: 'autonomous-vs-non-autonomous-mumbai-colleges',
    title: 'Autonomous vs Non-Autonomous Degree Colleges Directory',
    subtitle: 'Curriculum differences, credit systems, grading policies, and exam difficulty compared.',
    description: 'An exhaustive breakdown of how autonomous status impacts student learning, examination grading, syllabus freshness, and post-graduate placements in Mumbai. Includes detailed reviews of 25 prominent autonomous colleges.',
    category: 'College Guides',
    price: 129,
    originalPrice: 249,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    pages: 52,
    edition: '2025 Edition',
    fileFormat: 'PDF',
    fileSize: '5.1 MB',
    language: 'English',
    previewPages: [
      'Understanding UGC Autonomy: Degrees awarded vs curriculum control',
      'Comparative Grading Systems: Relative grading vs Absolute percentage',
      'Internship & Credit transfer advantages in autonomous colleges'
    ],
    topicsCovered: [
      'Autonomy status, NAAC accreditation grades, and NIRF ranks',
      'Semester continuous assessment (CIA) breakdown vs MU exams',
      'Specialized electives and industry certification tie-ups',
      'Pros and cons for students aiming for CAT/MBA or overseas Masters'
    ],
    lastUpdated: '2025-04-10',
    rating: 4.7,
    reviewsCount: 64,
  },
  {
    id: 'pdf-bms-baf-handbook',
    slug: 'mumbai-bms-baf-admission-syllabus-handbook',
    title: 'Mumbai BMS & BAF Admission & Career Compendium',
    subtitle: 'Entrance exams, cutoffs, syllabus comparison, internship semesters, and placement analytics.',
    description: 'Everything a prospective management or accounting student in Mumbai must know. Covers entrance test syllabus (MAH-CET / CUET), cutoffs at Jai Hind, Mithibai, HR, Podar, NM, and career trajectories in investment banking, marketing, and consulting.',
    category: 'Course Handbooks',
    price: 159,
    originalPrice: 299,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    pages: 68,
    edition: '2025-26 Edition',
    fileFormat: 'PDF',
    fileSize: '7.3 MB',
    language: 'English',
    previewPages: [
      'BMS vs BAF: Core distinctions, mathematics weightage, and target profiles',
      'Entrance Exam Syllabus & Weightage across Mumbai colleges',
      'Placement averages: CTC ranges, hiring companies, and job designations'
    ],
    topicsCovered: [
      'Semester-by-semester subject curriculum comparison',
      'College-by-college entrance criteria and cutoff benchmarks',
      'Internship mandates and live project expectations',
      'Post-graduation career tracks: Corporate Finance vs Management'
    ],
    lastUpdated: '2025-06-01',
    rating: 4.9,
    reviewsCount: 112,
  },
  {
    id: 'pdf-science-eng-med-roadmap',
    slug: 'fyjc-science-engineering-medical-roadmap',
    title: 'FYJC Science to Engineering & Medical Roadmap Guide',
    subtitle: 'Synchronizing MHT-CET, JEE Main & NEET preparation with Class 11-12 Maharashtra State Board.',
    description: 'Essential planning roadmap for 11th and 12th Science students in Mumbai. Breaks down chapter-wise weightage overlap between State Board textbooks and competitive exams, dummy college vs regular college dynamics, and laboratory exam requirements.',
    category: 'Career Roadmaps',
    price: 179,
    originalPrice: 349,
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    pages: 72,
    edition: '2025 Edition',
    fileFormat: 'PDF',
    fileSize: '7.9 MB',
    language: 'English',
    previewPages: [
      'State Board vs NCERT Syllabus Overlap Matrix',
      'Two-Year Week-by-Week Study Plan for CET & JEE candidates',
      'Top Science Junior Colleges in Western and Central lines'
    ],
    topicsCovered: [
      'Physics, Chemistry, Maths & Biology chapter weightage trends',
      'Balancing practical journals, internal tests, and entrance mocks',
      'Detailed review of top Mumbai colleges with integrated coaching',
      'Engineering (COEP, VJTI, SPIT) & Medical (KEM, Sion, Cooper) cutoffs'
    ],
    lastUpdated: '2025-05-12',
    rating: 4.8,
    reviewsCount: 85,
  },
  {
    id: 'pdf-arts-humanities-blueprint',
    slug: 'arts-humanities-career-blueprint-mumbai',
    title: 'Arts & Humanities Career Blueprint: Mumbai University & Beyond',
    subtitle: 'Psychology, Economics, Media, Law, and Public Policy specializations mapped.',
    description: 'In-depth guide for Arts students detailing honors admissions, faculty strength, and professional prospects from St. Xavier\'s, Mithibai, Sophia, Wilson, and Jai Hind. Covers MA, civil services, corporate communication, and law entrance pathways.',
    category: 'Career Roadmaps',
    price: 149,
    originalPrice: 279,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    pages: 56,
    edition: '2025 Edition',
    fileFormat: 'PDF',
    fileSize: '5.6 MB',
    language: 'English',
    previewPages: [
      'Psychology and Economics seat caps across major Mumbai colleges',
      'Media and Advertising career trajectories post-graduation',
      '5-Year Integrated LLB admissions via MHCET Law'
    ],
    topicsCovered: [
      'Major subject combinations available in top Arts colleges',
      'Cutoffs for Psychology, Economics, and Sociology majors in FYBA/TYBA',
      'Competitive exam preparation (MHCET Law, UPSC, UGC-NET)',
      'High-paying career paths in user research, policy, and brand strategy'
    ],
    lastUpdated: '2025-04-28',
    rating: 4.7,
    reviewsCount: 53,
  },
];

export const INITIAL_PURCHASES: PurchasedPdfItem[] = [
  {
    id: 'purch-001',
    pdfId: 'pdf-fyjc-cutoffs-2025',
    slug: 'fyjc-mumbai-cutoffs-handbook-2025',
    title: 'FYJC Mumbai Cutoffs & Merit Analysis Handbook 2025-26',
    category: 'Cutoffs & Admissions',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    pages: 64,
    edition: '2025-26 Official Edition',
    pricePaid: 149,
    orderNumber: 'IFS-ORD-2025-8831',
    purchasedAt: '2025-06-18T14:22:00Z',
    status: 'confirmed',
  },
];

export async function fetchPDFResources(): Promise<PDFResource[]> {
  try {
    const res = await fetch('/api/pdfs');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.pdfs) && data.pdfs.length > 0) {
        return data.pdfs;
      }
    }
  } catch {
    // Backend API is optional or running offline; fallback cleanly to curated dataset
  }
  return INITIAL_PDF_RESOURCES;
}

export async function fetchPDFBySlug(slug: string): Promise<PDFResource | null> {
  try {
    const res = await fetch(`/api/pdfs/${encodeURIComponent(slug)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.pdf) {
        return data.pdf;
      }
    }
  } catch {
    // Fallback cleanly
  }
  const found = INITIAL_PDF_RESOURCES.find((p) => p.slug === slug || p.id === slug);
  return found || null;
}
