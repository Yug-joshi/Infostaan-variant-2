import { ALL_SEARCH_RESULTS } from '../data/mockData';
import {
  CanonicalRegion,
  resolveCanonicalRegion,
  resolveItemCanonicalRegion,
  matchItemRegion,
} from './categoryFilters';

export interface RecommendationQuery {
  stage: string; // 'class10' | 'class12-commerce' | 'class12-science' | 'undergrad'
  interests: string[]; // ['commerce-finance', 'management-bms', 'tech-coding', 'design-media']
  location: string; // 'central' | 'south-mumbai' | 'western' | 'eastern' | 'harbour' | 'all-mumbai' or canonical region
  priority: string; // 'ca-flexibility' | 'placements' | 'brand' | 'fest'
  limit?: number; // Optional display limit; when omitted, ALL eligible colleges are returned
}

export interface RecommendationResult {
  id: string; // canonical collegeId
  name: string;
  badge: string;
  location: string;
  canonicalRegion: CanonicalRegion | 'All Mumbai';
  desc: string;
  matchRate: string;
  score: number;
  actionText: string;
}

export interface RecommendationDiagnostics {
  query: RecommendationQuery;
  normalizedRegion: string;
  initialCandidateCount: number;
  totalCandidatesBeforeFilter: number; // backward compatibility
  remainingAfterLocationFilter: number;
  remainingAfterAcademicFilter: number;
  countAfterDeduplication: number;
  totalEligibleScored: number;
  totalRendered: number;
  hiddenCount: number;
  finalRecommendations: RecommendationResult[];
}

/**
 * Verified institutional profile model for recommendations.
 * Every profile maps strictly to its verified canonical geographic region.
 */
interface CollegeRecommendationProfile {
  id: string;
  name: string;
  canonicalRegion: CanonicalRegion;
  locationDisplay: string;
  streams: ('Commerce' | 'Arts' | 'Science')[];
  courses: string[];
  morningShift: boolean; // Early morning shift (e.g. 7 AM to 10:15 AM)
  topPlacements: boolean; // Corporate BFSI / consulting recruiters
  autonomousBrand: boolean; // Autonomous status, NAAC A+/A++, legacy prestige
  festCulture: boolean; // Active cultural fests & societies
  hasFyjc: boolean; // Verified junior college FYJC admissions
  badges: Record<string, string>; // Priority-specific badges
  descriptions: Record<string, string>; // Priority-specific descriptions
}

