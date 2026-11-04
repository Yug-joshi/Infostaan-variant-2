export interface CutoffMetadata {
  id: string;
  slug: string;
  collegeId?: string;
  collegeName?: string;
  courseId?: string;
  academicYear?: string;
  stream?: string;
  documentTitle: string;
  sourceFile: string;
  description?: string;
}

export const CUTOFFS: CutoffMetadata[] = [
  {
    "id": "cutoff_1",
    "slug": "arts-mumbai-pdf",
    "collegeId": "mithibai",
    "collegeName": "Multiple Mumbai Colleges",
    "academicYear": "2025-26",
    "stream": "Arts",
    "documentTitle": "Arts (Mumbai)",
    "sourceFile": "/pdfs/Arts (Mumbai).pdf",
    "description": "Official cutoff document for Arts stream in Mumbai."
  },
  {
    "id": "cutoff_2",
    "slug": "arts-pdf",
    "collegeId": "mithibai",
    "collegeName": "Multiple Mumbai Colleges",
    "academicYear": "2025-26",
    "stream": "Arts",
    "documentTitle": "Arts",
    "sourceFile": "/pdfs/Arts.pdf",
    "description": "Official cutoff document for Arts stream in Mumbai."
  },
  {
    "id": "cutoff_3",
    "slug": "commerce-mumbai1-pdf",
    "collegeId": "mithibai",
    "collegeName": "Multiple Mumbai Colleges",
    "academicYear": "2025-26",
    "stream": "Commerce",
    "documentTitle": "Commerce Mumbai1)",
    "sourceFile": "/pdfs/Commerce Mumbai1).pdf",
    "description": "Official cutoff document for Commerce stream in Mumbai."
  },
  {
    "id": "cutoff_3_hr",
    "slug": "commerce-mumbai1-pdf",
    "collegeId": "hr-college",
    "collegeName": "Multiple Mumbai Colleges",
    "academicYear": "2025-26",
    "stream": "Commerce",
    "documentTitle": "Commerce Mumbai1)",
    "sourceFile": "/pdfs/Commerce Mumbai1).pdf",
    "description": "Official cutoff document for Commerce stream in Mumbai."
  },
  {
    "id": "cutoff_4",
    "slug": "commerce-pdf",
    "collegeId": "mithibai",
    "collegeName": "Multiple Mumbai Colleges",
    "academicYear": "2025-26",
    "stream": "Commerce",
    "documentTitle": "Commerce",
    "sourceFile": "/pdfs/Commerce.pdf",
    "description": "Official cutoff document for Commerce stream in Mumbai."
  },
  {
    "id": "cutoff_4_hr",
    "slug": "commerce-pdf",
    "collegeId": "hr-college",
    "collegeName": "Multiple Mumbai Colleges",
    "academicYear": "2025-26",
    "stream": "Commerce",
    "documentTitle": "Commerce",
    "sourceFile": "/pdfs/Commerce.pdf",
    "description": "Official cutoff document for Commerce stream in Mumbai."
  },
  {
    "id": "cutoff_5",
    "slug": "science-mumbai-pdf",
    "collegeId": "mithibai",
    "collegeName": "Multiple Mumbai Colleges",
    "academicYear": "2025-26",
    "stream": "Science",
    "documentTitle": "Science (Mumbai)",
    "sourceFile": "/pdfs/Science (Mumbai).pdf",
    "description": "Official cutoff document for Science stream in Mumbai."
  },
  {
    "id": "cutoff_6",
    "slug": "science-pdf",
    "collegeId": "mithibai",
    "collegeName": "Multiple Mumbai Colleges",
    "academicYear": "2025-26",
    "stream": "Science",
    "documentTitle": "Science",
    "sourceFile": "/pdfs/Science.pdf",
    "description": "Official cutoff document for Science stream in Mumbai."
  }
];
