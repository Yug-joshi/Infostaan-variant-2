export type ScreenType = 'home' | 'search' | 'college-detail' | 'saved' | 'guidance' | 'connect';

export type CategoryType = 'all' | 'colleges' | 'courses' | 'careers' /* | 'internships' */ | 'classes' | 'cutoffs';

export interface SearchResultItem {
  id: string;
  category: 'colleges' | 'courses' | 'careers' /* | 'internships' */ | 'classes' | 'cutoffs';
  badgeCategory: string;
  badgeSub: string;
  title: string;
  subtitle?: string;
  meta: string[];
  whyRelevant: string;
  tagColor: 'primary' | 'secondary' | 'tertiary' | 'lavender';
  actionLabel: string;
  collegeId?: string;
  sourceFile?: string;
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
  category: 'college' /* | 'internship' */;
  title: string;
  regionBadge: string;
  badgeType: string;
  locationInfo: string;
  timeSavedText: string;
  lineText?: string;
  iconType: 'school' | 'account_balance' | 'trending_up';
  canCompare?: boolean;
  collegeId?: string;
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
