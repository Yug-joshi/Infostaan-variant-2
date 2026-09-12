export type ScreenType = 'home' | 'search' | 'college-detail' | 'saved' | 'guidance';

export type CategoryType = 'all' | 'colleges' | 'courses' | 'careers' | 'internships';

export interface SearchResultItem {
  id: string;
  category: 'colleges' | 'courses' | 'careers' | 'internships';
  badgeCategory: string;
  badgeSub: string;
  title: string;
  subtitle?: string;
  meta: string[];
  whyRelevant: string;
  tagColor: 'primary' | 'secondary' | 'tertiary' | 'lavender';
  actionLabel: string;
  collegeId?: string;
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
  category: 'college' | 'internship';
  title: string;
  regionBadge: string;
  badgeType: 'Western Suburbs' | 'South Mumbai' | 'Finance & Markets';
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
