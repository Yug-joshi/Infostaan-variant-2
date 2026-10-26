export type ScreenType = 'home' | 'search' | 'college-detail' | 'saved' | 'guidance' | 'connect';

export type CategoryType = 'all' | 'colleges' | 'courses' | 'careers' /* | 'internships' */ | 'classes' | 'cutoffs' | 'pdfs' | 'connect';

export interface SearchResultItem {
  id: string;
  category: 'colleges' | 'courses' | 'careers' /* | 'internships' */ | 'classes' | 'cutoffs' | 'pdfs' | 'connect' | 'pages';
  badgeCategory: string;
  badgeSub: string;
  title: string;
  subtitle?: string;
  meta: string[];
  whyRelevant: string;
  tagColor: 'primary' | 'secondary' | 'tertiary' | 'lavender';
  actionLabel: string;
  collegeId?: string;
  collegeSlug?: string;
  sourceFile?: string;
  slug?: string;
  href?: string;
  action?: 'toggle-theme' | 'open-profile';
  searchTerms?: string[];
  discipline?: string[];
  qualificationLevel?: string;
  courseFamily?: string;
}

export interface CollegeDetail {
  id: string;
  badge: string;
  name: string;
  subName: string;
  location: string;
  transitDetail: string;
  commuteTime: string;
  commuteHeading: string;
  commuteDescription: string;
  commuteBadge: string;
  image: string;
  whyFit: {
    icon: string;
    title: string;
    description: string;
    iconColor: string;
  }[];
  keyFacts: {
    label: string;
    value: string;
    description: string;
  }[];
  isRightForYou: {
    strongFit: string;
    keepInMind: string;
  };
  compareTargetName: string;
}

export interface ShortlistItem {
  id: string;
  category: 'college' | 'course' | 'class' | 'career' | 'pdf';
  title: string;
  regionBadge: string;
  badgeType: string;
  locationInfo: string;
  timeSavedText: string;
  lineText?: string;
  iconType: 'school' | 'account_balance' | 'trending_up' | 'library_books' | 'work' | 'file_text';
  canCompare?: boolean;
  collegeId?: string;
  pdfId?: string;
  pdfSlug?: string;
  price?: number;
}

export interface PDFResource {
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
}

export interface CartItem {
  pdf: PDFResource;
  quantity: number;
  addedAt: string;
}

export interface PurchasedPdfItem {
  id: string;
  pdfId: string;
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  pages: number;
  edition: string;
  pricePaid: number;
  orderNumber: string;
  purchasedAt: string;
  status: 'confirmed' | 'pending';
}


export interface ComparisonProfile {
  name: string;
  campus: string;
  location: string;
  stationDistance: string;
  avgFees: string;
  cutoff: string;
  attendanceStrictness: string;
  caArticleshipFriendly: string;
  topRecruiters: string[];
  autonomous: boolean;
}

export interface RoadmapRecommendedCollege {
  id: string;
  name: string;
  location: string;
  commuteTip: string;
  highlight: string;
}

export interface RoadmapDegreeItem {
  code: string;
  name: string;
  duration: string;
  whyFit: string;
  recommendedColleges: RoadmapRecommendedCollege[];
}

export interface RoadmapCertificationItem {
  name: string;
  provider: string;
  duration: string;
  relevance: string;
  whenToTake: string;
}

/*
export interface RoadmapInternshipItem {
  title: string;
  company: string;
  location: string;
  stipend: string;
  timing: string;
  skillsGained: string;
  applicationWindow: string;
}
*/

export interface RoadmapStep {
  stepNumber: number;
  stageTitle: string;
  badge: string;
  timeline: string;
  summary: string;
  degreesOrCourses?: RoadmapDegreeItem[];
  certifications?: RoadmapCertificationItem[];
  // internships?: RoadmapInternshipItem[];
  proTips: string[];
}

export interface CareerGoal {
  id: string;
  title: string;
  tagline: string;
  category: 'finance' | 'consulting' | 'tech' | 'law' | 'media';
  streamFit: string[];
  targetSalaryRange: string;
  keyIndustries: string[];
  workLocations: string[];
  steps: RoadmapStep[];
}