const COLLEGE_PROFILES: CollegeRecommendationProfile[] = [
  // ── Central Suburbs ────────────────────────────────────────────────────────
  {
    id: 'podar',
    name: 'R.A. Podar College of Commerce & Economics',
    canonicalRegion: 'Central Suburbs',
    locationDisplay: 'Matunga Central, Central Suburbs • 5 min from station',
    streams: ['Commerce'],
    courses: ['B.Com', 'BMS', 'BAF', 'BFM', 'BAS'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: false,
    hasFyjc: true,
    badges: {
      'ca-flexibility': 'Premier CA Articleship Benchmark',
      'placements': 'Central Line Corporate Placement Hub',
      'brand': 'Autonomous Commerce Excellence',
      'fest': 'Matunga Student Culture',
      default: 'Central Mumbai Academic Benchmark',
    },
    descriptions: {
      'ca-flexibility':
        'Central Mumbai’s premier CA articleship institution. Early-morning lectures wrap up before 10:30 AM, providing seamless sync with top accounting and audit firms.',
      'placements':
        'Gold-standard placement record with direct hiring from EY, Deloitte, KPMG, and ICICI Bank. Exceptional career trajectory for B.Com, BMS, and BAF graduates.',
      'brand':
        'Autonomous NAAC A+ institution with legendary academic heritage in commerce and actuarial studies.',
      default:
        'Central Mumbai’s gold-standard commerce campus. Strict academic rigor with top-tier B.Com, BMS, and BAF student placements.',
    },
  },
  {
    id: 'sies-college',
    name: 'SIES College of Arts, Science & Commerce',
    canonicalRegion: 'Central Suburbs',
    locationDisplay: 'Sion West, Central Suburbs • 4 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['B.Com', 'BMS', 'BAF', 'B.Sc IT'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'ca-flexibility': 'Sion CA & Finance Schedule',
      'placements': 'Premier BFSI Campus Recruitment',
      'brand': 'Autonomous NAAC A+ Landmark',
      'fest': 'Vibrant Sion Campus Life',
      default: 'Sion Academic & Placement Hub',
    },
    descriptions: {
      'ca-flexibility':
        'Structured morning schedules in Sion West allow students to balance professional exams, CA articleship, and core finance certifications.',
      'placements':
        'Leading placement cell with strong corporate recruitment across BFSI, fintech, and analytics in Central Mumbai and BKC.',
      'brand':
        'Autonomous institution known for innovative curriculum, dedicated faculty, and proven track records in commerce and science.',
      default:
        'Leading academic hub in Sion & Matunga with strong placement records in finance and technology.',
    },
  },
  {
    id: 'somaiya-college',
    name: 'K.J. Somaiya College of Arts & Commerce',
    canonicalRegion: 'Central Suburbs',
    locationDisplay: 'Vidyavihar / Ghatkopar, Central Suburbs • 5 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['B.Com', 'BMS', 'BAF', 'BFM', 'BA', 'B.Sc IT'],
    morningShift: false,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'ca-flexibility': 'Central Line Finance Corridor',
      'placements': 'Somaiya Corporate Recruitment Cell',
      'brand': 'Flagship Vidyavihar Autonomous Campus',
      'fest': 'Premier Central Line Cultural Life',
      default: 'Somaiya Vidyavihar Flagship Campus',
    },
    descriptions: {
      'fest':
        'Sprawling green Vidyavihar campus featuring vibrant student organizations, inter-collegiate cultural fests, and state-of-the-art sports facilities.',
      'brand':
        'Renowned autonomous institution with vast academic alumni network, modern infrastructure, and multidisciplinary subject choices.',
      'placements':
        'High-octane placement partnerships with Fortune 500 banks and consulting firms, directly accessible from Vidyavihar station.',
      default:
        'Somaiya Vidyavihar flagship campus for Central Line students offering comprehensive undergraduate Commerce and Management tracks.',
    },
  },
  {
    id: 'ruparel-college',
    name: 'D.G. Ruparel College of Arts, Science & Commerce',
    canonicalRegion: 'Central Suburbs',
    locationDisplay: 'Matunga / Dadar West, Central Suburbs • 3 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['B.Com', 'BMS', 'B.Sc', 'BA'],
    morningShift: true,
    topPlacements: false,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'ca-flexibility': 'Matunga Early Lecture Shift',
      'brand': 'Historic Matunga Legacy Institution',
      'fest': 'Vibrant Matunga College Culture',
      default: 'Matunga / Dadar Academic Landmark',
    },
    descriptions: {
      'brand':
        'Historic academic powerhouse near Matunga West and Dadar Station. Renowned for analytical rigor, competitive entrance prep, and distinguished alumni.',
      'ca-flexibility':
        'Early morning lecture shifts enable students commuting via Central and Western transit to manage professional certification coursework.',
      default:
        'Premier academic landmark near Matunga West and Dadar Station for science, commerce, and management.',
    },
  },

  // ── South Mumbai ───────────────────────────────────────────────────────────
  {
    id: 'hinduja',
    name: 'K.P.B. Hinduja College of Commerce',
    canonicalRegion: 'South Mumbai',
    locationDisplay: 'Charni Road, South Mumbai • 2 min from station',
    streams: ['Commerce'],
    courses: ['B.Com', 'BAF', 'BFM', 'BBI', 'BMS', 'B.Sc IT'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: false,
    hasFyjc: true,
    badges: {
      'ca-flexibility': 'Premier CA Articleship Schedule',
      'placements': 'South Mumbai BFSI Placement Cell',
      'brand': 'Autonomous CA Rankholder Ecosystem',
      default: 'South Mumbai CA & Commerce Hub',
    },
    descriptions: {
      'ca-flexibility':
        'Lectures wrap up at 10:15 AM sharp, allowing students to travel to Churchgate and Nariman Point Big 4 audit offices for articleship. Highest CA rankholder network in South Mumbai.',
      'placements':
        'Strategic recruitment pipeline into top accounting, auditing, and corporate finance firms across South Mumbai.',
      default:
        'Legendary CA ranker ecosystem 4 mins from Charni Road station with early morning lecture band (6:45 AM).',
    },
  },
  {
    id: 'hr-college',
    name: 'H.R. College of Commerce & Economics',
    canonicalRegion: 'South Mumbai',
    locationDisplay: 'Churchgate, South Mumbai • 3 min from station',
    streams: ['Commerce'],
    courses: ['B.Com', 'BAF', 'BMS'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'placements': 'Nariman Point Placement Corridor',
      'brand': 'Premier Finance & Economics Legacy',
      'ca-flexibility': 'Churchgate Articleship Sync',
      default: 'Churchgate Finance Corridor',
    },
    descriptions: {
      'placements':
        'Direct proximity to Nariman Point financial district. World-class alumni network across Morgan Stanley, KPMG, and EY.',
      'brand':
        'Elite commerce ecosystem 5 mins walk from Churchgate station with international corporate partnerships and high-impact student societies.',
      default:
        'Premier finance and commerce ecosystem 5 mins walk from Churchgate station.',
    },
  },
  {
    id: 'xaviers',
    name: "St. Xavier's College (Autonomous)",
    canonicalRegion: 'South Mumbai',
    locationDisplay: 'Dhobi Talao / Fort, South Mumbai • 6 min from station',
    streams: ['Arts', 'Commerce', 'Science'],
    courses: ['BMS', 'B.Com', 'BA', 'B.Sc'],
    morningShift: false,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'brand': 'Historic Autonomous Excellence',
      'fest': 'Home of Malhar Cultural Festival',
      'placements': 'Tier-1 Consulting & Corporate Recruitment',
      default: 'South Mumbai Heritage Campus',
    },
    descriptions: {
      'brand':
        'Historic legacy campus with renowned analytical rigor, entrance test selection, and global alumni network.',
      'fest':
        'Host of Malhar, Mumbai’s most iconic college festival, fostering unmatched creative leadership and student autonomy.',
      default:
        'Historic legacy campus with renowned analytical rigor, entrance test selection, and global alumni network.',
    },
  },
  {
    id: 'jai-hind',
    name: 'Jai Hind College (Autonomous)',
    canonicalRegion: 'South Mumbai',
    locationDisplay: 'Churchgate, South Mumbai • 5 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['BMS', 'BAF', 'BFM', 'BAMMC', 'B.Sc Data Science'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'placements': 'Premier Corporate Placement Cell',
      'brand': 'Autonomous Seafront Institution',
      default: 'Churchgate Seafront Corporate Hub',
    },
    descriptions: {
      'placements':
        'Prestigious South Mumbai institution renowned for corporate placements, data science, and business management.',
      default:
        'Prestigious South Mumbai institution renowned for corporate placements, data science, and business management.',
    },
  },
  {
    id: 'sophia-college',
    name: 'Sophia College for Women',
    canonicalRegion: 'South Mumbai',
    locationDisplay: 'Grant Road / Pedder Road, South Mumbai • 8 min from station',
    streams: ['Arts', 'Science'],
    courses: ['BA', 'B.Sc', 'BMS', 'BMM'],
    morningShift: false,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'brand': 'Historic Women’s Autonomous Excellence',
      'fest': 'Home of Kaleidoscope Festival',
      default: 'Pedder Road Heritage Campus',
    },
    descriptions: {
      default:
        'Historic women’s degree institution situated on Pedder Road near Grant Road Station with celebrated arts, media, and science programs.',
    },
  },
  {
    id: 'wilson-college',
    name: 'Wilson College',
    canonicalRegion: 'South Mumbai',
    locationDisplay: 'Charni Road / Chowpatty, South Mumbai • 2 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['B.Com', 'BMS', 'BAF', 'BAMMC', 'B.Sc'],
    morningShift: false,
    topPlacements: false,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      default: 'Seafront Heritage Campus',
    },
    descriptions: {
      default:
        'Heritage seafront college campus directly opposite Chowpatty beach and Charni Road Station.',
    },
  },
  {
    id: 'md-college',
    name: 'Maharshi Dayanand (MD) College',
    canonicalRegion: 'South Mumbai',
    locationDisplay: 'Parel, South Mumbai • 4 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['B.Com', 'BMS', 'BAF', 'B.Sc'],
    morningShift: true,
    topPlacements: false,
    autonomousBrand: false,
    festCulture: false,
    hasFyjc: true,
    badges: {
      default: 'Parel Central Corridor Campus',
    },
    descriptions: {
      default:
        'Strategic central campus in Parel near Lower Parel commercial belts with morning shifts for working and professional students.',
    },
  },

  // ── Western Suburbs ────────────────────────────────────────────────────────
  {
    id: 'mithibai',
    name: 'Mithibai College of Arts & Commerce',
    canonicalRegion: 'Western Suburbs',
    locationDisplay: 'Vile Parle West, Western Suburbs • 5 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['B.Com', 'BMS', 'BAF', 'BFM'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'fest': 'Home of Umang Cultural Fest',
      'ca-flexibility': 'Western Suburbs CA Articleship Sync',
      'placements': 'High-Volume Big 4 Corporate Hiring',
      default: 'Premier Western Suburbs SVKM Campus',
    },
    descriptions: {
      'ca-flexibility':
        'Morning shifts allow CA articleship prep and corporate internships in BKC. High Big 4 recruitment and premier SVKM campus facilities.',
      'fest':
        'Host of Umang, Mumbai’s celebrated youth festival. Unbeatable student energy, networking, and creative society leadership.',
      default:
        'Western line premier campus with morning shift options for CA aspirants and strong FMCG/BFSI placements.',
    },
  },
  {
    id: 'nm-college',
    name: 'Narsee Monjee College of Commerce & Economics',
    canonicalRegion: 'Western Suburbs',
    locationDisplay: 'Vile Parle West, Western Suburbs • 5 min from station',
    streams: ['Commerce'],
    courses: ['B.Com', 'BAF', 'BFM', 'BMS', 'B.Sc IT'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: false,
    hasFyjc: true,
    badges: {
      'ca-flexibility': 'Elite CA Articleship Schedule',
      'placements': 'Highest Average Commerce CTC',
      'brand': 'Highest Board Cutoff Benchmark',
      default: 'SVKM Flagship Commerce Campus',
    },
    descriptions: {
      'ca-flexibility':
        'SVKM flagship commerce institution with highest academic board cutoffs, early lectures, and premier Big 4 recruitment.',
      default:
        'SVKM flagship commerce institution with the highest academic board cutoffs and premier Big 4 recruitments.',
    },
  },
  {
    id: 'bhavans-college',
    name: "Bhavan's College (Autonomous)",
    canonicalRegion: 'Western Suburbs',
    locationDisplay: 'Andheri West, Western Suburbs • 6 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['B.Com', 'BMS', 'BAF', 'B.Sc', 'BA'],
    morningShift: false,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'brand': 'Autonomous Andheri Green Campus',
      default: 'Andheri West Academic Landmark',
    },
    descriptions: {
      default:
        'Sprawling green campus in Andheri West offering top undergraduate Commerce and Management tracks with autonomous syllabus.',
    },
  },
  {
    id: 'dahanukar-college',
    name: 'M.L. Dahanukar College of Commerce',
    canonicalRegion: 'Western Suburbs',
    locationDisplay: 'Vile Parle East, Western Suburbs • 3 min from station',
    streams: ['Commerce'],
    courses: ['B.Com', 'BAF', 'BMS', 'BFM'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: false,
    festCulture: false,
    hasFyjc: true,
    badges: {
      'ca-flexibility': 'Vile Parle East CA Schedule Sync',
      default: 'Vile Parle East Commerce Landmark',
    },
    descriptions: {
      'ca-flexibility':
        'Renowned commerce college 3 mins walk from Vile Parle East station with dedicated morning shifts for CA aspirants.',
      default:
        'Renowned commerce college 3 mins walk from Vile Parle East station.',
    },
  },
  {
    id: 'nagindas-khandwala',
    name: 'Nagindas Khandwala College of Commerce & Arts',
    canonicalRegion: 'Western Suburbs',
    locationDisplay: 'Malad West, Western Suburbs • 5 min from station',
    streams: ['Commerce', 'Arts'],
    courses: ['B.Com', 'BAF', 'BMS', 'BFM', 'B.Sc IT'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: false,
    hasFyjc: false,
    badges: {
      default: 'Malad West Autonomous Hub',
    },
    descriptions: {
      default:
        'Premier autonomous institute in Malad West known for corporate tie-ups and FinTech degree courses.',
    },
  },
  {
    id: 'kes-shroff',
    name: 'K.E.S. Shroff College of Arts & Commerce',
    canonicalRegion: 'Western Suburbs',
    locationDisplay: 'Kandivali West, Western Suburbs • 6 min from station',
    streams: ['Commerce', 'Arts'],
    courses: ['B.Com', 'BAF', 'BMS', 'BBI', 'B.Sc Data Science'],
    morningShift: false,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: false,
    hasFyjc: false,
    badges: {
      default: 'Kandivali Autonomous Career Track',
    },
    descriptions: {
      default:
        'Fastest-growing autonomous institution in Kandivali West with updated industry skill tracks.',
    },
  },
  {
    id: 'rizvi-college',
    name: 'Rizvi College of Arts, Science & Commerce',
    canonicalRegion: 'Western Suburbs',
    locationDisplay: 'Bandra West, Western Suburbs • 8 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['B.Com', 'BAF', 'BMS', 'B.Sc IT'],
    morningShift: false,
    topPlacements: false,
    autonomousBrand: false,
    festCulture: true,
    hasFyjc: true,
    badges: {
      default: 'Bandra West Campus',
    },
    descriptions: {
      default:
        'Prominent Bandra West institution close to Carter Road and Bandra railway station.',
    },
  },

  // ── Eastern Suburbs ────────────────────────────────────────────────────────
  {
    id: 'vaze-college',
    name: 'V.G. Vaze College of Arts, Science & Commerce',
    canonicalRegion: 'Eastern Suburbs',
    locationDisplay: 'Mulund East, Eastern Suburbs • 5 min from station',
    streams: ['Commerce', 'Arts', 'Science'],
    courses: ['B.Com', 'BAF', 'BMS', 'B.Sc IT'],
    morningShift: true,
    topPlacements: true,
    autonomousBrand: true,
    festCulture: true,
    hasFyjc: true,
    badges: {
      'fest': 'Home of Dimensions Festival',
      'brand': 'Autonomous Mulund Academic Benchmark',
      default: 'Eastern Suburbs Academic Benchmark',
    },
    descriptions: {
      default:
        'Top-ranked autonomous college in Mulund East serving Bhandup, Mulund and Thane commuters with exceptional academic and fest track records.',
    },
  },
];

/**
 * Normalizes location inputs from wizards, URLs, or radio values into a canonical region.
 */
export function normalizeLocationPreference(location: string | null | undefined): string {
  if (!location) return 'All Mumbai';
  const trimmed = location.trim();
  const lower = trimmed.toLowerCase();

  if (['all', 'all-mumbai', 'all mumbai', 'any', 'any region'].includes(lower)) {
    return 'All Mumbai';
  }

  const resolved = resolveCanonicalRegion(trimmed);
  if (resolved) return resolved;

  // Fallback checks for common keyword tokens
  if (lower.includes('central')) return 'Central Suburbs';
  if (lower.includes('south')) return 'South Mumbai';
  if (lower.includes('west')) return 'Western Suburbs';
  if (lower.includes('east')) return 'Eastern Suburbs';
  if (lower.includes('harbour')) return 'Harbour / Central-East';

  return 'All Mumbai';
}

/**
 * Generates personalized college recommendations strictly enforcing location eligibility.
 *
 * Implements the required 7-step pipeline:
 * Step A: Collect user wizard answers
 * Step B: Normalize location to canonical region
 * Step C: Retrieve candidates from verified college dataset
 * Step D: Apply location eligibility constraint (HARD FILTER)
 * Step E: Apply academic / stage constraints
 * Step F: Score & rank remaining eligible colleges
 * Step G: Return top recommendations (or empty array if no matches)
 */
export function generateRecommendations(
  query: RecommendationQuery
): RecommendationResult[] {
  const diagnostics = getRecommendationDiagnostics(query);
  return diagnostics.finalRecommendations;
}

/**
 * Generates recommendations along with detailed execution diagnostics for testing.
 */
export function getRecommendationDiagnostics(
  query: RecommendationQuery
): RecommendationDiagnostics {
  // Step A: Collect user answers
  const { stage, interests = [], location, priority = 'ca-flexibility', limit } = query;

  // Step B: Normalize location preference
  const normalizedRegion = normalizeLocationPreference(location);

  // Step C: Retrieve candidate colleges from verified master profiles with strict deduplication
  const uniqueCandidateMap = new Map<string, CollegeRecommendationProfile>();
  for (const profile of COLLEGE_PROFILES) {
    if (!uniqueCandidateMap.has(profile.id)) {
      uniqueCandidateMap.set(profile.id, profile);
    }
  }
  const initialCandidates = Array.from(uniqueCandidateMap.values());
  const initialCandidateCount = initialCandidates.length;
  const totalCandidatesBeforeFilter = initialCandidateCount;

  // Step D: Apply location eligibility constraint (HARD FILTER)
  // If a region is specified, colleges MUST belong strictly to that canonical region.
  const locationEligible = initialCandidates.filter((col) => {
    if (normalizedRegion === 'All Mumbai') return true;
    return col.canonicalRegion === normalizedRegion;
  });

  const remainingAfterLocationFilter = locationEligible.length;

  // If no colleges exist in the selected location, return empty immediately.
  // NEVER fall back to colleges from other regions.
  if (locationEligible.length === 0) {
    return {
      query,
      normalizedRegion,
      initialCandidateCount,
      totalCandidatesBeforeFilter,
      remainingAfterLocationFilter: 0,
      remainingAfterAcademicFilter: 0,
      countAfterDeduplication: 0,
      totalEligibleScored: 0,
      totalRendered: 0,
      hiddenCount: 0,
      finalRecommendations: [],
    };
  }

  // Step E: Apply stage / course constraints
  // If student is interested in science/tech, check science/tech offerings.
  const academicEligible = locationEligible.filter((col) => {
    if (interests.includes('tech-coding')) {
      const hasTech = col.courses.some((c) =>
        ['B.Sc IT', 'B.Sc Data Science', 'B.Sc'].includes(c)
      );
      // Soft filter: if at least one college in the region has tech, prioritize them
      const anyInRegionHasTech = locationEligible.some((c) =>
        c.courses.some((course) =>
          ['B.Sc IT', 'B.Sc Data Science', 'B.Sc'].includes(course)
        )
      );
      if (anyInRegionHasTech && !hasTech) return false;
    }
    return true;
  });

  const remainingAfterAcademicFilter = academicEligible.length;
  const candidatesToScore =
    academicEligible.length > 0 ? academicEligible : locationEligible;

  // Deduplicate candidates to score by ID
  const deduplicatedCandidates = Array.from(
    new Map(candidatesToScore.map((c) => [c.id, c])).values()
  );
  const countAfterDeduplication = deduplicatedCandidates.length;

  // Step F: Score & rank remaining eligible colleges
  const scored = deduplicatedCandidates.map((col) => {
    let score = 50; // Base score

    // 1. Stage alignment (up to 20 pts)
    if (stage === 'class10' && col.hasFyjc) score += 20;
    if (stage === 'class12-commerce' && col.streams.includes('Commerce')) score += 20;
    if (stage === 'class12-science' && col.streams.includes('Science')) score += 20;
    if (stage === 'undergrad' && col.topPlacements) score += 20;

    // 2. Interests alignment (up to 20 pts)
    if (
      interests.includes('commerce-finance') &&
      col.courses.some((c) => ['B.Com', 'BAF', 'BFM'].includes(c))
    ) {
      score += 15;
    }
    if (
      interests.includes('management-bms') &&
      col.courses.some((c) => ['BMS', 'BBA'].includes(c))
    ) {
      score += 15;
    }
    if (
      interests.includes('tech-coding') &&
      col.courses.some((c) => ['B.Sc IT', 'B.Sc Data Science'].includes(c))
    ) {
      score += 20;
    }
    if (
      interests.includes('design-media') &&
      col.courses.some((c) => ['BAMMC', 'BMM', 'BA'].includes(c))
    ) {
      score += 20;
    }

    // 3. Priority alignment (up to 25 pts)
    if (priority === 'ca-flexibility' && col.morningShift) score += 25;
    if (priority === 'placements' && col.topPlacements) score += 25;
    if (priority === 'brand' && col.autonomousBrand) score += 25;
    if (priority === 'fest' && col.festCulture) score += 25;

    // Pick contextual badge and description
    const badge = col.badges[priority] || col.badges.default;
    const desc = col.descriptions[priority] || col.descriptions.default;

    return {
      college: col,
      score,
      badge,
      desc,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);
  const totalEligibleScored = scored.length;

  // Step G: Render recommendations with calibrated match rates
  // If query specifies an explicit limit > 0, honor it; otherwise return ALL eligible colleges!
  const resultsToRender =
    typeof limit === 'number' && limit > 0 ? scored.slice(0, limit) : scored;

  const totalRendered = resultsToRender.length;
  const hiddenCount = Math.max(0, totalEligibleScored - totalRendered);

  const topScore = scored[0]?.score || 100;
  const finalRecommendations: RecommendationResult[] = resultsToRender.map(
    (item, index) => {
      // Dynamic match rate: top result gets 98%, subsequent matches scale smoothly
      const diff = topScore - item.score;
      const matchRateNum = Math.max(
        78,
        Math.min(98, 98 - Math.round(diff * 0.5) - Math.floor(index / 2))
      );

      return {
        id: item.college.id,
        name: item.college.name,
        badge: item.badge,
        location: item.college.locationDisplay,
        canonicalRegion: item.college.canonicalRegion,
        desc: item.desc,
        matchRate: `${matchRateNum}% Match`,
        score: item.score,
        actionText: `Explore ${item.college.name.split(' ')[0]} College`,
      };
    }
  );

  return {
    query,
    normalizedRegion,
    initialCandidateCount,
    totalCandidatesBeforeFilter,
    remainingAfterLocationFilter,
    remainingAfterAcademicFilter,
    countAfterDeduplication,
    totalEligibleScored,
    totalRendered,
    hiddenCount,
    finalRecommendations,
  };
}
