import { CareerGoal, CollegeDetail, ComparisonProfile, SearchResultItem, ShortlistItem } from '../types';
import { FYJC_CUTOFFS } from './fyjcCutoffs';

export const INITIAL_SAVED_ITEMS: ShortlistItem[] = [
  {
    id: 'res-3',
    category: 'college',
    title: 'Mithibai College of Arts & Commerce',
    regionBadge: 'Western Suburbs',
    badgeType: 'COLLEGE',
    locationInfo: 'Offered: B.Com, BMS, BAF, BFM • Approx. ₹32,000–₹55,000/yr',
    timeSavedText: 'Saved 2 days ago',
    lineText: 'Western Line',
    iconType: 'school',
    canCompare: true,
    collegeId: 'mithibai',
  },
  {
    id: 'res-2',
    category: 'college',
    title: 'H.R. College of Commerce & Economics',
    regionBadge: 'South Mumbai',
    badgeType: 'COLLEGE',
    locationInfo: 'Offered: B.Com, BAF, BMS • Approx. ₹28,000–₹48,000/yr',
    timeSavedText: 'Saved yesterday',
    lineText: 'South Mumbai',
    iconType: 'school',
    canCompare: true,
    collegeId: 'hr-college',
  },
];

export const MITHIBAI_DETAILS: CollegeDetail = {
  id: 'mithibai',
  badge: 'Autonomous Institution • SVKM Campus',
  name: 'Mithibai College',
  subName: 'Chauhan Institute of Science & A.J. College of Commerce and Economics',
  location: 'Vile Parle West, Mumbai',
  transitDetail: '400m from Vile Parle Station (Western Line)',
  commuteTime: '5-minute walk from platform 1',
  commuteHeading: '5-minute walk from platform 1',
  commuteDescription:
    'Located on Bhaktivedanta Swami Marg. Zero auto-rickshaw dependency for students commuting via Western suburban trains from Borivali, Andheri, or Churchgate.',
  commuteBadge: 'Suburban transit hub • Western Corridor',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDmfSrG88tfxM0YGs6elSlkk40cTWLs1Cc1KW4K1MdPaPPGamFuX2U19DFboQzzDkN8PovZbPnTVVQAmg4ezk60FVodp5FFwv6L-ExxNHJG5lJEsmyBhEDwrRsJgYdp6oxtQ-1mWtzfG0GRB6LdxIaLMID5dr69xYbLxBEOtJ2SBR_zCJ_DyhMF8Elq5_gKsVCvJoi4TuMC6HPqhbLheouPJqi872grVbqhpBJM8DByo6Ia93p2Eh4Ypg',
  whyFit: [
    {
      icon: 'domain_verification',
      title: 'Matches your focus on Commerce and Management in Western Suburbs.',
      description: 'Direct academic credibility for finance and management pathways without traveling past Bandra.',
      iconColor: 'tertiary',
    },
    {
      icon: 'directions_walk',
      title: 'Practical commute for Western line students.',
      description: 'Saves 45–60 minutes daily compared to South Mumbai campuses, preserving critical study and internship bandwidth.',
      iconColor: 'secondary',
    },
    {
      icon: 'groups',
      title: 'Very active corporate placement cell and vibrant campus culture.',
      description: 'Hosts premier Mumbai collegiate festivals alongside recruiters like Deloitte, KPMG, EY, and boutique consulting houses.',
      iconColor: 'primary',
    },
  ],
  keyFacts: [
    {
      label: 'Programs Offered',
      value: 'B.Com, BMS, BAF, BFM, BBI',
      description: 'Specialized finance degrees with updated autonomous curricula aligned with industry standards.',
    },
    {
      label: 'Annual Fee Range',
      value: '₹32,000 – ₹55,000 / yr',
      description: 'Covers aided traditional courses up to self-financed professional cohorts (approximate SVKM structure).',
    },
    {
      label: 'Academic Affiliation',
      value: 'Autonomous Institution',
      description: 'Affiliated with University of Mumbai & governed under the Shri Vile Parle Kelavani Mandal (SVKM).',
    },
    {
      label: 'Daily Schedule & Timings',
      value: 'Morning Shift Options',
      description: 'Standard 7:00 AM – 11:30 AM lecture bands, specifically accommodating concurrent CA / CFA articleship prep.',
    },
  ],
  isRightForYou: {
    strongFit:
      'You want strong peer competition, brand recognition across Mumbai’s finance districts, and an active campus atmosphere where extracurricular initiatives matter as much as grades.',
    keepInMind:
      'High cutoff requirements (consistently 92%+ for General Category across top streams) and a non-negotiable 75% biometric attendance mandate rigorously audited before hall tickets are issued.',
  },
  compareTargetName: 'H.R. College or NMIMS',
};

export const HR_COLLEGE_DETAILS: CollegeDetail = {
  id: 'hr-college',
  badge: 'HSNC University • Heritage Institution',
  name: 'H.R. College of Commerce & Economics',
  subName: 'Premier College for Commerce, Banking & Capital Markets',
  location: 'Churchgate, South Mumbai',
  transitDetail: '300m from Churchgate Terminus (Western Line)',
  commuteTime: '3-minute walk from Churchgate terminal',
  commuteHeading: '3-minute walk from Churchgate terminal',
  commuteDescription:
    'Situated right at Vidyasagar Principal K.M. Kundnani Chowk. Unmatched direct access for Western corridor commuters without crossing streets or changing lines.',
  commuteBadge: 'Historic BFSI Hub • Nariman Point Corridor',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDmfSrG88tfxM0YGs6elSlkk40cTWLs1Cc1KW4K1MdPaPPGamFuX2U19DFboQzzDkN8PovZbPnTVVQAmg4ezk60FVodp5FFwv6L-ExxNHJG5lJEsmyBhEDwrRsJgYdp6oxtQ-1mWtzfG0GRB6LdxIaLMID5dr69xYbLxBEOtJ2SBR_zCJ_DyhMF8Elq5_gKsVCvJoi4TuMC6HPqhbLheouPJqi872grVbqhpBJM8DByo6Ia93p2Eh4Ypg',
  whyFit: [
    {
      icon: 'domain_verification',
      title: 'Unrivaled CA and CFA peer cohort network in Mumbai.',
      description: 'Historically the default choice for students pursuing chartered accountancy alongside degree education.',
      iconColor: 'tertiary',
    },
    {
      icon: 'directions_walk',
      title: 'Proximity to Nariman Point, Dalal Street & Fort banking hubs.',
      description: 'Minutes away from leading investment banks, NBFCs, and law firms for year-round internships.',
      iconColor: 'secondary',
    },
    {
      icon: 'groups',
      title: 'Dedicated attendance framework for registered CA articles.',
      description: 'Classes structured to conclude by early morning so students can reach audit firms by 10:00 AM.',
      iconColor: 'primary',
    },
  ],
  keyFacts: [
    {
      label: 'Programs Offered',
      value: 'B.Com, BAF, BFM, BMS, B.Voc',
      description: 'Renowned capital markets and accounting curricula accredited with NAAC A Grade.',
    },
    {
      label: 'Annual Fee Range',
      value: '₹28,000 – ₹48,000 / yr',
      description: 'Aided structure keeps standard B.Com highly affordable; specialized courses are reasonably priced.',
    },
    {
      label: 'Academic Affiliation',
      value: 'HSNC University (Autonomous)',
      description: 'Constituted under Hyderabad (Sind) National Collegiate University.',
    },
    {
      label: 'Daily Schedule & Timings',
      value: 'Early Morning (6:45 AM – 10:30 AM)',
      description: 'Optimized specifically to enable corporate articleships in South Mumbai finance firms.',
    },
  ],
  isRightForYou: {
    strongFit:
      'You are committed to CA, CFA, or investment banking careers and prioritize morning attendance flexibility alongside access to South Mumbai financial institutions.',
    keepInMind:
      'Campus physical grounds are compact compared to suburban campuses, with intense academic focus and competitive admission cutoffs exceeding 94%.',
  },
  compareTargetName: 'Mithibai or NMIMS',
};

export const HINDUJA_COLLEGE_DETAILS: CollegeDetail = {
  id: 'hinduja',
  badge: 'Autonomous Institution • South Mumbai Commerce Landmark',
  name: 'K.P.B. Hinduja College of Commerce',
  subName: 'Smt. P.D. Hinduja Trust’s Autonomous College of Commerce & Economics',
  location: '315, New Charni Road, Charni Road East, Mumbai',
  transitDetail: '250m from Charni Road Station (Western Line)',
  commuteTime: '4-minute walk from Charni Road platform 1',
  commuteHeading: '4-minute direct walk from Charni Road platform',
  commuteDescription:
    'Located on New Charni Road with zero auto-rickshaw dependency for Western Line students from Churchgate up to Borivali & Virar. 1 stop from Marine Lines and 2 from Churchgate.',
  commuteBadge: 'Western Line Direct • 4-min Walk',
  image:
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
  whyFit: [
    {
      icon: 'domain_verification',
      title: 'Dedicated attendance framework & timetable for CA articles.',
      description: 'Lectures structured from 6:45 AM to 10:15 AM, enabling students to reach audit and advisory firms in Nariman Point, Lower Parel, and BKC on time.',
      iconColor: 'tertiary',
    },
    {
      icon: 'directions_walk',
      title: 'Walkable from Charni Road railway station.',
      description: 'Just 250 meters from platform 1. Eliminates Mumbai peak-hour road traffic completely.',
      iconColor: 'secondary',
    },
    {
      icon: 'groups',
      title: 'Legendary CA ranker ecosystem & rich course spectrum.',
      description: 'Produces top All-India CA Foundation and Inter rankers year after year, with tailored courses in BAF, BFM, BBI, BMS, and B.Sc IT.',
      iconColor: 'primary',
    },
  ],
  keyFacts: [
    {
      label: 'Programs Offered',
      value: 'B.Com, BAF, BFM, BBI, BMS, B.Sc IT, BAMMC',
      description: 'Comprehensive specialized commerce, banking, and media programs with autonomous academic flexibility.',
    },
    {
      label: 'Annual Fee Range',
      value: '₹22,000 – ₹46,000 / yr',
      description: 'Government-aided standard B.Com is remarkably affordable; self-financed professional streams are reasonably priced.',
    },
    {
      label: 'Academic Affiliation',
      value: 'Autonomous Institution',
      description: 'Autonomous status affiliated with University of Mumbai; managed by Smt. P.D. Hinduja Trust.',
    },
    {
      label: 'Daily Schedule & Timings',
      value: 'Early Morning (6:45 AM – 10:15 AM)',
      description: 'Optimized specifically so registered CA articles can complete their ICAI articleship mandates.',
    },
  ],
  isRightForYou: {
    strongFit:
      'You are committed to Chartered Accountancy (CA), financial accounting, or stock markets and need an accommodating morning schedule coupled with convenient Western Line transit in South Mumbai.',
    keepInMind:
      'Cutoffs for professional courses (BAF, BMS, BFM) routinely exceed 91%; vertical city campus footprint in classic South Mumbai style with intense academic focus.',
  },
  compareTargetName: 'H.R. College or Podar',
};

export const PODAR_COLLEGE_DETAILS: CollegeDetail = {
  id: 'podar',
  badge: 'Autonomous • NAAC A+ • Central Mumbai Landmark',
  name: 'R.A. Podar College of Commerce & Economics',
  subName: 'Shikshana Prasaraka Mandali’s Premier Autonomous Institution',
  location: 'L.N. Road, Matunga Central, Mumbai',
  transitDetail: '400m from Matunga Central Railway Station',
  commuteTime: '5-minute walk from Matunga station',
  commuteHeading: '5-minute walk from Matunga Central platform',
  commuteDescription:
    'Located in academic hub of Matunga. Direct connectivity for Central Line students from Thane, Kalyan, Mulund, Ghatkopar, and Dadar, plus 8-min walk from King’s Circle on Harbour Line.',
  commuteBadge: 'Central & Harbour Lines Accessible • Matunga',
  image:
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  whyFit: [
    {
      icon: 'domain_verification',
      title: 'Top producer of All-India CA Foundation & Inter rankers.',
      description: 'Decades-long legacy of academic distinction in accountancy, corporate economics, and actuarial studies.',
      iconColor: 'tertiary',
    },
    {
      icon: 'directions_walk',
      title: 'Zero-switch commute for Central & Harbour line students.',
      description: 'Eliminates having to change trains to the Western line at Dadar, saving 45 minutes of crowded interchange daily.',
      iconColor: 'secondary',
    },
    {
      icon: 'groups',
      title: 'Active campus committees & corporate placement cell.',
      description: 'Recruiters like Deloitte, KPMG, EY, Morgan Stanley, TresVista, and ICICI Bank regularly visit for campus hiring.',
      iconColor: 'primary',
    },
  ],
  keyFacts: [
    {
      label: 'Programs Offered',
      value: 'B.Com, BMS, BAF, BFM, BAS (Actuarial Studies)',
      description: 'Offers unique specialized Actuarial Studies and financial markets curricula alongside traditional B.Com.',
    },
    {
      label: 'Annual Fee Range',
      value: '₹18,000 – ₹38,000 / yr',
      description: 'Aided framework ensures low tuition fees with high academic return on investment.',
    },
    {
      label: 'Academic Affiliation',
      value: 'Autonomous • S.P. Mandali',
      description: 'Affiliated with University of Mumbai; managed by Shikshana Prasaraka Mandali.',
    },
    {
      label: 'Daily Schedule & Timings',
      value: 'Early Morning (7:00 AM – 10:45 AM)',
      description: 'Convenient morning lecture slots accommodate professional study and internships.',
    },
  ],
  isRightForYou: {
    strongFit:
      'You travel along the Central or Harbour railway line, desire an elite commerce institution with proven CA track records, and appreciate a studious yet balanced college atmosphere in Matunga.',
    keepInMind:
      'Cutoffs are consistently high (93%–96% for HSC General). Strict adherence to internal autonomous assessments and mid-term presentations.',
  },
  compareTargetName: 'Hinduja or Mithibai',
};

export const JAI_HIND_COLLEGE_DETAILS: CollegeDetail = {
  id: 'jai-hind',
  badge: 'Autonomous • Marine Drive Corridor',
  name: 'Jai Hind College',
  subName: 'Sind Educationists’ Association • Autonomous Institution',
  location: '“A” Road, Churchgate, Marine Drive, South Mumbai',
  transitDetail: '600m from Churchgate Terminus (Western Line)',
  commuteTime: '7-minute walk from Churchgate terminal',
  commuteHeading: '7-minute walk along “A” Road',
  commuteDescription:
    'Prime location overlooking Marine Drive. Direct walking access from Churchgate terminus and Marine Lines for Western Line students.',
  commuteBadge: 'South Mumbai Marine Drive Hub',
  image:
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
  whyFit: [
    {
      icon: 'domain_verification',
      title: 'Top corporate BMS and Media (BAMMC) reputation.',
      description: 'Known for high-octane corporate business presentations, industry guest lecturers, and lively entrepreneurial culture.',
      iconColor: 'tertiary',
    },
    {
      icon: 'directions_walk',
      title: 'Walking distance to South Mumbai business houses.',
      description: 'Near corporate headquarters, media agencies in Fort, and boutique finance firms in Nariman Point.',
      iconColor: 'secondary',
    },
    {
      icon: 'groups',
      title: 'Cutting-edge curricula including B.Sc Data Science.',
      description: 'Partnerships with global tech & consulting firms with recruiters like Morgan Stanley, JP Morgan, Google, and Schbang.',
      iconColor: 'primary',
    },
  ],
  keyFacts: [
    {
      label: 'Programs Offered',
      value: 'BMS, BAF, BFM, BAMMC, B.Sc Data Science & Analytics',
      description: 'Offers modern interdisciplinary tracks in business analytics, digital media, and financial markets.',
    },
    {
      label: 'Annual Fee Range',
      value: '₹35,000 – ₹65,000 / yr',
      description: 'Reflects autonomous self-financed specialized degrees with modern lab facilities.',
    },
    {
      label: 'Academic Affiliation',
      value: 'Autonomous Institution',
      description: 'Affiliated with University of Mumbai; run by Sind Educationists’ Association.',
    },
    {
      label: 'Daily Schedule & Timings',
      value: 'Morning & Afternoon Shift Bands',
      description: 'Regular schedule from 7:30 AM – 1:00 PM with seminar modules in the afternoon.',
    },
  ],
  isRightForYou: {
    strongFit:
      'You are looking for a vibrant, prestigious South Mumbai college experience with outstanding business management, data analytics, and media connections.',
    keepInMind:
      'High entrance test and board cutoffs (94%+), and attendance policies are strictly monitored across all autonomous semesters.',
  },
  compareTargetName: 'H.R. College or Mithibai',
};

export const NM_COLLEGE_DETAILS: CollegeDetail = {
  id: 'nm-college',
  badge: 'Autonomous • SVKM Flagship Commerce Institution',
  name: 'Narsee Monjee College of Commerce & Economics',
  subName: 'Shri Vile Parle Kelavani Mandal (NM College)',
  location: 'J.V.P.D. Scheme, Vile Parle West, Mumbai',
  transitDetail: '550m from Vile Parle Station (Western Line)',
  commuteTime: '6-minute walk from Vile Parle platform 1',
  commuteHeading: '6-minute walk from Vile Parle West station',
  commuteDescription:
    'Located in the heart of the SVKM education complex in Vile Parle West. Easy walking distance from the railway station for Western suburban students.',
  commuteBadge: 'Western Line SVKM Hub',
  image:
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1200&q=80',
  whyFit: [
    {
      icon: 'domain_verification',
      title: 'Highest academic commerce cutoffs in Mumbai.',
      description: 'Unmatched peer benchmark for accounting, finance, and economics in the Western suburbs.',
      iconColor: 'tertiary',
    },
    {
      icon: 'directions_walk',
      title: 'Saves 45–60 mins commute compared to South Mumbai.',
      description: 'Western corridor students avoid traveling past Bandra while still getting an elite brand name.',
      iconColor: 'secondary',
    },
    {
      icon: 'groups',
      title: 'Direct recruitment by Big 4 audit and global consulting firms.',
      description: 'Deloitte, PwC, EY, KPMG, Barclays, and Nomura run dedicated on-campus hiring drives.',
      iconColor: 'primary',
    },
  ],
  keyFacts: [
    {
      label: 'Programs Offered',
      value: 'B.Com, BAF, BFM, BMS, B.Sc IT',
      description: 'Renowned programs with updated autonomous syllabi recognized across global universities.',
    },
    {
      label: 'Annual Fee Range',
      value: '₹30,000 – ₹52,000 / yr',
      description: 'Standard SVKM autonomous fee structure for aided and specialized cohorts.',
    },
    {
      label: 'Academic Affiliation',
      value: 'Autonomous • SVKM Campus',
      description: 'Affiliated with University of Mumbai; governed by Shri Vile Parle Kelavani Mandal.',
    },
    {
      label: 'Daily Schedule & Timings',
      value: 'Morning Shifts (7:00 AM – 11:30 AM)',
      description: 'Accommodating timetable allowing students to prepare for CA Foundation and Inter.',
    },
  ],
  isRightForYou: {
    strongFit:
      'You are a high academic achiever (94%+) seeking intense peer competition and top-tier placement opportunities in the Western suburbs.',
    keepInMind:
      'Demanding academic standards and rigorous 75% attendance policy enforced through biometric check-ins.',
  },
  compareTargetName: 'Mithibai or H.R. College',
};

export const XAVIERS_COLLEGE_DETAILS: CollegeDetail = {
  id: 'xaviers',
  badge: 'Autonomous Institution • NAAC A++ Grade',
  name: "St. Xavier's College",
  subName: 'Autonomous Institution Affiliated to University of Mumbai',
  location: 'Fort / Dhobi Talao, South Mumbai',
  transitDetail: '600m from CSMT / Churchgate Station',
  commuteTime: '7-minute walk from CSMT station',
  commuteHeading: '7-minute walk from CSMT Terminus',
  commuteDescription:
    'Situated at Mahapalika Marg, Dhobi Talao. Seamless commuting access for students traveling via Central, Harbour, or Western suburban lines.',
  commuteBadge: 'Heritage transit hub • South Mumbai',
  image:
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000',
  whyFit: [
    {
      icon: 'domain_verification',
      title: 'Renowned academic rigor and interdisciplinary honors programs.',
      description: 'Prestigious autonomous curriculum with comprehensive continuous assessment and credit system.',
      iconColor: 'tertiary',
    },
    {
      icon: 'directions_walk',
      title: 'Central location near major suburban railway hubs.',
      description: 'Convenient 7-minute walk from Chhatrapati Shivaji Maharaj Terminus (CSMT).',
      iconColor: 'secondary',
    },
    {
      icon: 'groups',
      title: 'Vibrant campus culture and premier corporate placements.',
      description: 'Hosts Malhar, Mumbai’s iconic inter-collegiate festival, with top global consulting and finance recruiters.',
      iconColor: 'primary',
    },
  ],
  keyFacts: [
    {
      label: 'Programs Offered',
      value: 'B.Com, BMS, BA, B.Sc, B.Sc IT',
      description: 'Specialized degree tracks evaluated under autonomous credit systems.',
    },
    {
      label: 'Annual Fee Range',
      value: '₹35,000 – ₹60,000 / yr',
      description: 'Covers traditional aided degree programs up to self-financed professional cohorts.',
    },
    {
      label: 'Academic Affiliation',
      value: 'Autonomous • NAAC A++',
      description: 'First autonomous college under University of Mumbai with A++ NAAC accreditation.',
    },
    {
      label: 'Selection Criteria',
      value: 'XET Entrance & Merit',
      description: 'BMS admissions selected via St. Xavier’s Entrance Test (XET) and HSC merit criteria.',
    },
  ],
  isRightForYou: {
    strongFit:
      'You seek academic excellence, analytical rigor, holistic development, and a historic campus atmosphere in South Mumbai.',
    keepInMind:
      'Strict 75% attendance rule and rigorous continuous internal evaluation (CIA) system.',
  },
  compareTargetName: 'Jai Hind or H.R. College',
};

export const COLLEGE_DETAILS_MAP: Record<string, CollegeDetail> = {
  mithibai: MITHIBAI_DETAILS,
  'hr-college': HR_COLLEGE_DETAILS,
  hinduja: HINDUJA_COLLEGE_DETAILS,
  podar: PODAR_COLLEGE_DETAILS,
  'jai-hind': JAI_HIND_COLLEGE_DETAILS,
  'nm-college': NM_COLLEGE_DETAILS,
  xaviers: XAVIERS_COLLEGE_DETAILS,
};

export const getCollegeDetails = (id: string): CollegeDetail => {
  if (COLLEGE_DETAILS_MAP[id]) {
    return COLLEGE_DETAILS_MAP[id];
  }

  // Alias map to catch auto-generated slugs from FYJC_CUTOFFS and map them back to predefined static data
  const aliasMap: Record<string, string> = {
    'k-p-b-hinduja-college-of-commerce': 'hinduja',
    'r-a-podar-college-of-commerce-economics': 'podar',
    'narsee-monjee-college-of-commerce-economics': 'nm-college',
    'st-xaviers-college-fort': 'xaviers',
    'h-r-college-of-commerce-economics': 'hr-college',
    'jai-hind-college-churchgate': 'jai-hind',
    'mithibai-college': 'mithibai'
  };

  const aliasId = aliasMap[id] || aliasMap[id.replace(/-mumbai$/, '')];
  if (aliasId && COLLEGE_DETAILS_MAP[aliasId]) {
    return COLLEGE_DETAILS_MAP[aliasId];
  }

  // 1. Try to find it in ALL_SEARCH_RESULTS
  const searchResult = ALL_SEARCH_RESULTS.find(item => item.collegeId === id);
  if (searchResult) {
    return {
      id: id,
      badge: searchResult.badgeCategory + (searchResult.badgeSub ? ` • ${searchResult.badgeSub}` : ''),
      name: searchResult.title,
      subName: searchResult.subtitle || 'College in Mumbai',
      location: searchResult.badgeSub || 'Mumbai',
      transitDetail: 'Access via local transit network',
      commuteTime: 'Standard local commute',
      commuteHeading: 'Commute Overview',
      commuteDescription: 'Accessible from nearby local train and bus stations.',
      commuteBadge: 'Mumbai Transit',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      whyFit: [
        {
          icon: 'domain_verification',
          title: 'Academic Highlights',
          description: searchResult.whyRelevant || 'Reputed institution offering quality programs.',
          iconColor: 'tertiary',
        }
      ],
      keyFacts: [
        {
          label: 'Programs Offered',
          value: 'Degree & Diploma Courses',
          description: 'Offers a variety of specialized courses matching industry standards.',
        }
      ],
      isRightForYou: {
        strongFit: 'You are looking for a reliable educational institution in this region.',
        keepInMind: 'Please verify the latest cutoffs before applying.',
      },
      compareTargetName: 'Other Regional Colleges',
    };
  }

  // 2. Check in FYJC_CUTOFFS (from Excel uploads)
  const normId = id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const matchingFyjc = FYJC_CUTOFFS.filter(c =>
    (c.collegeId && c.collegeId.toLowerCase() === id.toLowerCase()) ||
    c.collegeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === normId
  );

  if (matchingFyjc.length > 0) {
    const primary = matchingFyjc[0];
    const streams = Array.from(new Set(matchingFyjc.map(c => c.stream)));
    const cutoffs = matchingFyjc.map(c => c.cutoff).filter(n => typeof n === 'number' && !isNaN(n));
    const minCutoff = cutoffs.length > 0 ? Math.min(...cutoffs) : null;
    const maxCutoff = cutoffs.length > 0 ? Math.max(...cutoffs) : null;
    
    const words = primary.collegeName.toLowerCase().split(/\s+/);
    const cleanName = words.map(w => {
      if (['and', '&', 'of', 'for', 'in', 'at', 'on', 'the', 'to'].includes(w)) return w;
      if (w === 'jr' || w === 'jr.') return 'Jr.';
      if (w === 'sr' || w === 'sr.') return 'Sr.';
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ').replace(/^(.)/, c => c.toUpperCase());

    const cutoffRange = maxCutoff !== null ? (minCutoff !== null && minCutoff !== maxCutoff ? `${minCutoff}% - ${maxCutoff}%` : `${maxCutoff}%`) : 'Official FYJC';

    return {
      id: id,
      badge: `Affiliated Junior College • ${streams.join(', ')}`,
      name: cleanName,
      subName: `Choice Code: ${primary.choiceCode || 'MU-FYJC'} • ${streams.join(', ')}`,
      location: 'Mumbai Region',
      transitDetail: 'Access via Mumbai suburban railway and local transit',
      commuteTime: 'Accessible via local transit',
      commuteHeading: 'Commute Overview',
      commuteDescription: 'Conveniently accessible across central and western suburban transit corridors.',
      commuteBadge: 'Mumbai Transit',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      whyFit: [
        {
          icon: 'domain_verification',
          title: 'Official Cutoff Threshold',
          description: `Highest recorded cutoff: ${maxCutoff}% (${primary.year || '2025-26'}). Offers academic tracks in ${streams.join(', ')}.`,
          iconColor: 'tertiary',
        }
      ],
      keyFacts: [
        {
          label: 'Streams Offered',
          value: streams.join(', '),
          description: 'Official academic streams offered for 11th and 12th junior college admissions.',
        },
        {
          label: 'Cutoff Range',
          value: cutoffRange,
          description: 'Minimum to maximum cutoff percentages across rounds and streams.',
        },
        {
          label: 'Admission Board',
          value: 'Maharashtra State Board',
          description: 'Admissions conducted via Centralised Online FYJC Admission Process.',
        }
      ],
      isRightForYou: {
        strongFit: `Students meeting the cutoff range of ${cutoffRange} looking for reputable junior college options.`,
        keepInMind: 'Cutoffs may vary across reservation categories and allocation rounds.',
      },
      compareTargetName: 'Other Regional Colleges',
    };
  }

  // 3. Generic fallback using the ID string (e.g., from Cutoffs list)
  const genericName = id
    .replace(/-/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id: id,
    badge: 'Affiliated Institution',
    name: genericName.toLowerCase().includes('college') ? genericName : `${genericName} College`,
    subName: 'Institution in Mumbai Region',
    location: 'Mumbai Region',
    transitDetail: 'Access via Mumbai transit',
    commuteTime: 'Varies by location',
    commuteHeading: 'Commute Overview',
    commuteDescription: 'Connectivity via local train lines and road networks.',
    commuteBadge: 'Mumbai Suburban Network',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    whyFit: [
      {
        icon: 'info',
        title: 'Information Note',
        description: 'Detailed campus insights and editorial reviews are currently being compiled for this institution.',
        iconColor: 'tertiary',
      }
    ],
    keyFacts: [
      {
        label: 'Status',
        value: 'Details Updating',
        description: 'Additional academic facts and fee structures will be available soon.',
      }
    ],
    isRightForYou: {
      strongFit: 'Students exploring options in the Mumbai metropolitan area.',
      keepInMind: 'Always refer to the official university portal for binding admission rules.',
    },
    compareTargetName: 'Other Local Colleges',
  };
};

export const ALL_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: 'res-1',
    category: 'careers',
    badgeCategory: 'CAREER',
    badgeSub: 'Mumbai BFSI sector',
    title: 'Financial Analyst',
    whyRelevant: 'Foundational corporate finance role with strong recruitment in BKC and Lower Parel.',
    meta: ['Entry to Mid Level', 'Equity Research & Advisory'],
    tagColor: 'secondary',
    actionLabel: 'Explore career pathway',
  },
  {
    id: 'res-2',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Churchgate, South Mumbai',
    title: 'H.R. College of Commerce & Economics',
    subtitle: 'Offered: B.Com, BAF, BMS • Approx. ₹28,000–₹48,000/yr',
    whyRelevant: 'Premier finance and commerce ecosystem 5 mins walk from Churchgate station.',
    meta: ['Affiliated to HSNC University'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'hr-college',
  },
  {
    id: 'res-3',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Vile Parle West, Western Suburbs',
    title: 'Mithibai College of Arts & Commerce',
    subtitle: 'Offered: B.Com, BMS, BAF, BFM • Approx. ₹32,000–₹55,000/yr',
    whyRelevant: 'Western line premier campus with morning shift options for CA aspirants and strong FMCG/BFSI placements.',
    meta: ['Autonomous • SVKM Campus'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'mithibai',
  },
  {
    id: 'res-4',
    category: 'courses',
    badgeCategory: 'COURSE',
    badgeSub: '3-Year Undergraduate',
    title: 'Bachelor of Accounting & Finance (BAF)',
    whyRelevant: 'Tailored for careers in financial auditing, taxation, and corporate analysis.',
    meta: ['Autonomous & MU Curriculums'],
    tagColor: 'secondary',
    actionLabel: 'View course details',
  },
  /* {
    id: 'res-5',
    category: 'internships',
    badgeCategory: 'INTERNSHIP',
    badgeSub: 'Motilal Oswal Financial Services',
    title: 'Finance & Treasury Trainee',
    subtitle: 'Malad West, Mumbai • 6 Months • ₹12,000/mo',
    whyRelevant: 'Direct practical exposure to portfolio analysis for commerce students.',
    meta: ['Closes in 12 days'],
    tagColor: 'tertiary',
    actionLabel: 'View opportunity',
  }, */
  {
    id: 'res-6',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Vile Parle West, Mumbai',
    title: 'NMIMS — Anil Surendra Modi School of Commerce',
    subtitle: 'Offered: BBA, B.Com (Hons), B.Sc Finance • Approx. ₹3,20,000/yr',
    whyRelevant: 'High-octane corporate finance training, Bloomberg terminal labs, and Tier-1 consulting placements.',
    meta: ['Deemed-to-be University', 'Vile Parle West, Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'nm-college',
  },
  {
    id: 'res-7',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Dhobi Talao, South Mumbai',
    title: "St. Xavier's College (Autonomous)",
    subtitle: 'Offered: BMS, B.Com, BA, B.Sc • Approx. ₹35,000–₹60,000/yr',
    whyRelevant: 'Historic legacy campus with renowned analytical rigor, entrance test selection, and global alumni network.',
    meta: ['Autonomous • A++ Grade NAAC', 'Fort, South Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'xaviers',
  },
  {
    id: 'res-8',
    category: 'courses',
    badgeCategory: 'COURSE',
    badgeSub: '3-Year Undergraduate',
    title: 'Bachelor of Management Studies (BMS)',
    whyRelevant: 'Comprehensive foundation in strategic management, corporate marketing, and managerial economics.',
    meta: ['Specializations in Finance, Marketing & HR'],
    tagColor: 'secondary',
    actionLabel: 'View course details',
  },
  {
    id: 'res-9',
    category: 'courses',
    badgeCategory: 'COURSE',
    badgeSub: '3-Year Undergraduate',
    title: 'Bachelor of Financial Markets (BFM)',
    whyRelevant: 'In-depth focus on capital markets, derivatives trading, debt securities, and risk management.',
    meta: ['Industry-aligned curriculum'],
    tagColor: 'secondary',
    actionLabel: 'View course details',
  },
  {
    id: 'res-10',
    category: 'careers',
    badgeCategory: 'CAREER',
    badgeSub: 'Investment Banking & Advisory',
    title: 'Equity Research Associate',
    whyRelevant: 'Primary pathway into financial modeling, earnings report synthesis, and valuation for brokerages.',
    meta: ['Requires BAF/BMS/CFA L1', 'Strong presence in Lower Parel'],
    tagColor: 'secondary',
    actionLabel: 'Explore career pathway',
  },
  /* {
    id: 'res-11',
    category: 'internships',
    badgeCategory: 'INTERNSHIP',
    badgeSub: 'Kotak Securities',
    title: 'Wealth Management Analyst Intern',
    subtitle: 'BKC, Mumbai • 3 Months • ₹18,000/mo',
    whyRelevant: 'Client portfolio advisory and wealth allocation experience in Mumbai’s premier financial district.',
    meta: ['Western/Harbour Line accessible'],
    tagColor: 'tertiary',
    actionLabel: 'View opportunity',
  }, */
  /* {
    id: 'res-12',
    category: 'internships',
    badgeCategory: 'INTERNSHIP',
    badgeSub: 'BDO India LLP',
    title: 'Audit & Assurance Trainee',
    subtitle: 'Worli, Mumbai • 6 Months • ₹15,000/mo',
    whyRelevant: 'Statutory audit and tax compliance exposure alongside senior Chartered Accountants.',
    meta: ['Ideal for 2nd & 3rd year BAF students'],
    tagColor: 'tertiary',
    actionLabel: 'View opportunity',
  }, */
  {
    id: 'res-13',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Charni Road, South Mumbai',
    title: 'K.P.B. Hinduja College of Commerce',
    subtitle: 'Offered: B.Com, BAF, BFM, BBI, BMS, B.Sc IT • Approx. ₹22,000–₹46,000/yr',
    whyRelevant: 'Legendary CA ranker ecosystem 4 mins from Charni Road station with early morning lecture band (6:45 AM).',
    meta: ['Autonomous • University of Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'hinduja',
  },
  {
    id: 'res-14',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Matunga Central, Mumbai',
    title: 'R.A. Podar College of Commerce & Economics',
    subtitle: 'Offered: B.Com, BMS, BAF, BFM, BAS (Actuarial) • Approx. ₹18,000–₹38,000/yr',
    whyRelevant: 'Elite commerce institution for Central and Harbour commuters with premier CA and actuarial track records.',
    meta: ['Autonomous • NAAC A+'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'podar',
  },
  {
    id: 'res-15',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Churchgate, Marine Drive',
    title: 'Jai Hind College (Autonomous)',
    subtitle: 'Offered: BMS, BAF, BFM, BAMMC, B.Sc Data Science • Approx. ₹35,000–₹65,000/yr',
    whyRelevant: 'Prestigious South Mumbai institution renowned for corporate placements, data science, and business management.',
    meta: ['Autonomous • Seafront Campus'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'jai-hind',
  },
  {
    id: 'res-16',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Vile Parle West, Mumbai',
    title: 'Narsee Monjee College of Commerce & Economics',
    subtitle: 'Offered: B.Com, BAF, BFM, BMS, B.Sc IT • Approx. ₹30,000–₹52,000/yr',
    whyRelevant: 'SVKM flagship commerce institution with the highest academic board cutoffs and premier Big 4 recruitments.',
    meta: ['Autonomous • SVKM Campus'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'nm-college',
  },
  {
    id: 'res-col-1',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Sion West, Central Suburbs',
    title: 'SIES College of Arts, Science & Commerce',
    subtitle: 'Offered: B.Com, BMS, BAF, B.Sc IT • Approx. ₹22,000–₹42,000/yr',
    whyRelevant: 'Leading academic hub in Sion & Matunga with strong placement records in finance and technology.',
    meta: ['Autonomous • NAAC A+', 'Sion, Matunga, Central Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'sies-college',
  },
  {
    id: 'res-col-2',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Andheri West, Western Suburbs',
    title: "Bhavan's College (Autonomous)",
    subtitle: 'Offered: B.Com, BMS, BAF, B.Sc, BA • Approx. ₹20,000–₹45,000/yr',
    whyRelevant: 'Sprawling green campus in Andheri West offering top undergraduate Commerce and Management tracks.',
    meta: ['Autonomous • Andheri West, Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'bhavans-college',
  },
  {
    id: 'res-col-3',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Malad West, Western Suburbs',
    title: 'Nagindas Khandwala College of Commerce & Arts',
    subtitle: 'Offered: B.Com, BAF, BMS, BFM, B.Sc IT • Approx. ₹24,000–₹48,000/yr',
    whyRelevant: 'Premier autonomous institute in Malad West known for corporate tie-ups and FinTech courses.',
    meta: ['Autonomous • Malad West, Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'nagindas-khandwala',
  },
  {
    id: 'res-col-4',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Kandivali West, Western Suburbs',
    title: 'K.E.S. Shroff College of Arts & Commerce',
    subtitle: 'Offered: B.Com, BAF, BMS, BBI, B.Sc Data Science • Approx. ₹22,000–₹45,000/yr',
    whyRelevant: 'Fastest-growing autonomous institution in Kandivali West with updated industry skill tracks.',
    meta: ['Autonomous • Kandivali West, Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'kes-shroff',
  },
  {
    id: 'res-col-5',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Vile Parle East, Western Suburbs',
    title: 'M.L. Dahanukar College of Commerce',
    subtitle: 'Offered: B.Com, BAF, BMS, BFM • Approx. ₹20,000–₹40,000/yr',
    whyRelevant: 'Renowned commerce college 3 mins walk from Vile Parle East station.',
    meta: ['Affiliated to MU • Vile Parle East, Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'dahanukar-college',
  },
  {
    id: 'res-col-6',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Vidyavihar / Ghatkopar, Central Suburbs',
    title: 'K.J. Somaiya College of Arts & Commerce',
    subtitle: 'Offered: B.Com, BMS, BAF, BFM, BA • Approx. ₹25,000–₹50,000/yr',
    whyRelevant: 'Somaiya Vidyavihar flagship campus for Central Line students near Ghatkopar and Kurla.',
    meta: ['Autonomous • Vidyavihar, Ghatkopar, Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'somaiya-college',
  },
  {
    id: 'res-col-7',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Grant Road / Pedder Road, South Mumbai',
    title: 'Sophia College for Women',
    subtitle: 'Offered: BA, B.Sc, BMS, BMM • Approx. ₹22,000–₹48,000/yr',
    whyRelevant: 'Historic women’s degree institution situated on Pedder Road near Grant Road Station.',
    meta: ['Autonomous • Grant Road, South Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'sophia-college',
  },
  {
    id: 'res-col-8',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Charni Road / Chowpatty, South Mumbai',
    title: 'Wilson College',
    subtitle: 'Offered: B.Com, BMS, BAF, BAMMC, B.Sc • Approx. ₹22,000–₹45,000/yr',
    whyRelevant: 'Heritage seafront college campus directly opposite Chowpatty beach and Charni Road Station.',
    meta: ['Affiliated to MU • Charni Road, Marine Lines, South Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'wilson-college',
  },
  {
    id: 'res-col-9',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Matunga / Dadar West, Central Suburbs',
    title: 'D.G. Ruparel College of Arts, Science & Commerce',
    subtitle: 'Offered: B.Com, BMS, B.Sc, BA • Approx. ₹18,000–₹38,000/yr',
    whyRelevant: 'Premier academic landmark near Matunga West and Dadar Station for science and commerce.',
    meta: ['NAAC A Grade • Dadar, Matunga, Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'ruparel-college',
  },
  {
    id: 'res-col-10',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Bandra West, Western Suburbs',
    title: 'Rizvi College of Arts, Science & Commerce',
    subtitle: 'Offered: B.Com, BAF, BMS, B.Sc IT • Approx. ₹22,000–₹45,000/yr',
    whyRelevant: 'Prominent Bandra West institution close to Carter Road and Bandra railway station.',
    meta: ['Affiliated to MU • Bandra West, Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'rizvi-college',
  },
  {
    id: 'res-col-11',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Parel, South Mumbai',
    title: 'Maharshi Dayanand (MD) College',
    subtitle: 'Offered: B.Com, BMS, BAF, B.Sc • Approx. ₹16,000–₹35,000/yr',
    whyRelevant: 'Strategic central campus in Parel near Lower Parel and Dadar commercial belts.',
    meta: ['Affiliated to MU • Parel, Lower Parel, South Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'md-college',
  },
  {
    id: 'res-col-12',
    category: 'colleges',
    badgeCategory: 'COLLEGE',
    badgeSub: 'Mulund East, Central Suburbs',
    title: 'V.G. Vaze College of Arts, Science & Commerce',
    subtitle: 'Offered: B.Com, BAF, BMS, B.Sc IT • Approx. ₹18,000–₹40,000/yr',
    whyRelevant: 'Top-ranked autonomous college in Mulund East serving Bhandup, Mulund and Thane commuters.',
    meta: ['Autonomous • Mulund East, Bhandup, Mumbai'],
    tagColor: 'tertiary',
    actionLabel: 'View college details',
    collegeId: 'vaze-college',
  },
  {
    id: 'res-17',
    category: 'courses',
    badgeCategory: 'COURSE',
    badgeSub: '3-Year Undergraduate',
    title: 'Bachelor of Banking & Insurance (BBI)',
    whyRelevant: 'Tailored for retail banking, risk underwriting, and treasury operations in Mumbai BFSI headquarters.',
    meta: ['Available at Hinduja, Mithibai & Podar'],
    tagColor: 'secondary',
    actionLabel: 'View course details',
  },
  {
    id: 'res-18',
    category: 'courses',
    badgeCategory: 'COURSE',
    badgeSub: '3-Year Undergraduate',
    title: 'B.A. in Multimedia & Mass Communication (BAMMC)',
    whyRelevant: 'Foundational media program for advertising, copywriting, digital PR, and broadcast journalism in Mumbai.',
    meta: ['Top rated at Jai Hind, Mithibai & St. Xavier’s'],
    tagColor: 'secondary',
    actionLabel: 'View course details',
  },
  {
    id: 'res-19',
    category: 'courses',
    badgeCategory: 'COURSE',
    badgeSub: '3-Year Undergraduate',
    title: 'B.Sc Data Science & Analytics',
    whyRelevant: 'High-demand degree blending mathematical modeling, machine learning, and FinTech data architecture.',
    meta: ['Offered at Jai Hind College & Mumbai Tech Hubs'],
    tagColor: 'secondary',
    actionLabel: 'View course details',
  },
  {
    id: 'res-20',
    category: 'courses',
    badgeCategory: 'COURSE',
    badgeSub: '3-Year Undergraduate',
    title: 'B.Sc Information Technology (B.Sc IT)',
    whyRelevant: 'Specialized technology curriculum in web development, database systems, cybersecurity, and cloud infra.',
    meta: ['Available at Hinduja, Mithibai & NM College'],
    tagColor: 'secondary',
    actionLabel: 'View course details',
  },
  /* {
    id: 'res-21',
    category: 'internships',
    badgeCategory: 'INTERNSHIP',
    badgeSub: 'Ernst & Young (EY) India',
    title: 'Statutory Audit Articled Assistant',
    subtitle: 'One World Center, Lower Parel, Mumbai • 24 Months • ₹18,000–₹24,000/mo',
    whyRelevant: 'Premier Big 4 articleship training for registered CA Intermediate students with corporate audits.',
    meta: ['Requires CA Inter Cleared • Lower Parel'],
    tagColor: 'tertiary',
    actionLabel: 'View opportunity',
  }, */
  /* {
    id: 'res-22',
    category: 'internships',
    badgeCategory: 'INTERNSHIP',
    badgeSub: 'Groww FinTech Hub',
    title: 'FinTech Product & Operations Trainee',
    subtitle: 'Bandra Kurla Complex (BKC), Mumbai • 3 Months • ₹22,000/mo',
    whyRelevant: 'Direct product management and mutual funds settlement operations at one of India’s leading wealth platforms.',
    meta: ['BKC Campus • Immediate Joiners'],
    tagColor: 'tertiary',
    actionLabel: 'View opportunity',
  }, */
  /* {
    id: 'res-23',
    category: 'internships',
    badgeCategory: 'INTERNSHIP',
    badgeSub: 'Cyril Amarchand Mangaldas',
    title: 'Corporate Securities Legal Intern',
    subtitle: 'Peninsula Corporate Park, Lower Parel, Mumbai • 2 Months • ₹15,000/mo',
    whyRelevant: 'Hands-on exposure to SEBI filings, IPO prospectuses, and private equity due diligence.',
    meta: ['South Mumbai Legal Hub'],
    tagColor: 'tertiary',
    actionLabel: 'View opportunity',
  }, */
  /* {
    id: 'res-24',
    category: 'internships',
    badgeCategory: 'INTERNSHIP',
    badgeSub: 'Schbang Digital Agency',
    title: 'Brand Strategy & Media Planning Intern',
    subtitle: 'Worli / Lower Parel, Mumbai • 4 Months • ₹12,000/mo',
    whyRelevant: 'Integrated brand campaign execution, influencer partnerships, and consumer insights for top FMCG brands.',
    meta: ['Ideal for BAMMC / BMS graduates'],
    tagColor: 'tertiary',
    actionLabel: 'View opportunity',
  }, */
];

export const COMPARISON_DATA: Record<string, ComparisonProfile> = {
  mithibai: {
    name: 'Mithibai College',
    campus: 'SVKM Vile Parle Campus',
    location: 'Vile Parle West (Western Suburbs)',
    stationDistance: '400m / 5 min walk (Vile Parle Station)',
    avgFees: '₹32,000 – ₹55,000 / year',
    cutoff: '92% – 95% (HSC General)',
    attendanceStrictness: 'Strict 75% biometric tracking',
    caArticleshipFriendly: 'Yes, morning lectures (7:00 AM – 11:30 AM)',
    topRecruiters: ['Deloitte', 'KPMG', 'EY', 'Morgan Stanley', 'TresVista'],
    autonomous: true,
  },
  'hr-college': {
    name: 'H.R. College',
    campus: 'HSNC University South Mumbai',
    location: 'Churchgate (South Mumbai)',
    stationDistance: '300m / 3 min walk (Churchgate Terminus)',
    avgFees: '₹28,000 – ₹48,000 / year',
    cutoff: '94% – 96.5% (HSC General)',
    attendanceStrictness: 'Moderate / accommodating for CA articles',
    caArticleshipFriendly: 'Highest in Mumbai (early shift 6:45 AM)',
    topRecruiters: ['PwC', 'KPMG', 'Bain Capability', 'Nomura', 'CITI'],
    autonomous: true,
  },
  hinduja: {
    name: 'K.P.B. Hinduja College',
    campus: 'Autonomous South Mumbai Campus',
    location: 'Charni Road East (South Mumbai)',
    stationDistance: '250m / 4 min walk (Charni Road Station)',
    avgFees: '₹22,000 – ₹46,000 / year',
    cutoff: '91% – 94.5% (HSC General)',
    attendanceStrictness: 'Accommodating for verified CA articles',
    caArticleshipFriendly: 'Exceptional (6:45 AM – 10:15 AM morning band)',
    topRecruiters: ['EY', 'Deloitte', 'KPMG', 'PwC', 'Motilal Oswal', 'BDO'],
    autonomous: true,
  },
  podar: {
    name: 'R.A. Podar College',
    campus: 'S.P. Mandali Matunga Campus',
    location: 'Matunga Central (Central Line)',
    stationDistance: '400m / 5 min walk (Matunga Central Station)',
    avgFees: '₹18,000 – ₹38,000 / year',
    cutoff: '93% – 96% (HSC General)',
    attendanceStrictness: 'Balanced with focus on CA academics',
    caArticleshipFriendly: 'High (early morning schedule 7:00 AM)',
    topRecruiters: ['Deloitte', 'KPMG', 'EY', 'Morgan Stanley', 'ICICI Bank'],
    autonomous: true,
  },
  'jai-hind': {
    name: 'Jai Hind College',
    campus: 'Marine Drive Waterfront Campus',
    location: 'Churchgate (South Mumbai)',
    stationDistance: '600m / 7 min walk (Churchgate Station)',
    avgFees: '₹35,000 – ₹65,000 / year',
    cutoff: '94% – 97% (HSC General)',
    attendanceStrictness: 'Strict 75% autonomous lecture mandate',
    caArticleshipFriendly: 'Moderate (better suited for BMS/BFM/Data Science)',
    topRecruiters: ['Morgan Stanley', 'JP Morgan', 'Google', 'Schbang', 'EY'],
    autonomous: true,
  },
  'nm-college': {
    name: 'Narsee Monjee (NM)',
    campus: 'SVKM Vile Parle Campus',
    location: 'Vile Parle West (Western Suburbs)',
    stationDistance: '550m / 6 min walk (Vile Parle Station)',
    avgFees: '₹30,000 – ₹52,000 / year',
    cutoff: '95% – 98% (Highest commerce cutoff)',
    attendanceStrictness: 'Strict 75% biometric tracking',
    caArticleshipFriendly: 'Yes, morning shifts with strong CA foundation cohort',
    topRecruiters: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Barclays', 'Nomura'],
    autonomous: true,
  },
  nmims: {
    name: 'NMIMS (ASMSOC)',
    campus: 'SVKM Modern Corporate Tower',
    location: 'Vile Parle West (Western Suburbs)',
    stationDistance: '900m / 10 min walk (Vile Parle Station)',
    avgFees: '₹3,00,000 – ₹3,50,000 / year',
    cutoff: 'NPAT Entrance Examination',
    attendanceStrictness: 'Rigorous 80% with grade penalties',
    caArticleshipFriendly: 'Full-time daytime schedule (Hard for CA)',
    topRecruiters: ['McKinsey', 'BCG', 'Barclays', 'Goldman Sachs', 'HUL'],
    autonomous: true,
  },
};

export const CAREER_ROADMAPS: CareerGoal[] = [
  {
    id: 'ca-statutory-audit',
    title: 'Chartered Accountant (CA) & Audit Specialist',
    tagline: 'Mumbai’s benchmark finance career with Big 4 audit articleship in Lower Parel, Fort, and BKC.',
    category: 'finance',
    streamFit: ['Class 12th Commerce', 'Class 12th with Mathematics'],
    targetSalaryRange: '₹9.5L – ₹18L / year (Post-qualification starting package)',
    keyIndustries: ['Big 4 Audit & Assurance', 'Corporate Tax Advisory', 'Forensic Accounting', 'M&A Due Diligence'],
    workLocations: ['Lower Parel (One World Center, Kamala Mills)', 'Bandra Kurla Complex (BKC)', 'Fort & Nariman Point'],
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Junior College (FYJC / SYJC) & CA Foundation Registration',
        badge: 'High School / Junior College',
        timeline: 'Age 16–18 • Class 11th & 12th',
        summary: 'Target 88%+ in Maharashtra State Board HSC Commerce (or CBSE/ISC) with emphasis on Bookkeeping & Accountancy and Mathematics. Register for ICAI CA Foundation 4 months prior to examination.',
        proTips: [
          'Choose Mathematics alongside Commerce in FYJC — gives a massive edge in Quantitative Aptitude for CA Foundation.',
          'Solve last 5 terms of ICAI RTPs (Revision Test Papers) and MTPs (Mock Test Papers).',
        ],
      },
      {
        stepNumber: 2,
        stageTitle: 'Undergraduate Degree with CA-Friendly Morning Shift',
        badge: 'Recommended Mumbai Degrees',
        timeline: 'Undergraduate Years 1–3',
        summary: 'Enroll in a Mumbai autonomous college offering early morning lecture batches (finishing before 10:15 AM) so afternoon articleship hours remain completely unobstructed.',
        degreesOrCourses: [
          {
            code: 'BAF',
            name: 'Bachelor of Accounting & Finance (BAF)',
            duration: '3 Years (6 Semesters)',
            whyFit: 'Directly mirrors 80% of ICAI CA Intermediate syllabus including Corporate Accounting, Costing, Direct/Indirect Taxation, and Auditing standards.',
            recommendedColleges: [
              {
                id: 'hinduja',
                name: 'K.P.B. Hinduja College of Commerce',
                location: 'Charni Road East, South Mumbai',
                commuteTip: '4-min walk from Charni Road platform 1 (Western Line)',
                highlight: 'Early morning shift (6:45 AM – 10:15 AM) tailor-made for CA articles.',
              },
              {
                id: 'hr-college',
                name: 'H.R. College of Commerce & Economics',
                location: 'Churchgate, South Mumbai',
                commuteTip: '3-min walk from Churchgate terminal',
                highlight: 'Mumbai’s largest active CA student and peer study network.',
              },
              {
                id: 'podar',
                name: 'R.A. Podar College of Commerce',
                location: 'Matunga Central, Mumbai',
                commuteTip: '5-min walk from Matunga Central station',
                highlight: 'Elite faculty and proven All-India CA rankers year after year.',
              },
              {
                id: 'nm-college',
                name: 'Narsee Monjee College (NM College)',
                location: 'Vile Parle West, Western Suburbs',
                commuteTip: '6-min walk from Vile Parle station',
                highlight: 'Highest cutoff commerce cohort in suburban Mumbai.',
              },
            ],
          },
          {
            code: 'B.Com',
            name: 'Bachelor of Commerce (Aided Morning Batch)',
            duration: '3 Years (6 Semesters)',
            whyFit: 'Very low lecture hours and nominal tuition fee (₹6,000–₹12,000/yr), providing maximum time allocation for CA study.',
            recommendedColleges: [
              {
                id: 'hinduja',
                name: 'K.P.B. Hinduja College of Commerce',
                location: 'Charni Road East',
                commuteTip: 'Walking distance from station; low attendance pressure for verified CA articles.',
                highlight: 'Highly cooperative administration for ICAI article registration.',
              },
              {
                id: 'mithibai',
                name: 'Mithibai College of Arts & Commerce',
                location: 'Vile Parle West',
                commuteTip: '5-min walk from Vile Parle station',
                highlight: 'Premier SVKM campus infrastructure and library resources.',
              },
            ],
          },
        ],
        proTips: [
          'Submit your ICAI Form 102/103 (Articleship Deed) to the college administration early in Semester 3 to secure officially approved attendance leaves during audit seasons.',
        ],
      },
      {
        stepNumber: 3,
        stageTitle: 'ICAI CA Intermediate & Mandatory ICITSS Batches',
        badge: 'Concurrent Professional Milestones',
        timeline: 'Undergraduate Semesters 3–5',
        summary: 'Clear CA Intermediate (Group 1 & Group 2). Complete 4-week mandatory ICITSS (Information Technology Training & Orientation Course) at ICAI Western India Regional Council (WIRC) centers in Mumbai (BKC, Cuffe Parade, or Dadar).',
        certifications: [
          {
            name: 'ICAI CA Intermediate (Group 1 & 2)',
            provider: 'Institute of Chartered Accountants of India (ICAI)',
            duration: '9–12 Months intensive preparation',
            relevance: 'Qualifying prerequisite to officially register for ICAI mandatory 2-year practical training / articleship.',
            whenToTake: 'Semester 3–4 of college degree',
          },
          {
            name: 'Advanced Financial Modeling & Valuation',
            provider: 'NSE Academy / BSE Institute (Fort, Mumbai)',
            duration: '6 Weeks (Weekend cohorts)',
            relevance: 'Master 3-statement modeling and discounted cash flows (DCF) to stand out during Big 4 interview rounds.',
            whenToTake: 'Semester 4 or semester break',
          },
        ],
        proTips: [
          'Target scoring 60+ (Exemption) in Advanced Accounting and Taxation to reduce exam repeat pressure.',
        ],
      },
      {
        stepNumber: 4,
        stageTitle: 'Mandatory 2-Year Articleship in Mumbai Audit & Tax Hubs',
        badge: 'Practical Training & Articleship',
        timeline: 'Degree Final Year to Year 5',
        summary: 'Undergo 2 years of rigorous practical training under a licensed FCA in Mumbai. Gain real-world statutory audit, transfer pricing, and direct tax litigation exposure across leading corporations.',
        /* internships: [
          {
            title: 'Statutory Audit Articled Assistant',
            company: 'Ernst & Young (EY) India',
            location: 'One World Center, Lower Parel, Mumbai',
            stipend: '₹18,000 – ₹24,000 / month',
            timing: '2 Years Full-Time Articleship',
            skillsGained: 'IND AS compliance, revenue audit, internal financial controls (IFC), SAP ERP auditing.',
            applicationWindow: 'Immediately after CA Inter results (Feb / Aug cycles)',
          },
          {
            title: 'Tax & Regulatory Services Articleship',
            company: 'PricewaterhouseCoopers (PwC) India',
            location: 'Nesco IT Park, Goregaon / BKC, Mumbai',
            stipend: '₹17,000 – ₹22,000 / month',
            timing: '2 Years Full-Time Articleship',
            skillsGained: 'Corporate tax computation, international tax treaties (DTAA), ITAT appeals.',
            applicationWindow: 'Rolling post-CA Inter result',
          },
          {
            title: 'Audit & Assurance Trainee',
            company: 'BDO India LLP',
            location: 'The Ruby, Dadar / Worli, Mumbai',
            stipend: '₹14,000 – ₹18,000 / month',
            timing: '2 Years Full-Time Articleship',
            skillsGained: 'Statutory audits of mid-cap listed entities, bank concurrent audits, GST compliance.',
            applicationWindow: 'Twice a year',
          },
          {
            title: 'Audit & Corporate Governance Trainee',
            company: 'Haribhakti & Co. / Chokshi & Chokshi',
            location: 'Fort / Nariman Point, South Mumbai',
            stipend: '₹12,000 – ₹16,000 / month',
            timing: '2 Years Practical Training',
            skillsGained: 'Deep forensic review, stock audits for PSU banks, company secretarial filings.',
            applicationWindow: 'Year-round intake',
          },
        ], */
        proTips: [
          'Choose Lower Parel or BKC audit firms if you live on the Western line, or Dadar/Fort if you live on the Central line to prevent grueling cross-city transit fatigue.',
          'Start CA Final self-study or online coaching during the 2nd year of articleship; avoid leaving syllabus prep to the final 4-month study leave.',
        ],
      },
      {
        stepNumber: 5,
        stageTitle: 'CA Final Qualification & Corporate Campus Placement',
        badge: 'Career Entry & Compensation',
        timeline: 'Post 2-Year Articleship',
        summary: 'Clear CA Final examination. Participate in ICAI Mumbai Mega Campus Placements held biannually in BKC. Land positions as Senior Associate, Audit Manager, or Financial Planning & Analysis (FP&A) specialist.',
        proTips: [
          'Fresh Chartered Accountants with 1st attempt pass start between ₹10L–₹16L/yr in Mumbai.',
          'Rankers (AIR 1–50) command ₹18L–₹26L+ from global investment banks, Boston Consulting Group, McKinsey, or ITC.',
        ],
      },
    ],
  },
  {
    id: 'investment-banking-equity',
    title: 'Investment Banker & Equity Research Analyst',
    tagline: 'Capital market transactions, valuation modeling, and M&A deals in BKC and Lower Parel.',
    category: 'finance',
    streamFit: ['Class 12th Commerce with Math', 'Class 12th Science with Math'],
    targetSalaryRange: '₹12L – ₹24L / year (Entry level Analyst at Mumbai firms)',
    keyIndustries: ['Bulge Bracket & Boutique Investment Banking', 'Equity Research Houses', 'Private Equity & Venture Capital', 'Institutional Wealth Management'],
    workLocations: ['Bandra Kurla Complex (BKC)', 'Lower Parel (Kamala Mills / Marathon Futurex)', 'Nariman Point & Dalal Street'],
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Quantitative & Analytical Foundation',
        badge: 'Junior College (Class 11–12)',
        timeline: 'Age 16–18',
        summary: 'Focus strongly on Advanced Mathematics, Statistics, and Macroeconomics. Build a solid intuition for financial statements, compound interest dynamics, and business models.',
        proTips: [
          'Start following the Economic Times, Mint, and annual investor letters of top Indian corporates.',
          'Open a mock stock market simulator account on Moneybhai or TradingView to observe market order books.',
        ],
      },
      {
        stepNumber: 2,
        stageTitle: 'Specialized Mumbai Capital Markets Degree',
        badge: 'Recommended Mumbai Degrees',
        timeline: 'Undergraduate Years 1–3',
        summary: 'Enroll in specialized finance degrees focused on capital markets, financial derivatives, and company valuation.',
        degreesOrCourses: [
          {
            code: 'BFM',
            name: 'Bachelor of Financial Markets (BFM)',
            duration: '3 Years (6 Semesters)',
            whyFit: 'Covers equity derivatives, debt instruments, technical analysis, forex markets, and portfolio management with live market simulations.',
            recommendedColleges: [
              {
                id: 'jai-hind',
                name: 'Jai Hind College (Autonomous)',
                location: 'Churchgate, Marine Drive',
                commuteTip: '7-min walk from Churchgate terminal',
                highlight: 'Premier corporate finance guest lectures from South Mumbai banking leaders.',
              },
              {
                id: 'mithibai',
                name: 'Mithibai College of Arts & Commerce',
                location: 'Vile Parle West',
                commuteTip: '5-min walk from Vile Parle station',
                highlight: 'Bloomberg lab access and high-octane annual finance fest (Colosseum).',
              },
              {
                id: 'hr-college',
                name: 'H.R. College of Commerce & Economics',
                location: 'Churchgate',
                commuteTip: '3-min walk from Churchgate station',
                highlight: 'Unmatched alumni representation in Mumbai stockbroking and institutional desks.',
              },
              {
                id: 'hinduja',
                name: 'K.P.B. Hinduja College of Commerce',
                location: 'Charni Road East',
                commuteTip: '4-min walk from Charni Road station',
                highlight: 'Rigorous financial markets curriculum with strong trading desk placements.',
              },
            ],
          },
          {
            code: 'BMS (Finance)',
            name: 'Bachelor of Management Studies (Finance Specialization)',
            duration: '3 Years',
            whyFit: 'Integrates strategic corporate management, capital budgeting, and financial modeling.',
            recommendedColleges: [
              {
                id: 'nm-college',
                name: 'Narsee Monjee College (NM College)',
                location: 'Vile Parle West',
                commuteTip: '6-min walk from station',
                highlight: 'Extremely competitive finance student cohort with high recruiter recall.',
              },
              {
                id: 'podar',
                name: 'R.A. Podar College',
                location: 'Matunga Central',
                commuteTip: '5-min walk from Matunga station',
                highlight: 'Solid macroeconomic foundation and active investment forum.',
              },
            ],
          },
        ],
        proTips: [
          'Master Microsoft Excel keyboard shortcuts (zero mouse usage); learn INDEX-MATCH, XLOOKUP, data tables, and dynamic financial charting.',
        ],
      },
      {
        stepNumber: 3,
        stageTitle: 'CFA Level 1 & Regulatory Securities Certifications',
        badge: 'Certifications & Credentials',
        timeline: 'Undergraduate Semesters 4–6',
        summary: 'Register for CFA (Chartered Financial Analyst) Level 1 exam, now eligible for college students in their final two years. Clear mandatory SEBI NISM modules.',
        certifications: [
          {
            name: 'CFA Level 1 Exam',
            provider: 'CFA Institute (USA)',
            duration: '300+ study hours over 6 months',
            relevance: 'Global gold standard for equity research, fixed income analysis, and investment banking pedigree.',
            whenToTake: 'Semester 5 or 6 of graduation',
          },
          {
            name: 'NISM Series VIII: Equity Derivatives Certification',
            provider: 'National Institute of Securities Markets (SEBI)',
            duration: '3 Weeks self-study',
            relevance: 'Mandatory statutory credential required to work on institutional trading and brokerage desks in Mumbai.',
            whenToTake: 'Semester 3 or 4',
          },
          {
            name: 'NISM Series XV: Research Analyst Certification',
            provider: 'National Institute of Securities Markets (SEBI)',
            duration: '4 Weeks self-study',
            relevance: 'Certifies competency to write and publish regulated stock recommendation reports.',
            whenToTake: 'Final year of degree',
          },
        ],
        proTips: [
          'Publish 1 or 2 high-quality equity research initiation reports on Substack or LinkedIn (e.g., in-depth breakdown of a listed Indian retail or IT company).',
        ],
      },
      {
        stepNumber: 4,
        stageTitle: 'Mumbai Boutique & Institutional Finance Internships',
        badge: 'Internships & Deal Exposure',
        timeline: 'Year 2 Summer & Final Year',
        summary: 'Work at leading Indian brokerages, credit rating agencies, or boutique advisory shops in BKC and Lower Parel.',
        /* internships: [
          {
            title: 'Equity Research Trainee — Institutional Desk',
            company: 'Motilal Oswal Financial Services',
            location: 'Malad West / Lower Parel, Mumbai',
            stipend: '₹15,000 / month',
            timing: '6 Months',
            skillsGained: 'Quarterly earnings modeling, channel checks, management commentary synthesis.',
            applicationWindow: 'April & October cohorts',
          },
          {
            title: 'Wealth Management Analyst Intern',
            company: 'Kotak Securities',
            location: 'Bandra Kurla Complex (BKC), Mumbai',
            stipend: '₹18,000 / month',
            timing: '3 Months (Summer)',
            skillsGained: 'Asset allocation modeling, mutual fund selection, HNI portfolio reviews.',
            applicationWindow: 'January – March applications',
          },
          {
            title: 'Financial Analyst Trainee',
            company: 'TresVista Financial Services',
            location: 'Powai / Vikhroli, Mumbai',
            stipend: '₹22,000 / month',
            timing: '6 Months Trainee Program',
            skillsGained: 'LBO models, private equity tear sheets, comparable company analysis (Comps).',
            applicationWindow: 'Continuous intake for final year students',
          },
        ], */
        proTips: [
          'Reach out directly to Mumbai alumni working at TresVista, Ambit Capital, and Edelweiss via polite LinkedIn InMail showcasing your completed financial model samples.',
        ],
      },
      {
        stepNumber: 5,
        stageTitle: 'Full-Time IB Analyst Role & Tier-1 MBA Pathway',
        badge: 'Career Milestones',
        timeline: 'Post-Graduation (Years 1–4)',
        summary: 'Join as an Investment Banking Analyst or Equity Research Associate. After 2–3 years of deal experience, either advance directly to Associate or pursue an MBA at IIM Ahmedabad / Bangalore / Calcutta or JBIMS Churchgate.',
        proTips: [
          'Analyst salaries at Mumbai boutique and bulge bracket desks start at ₹12L–₹22L/yr base plus performance bonus.',
        ],
      },
    ],
  },
  {
    id: 'consulting-product-management',
    title: 'Management Consultant & Product Manager',
    tagline: 'Strategic advisory, business operations, and consumer product tech in BKC and Powai.',
    category: 'consulting',
    streamFit: ['Class 12th Commerce', 'Class 12th Science', 'Class 12th Arts'],
    targetSalaryRange: '₹10L – ₹20L / year starting package',
    keyIndustries: ['Management Consulting', 'Tech Product Management', 'Corporate Strategy', 'High-Growth Startups'],
    workLocations: ['Bandra Kurla Complex (BKC)', 'Lower Parel', 'Powai & Andheri East'],
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Problem Solving & Extracurricular Leadership',
        badge: 'Junior College (Class 11–12)',
        timeline: 'Age 16–18',
        summary: 'Develop first-principles structured thinking and strong communication. Participate in Model United Nations (MUNs), debating societies, and student editorial boards across Mumbai junior colleges.',
        proTips: [
          'Read "Case in Point" by Marc Cosentino and study market entry framework basics.',
        ],
      },
      {
        stepNumber: 2,
        stageTitle: 'Bachelor of Management Studies (BMS) in Premier Campuses',
        badge: 'Recommended Mumbai Degrees',
        timeline: 'Undergraduate Years 1–3',
        summary: 'Target top-tier Mumbai colleges for BMS or BBA, prioritizing institutions with active corporate placement cells, festival leadership, and case competition culture.',
        degreesOrCourses: [
          {
            code: 'BMS',
            name: 'Bachelor of Management Studies (BMS)',
            duration: '3 Years',
            whyFit: 'Deep curriculum in strategic management, consumer psychology, operations research, and managerial finance.',
            recommendedColleges: [
              {
                id: 'jai-hind',
                name: 'Jai Hind College (Autonomous)',
                location: 'Churchgate',
                commuteTip: '7-min walk from Churchgate',
                highlight: 'High corporate brand recall and stellar student-led entrepreneurship cell.',
              },
              {
                id: 'mithibai',
                name: 'Mithibai College',
                location: 'Vile Parle West',
                commuteTip: '5-min walk from station',
                highlight: 'Large student body with massive business networking opportunities.',
              },
              {
                id: 'nm-college',
                name: 'Narsee Monjee College',
                location: 'Vile Parle West',
                commuteTip: '6-min walk from station',
                highlight: 'High academic rigor and regular Tier-1 corporate presentations.',
              },
              {
                id: 'podar',
                name: 'R.A. Podar College',
                location: 'Matunga Central',
                commuteTip: '5-min walk from Matunga Central',
                highlight: 'Solid analytical focus and highly reputed autonomous curriculum.',
              },
            ],
          },
        ],
        proTips: [
          'Lead a major department in your college festival (e.g., Umang, Malhar, Kiran) — consulting interviewers in Mumbai love proven team leadership and budget management.',
        ],
      },
      {
        stepNumber: 3,
        stageTitle: 'Case Competitions, Product Teardowns & Certifications',
        badge: 'Skills & Case Mastery',
        timeline: 'Semesters 3–5',
        summary: 'Compete in national collegiate case competitions (e.g., IIM Bangalore Vista, SRCC Business Conclave). Build and publish comprehensive Product Teardown slides analyzing Zepto, Swiggy, or Zomato.',
        certifications: [
          {
            name: 'Product Management Certified Associate',
            provider: 'Upraised / Product School',
            duration: '8 Weeks',
            relevance: 'Learn wireframing (Figma), user journey mapping, PRD (Product Requirements Document) authoring, and A/B testing frameworks.',
            whenToTake: 'Semester 4 or 5',
          },
          {
            name: 'SQL & Business Data Analytics for Decision Makers',
            provider: 'Coursera / Google Data Analytics',
            duration: '6 Weeks',
            relevance: 'Enables querying corporate metric funnels (DAU/MAU, retention cohorts, CAC/LTV).',
            whenToTake: 'Semester 3',
          },
        ],
        proTips: [
          'Form a dedicated 3-person case partner team in your college to simulate McKinsey and Bain case interviews twice a week.',
        ],
      },
      {
        stepNumber: 4,
        stageTitle: 'Strategic & Product Internships in Mumbai',
        badge: 'Practical Experience',
        timeline: 'Year 2 & 3 Summer',
        summary: 'Secure practical business analyst and associate product manager (APM) internships at Mumbai tech companies or consulting boutiques.',
        /* internships: [
          {
            title: 'FinTech Product & Operations Trainee',
            company: 'Groww FinTech Hub',
            location: 'Bandra Kurla Complex (BKC), Mumbai',
            stipend: '₹22,000 / month',
            timing: '3 Months (Full-time Summer)',
            skillsGained: 'Feature rollout roadmaps, conversion funnel optimization, user telemetry analysis.',
            applicationWindow: 'February – April',
          },
          {
            title: 'Management Consulting Summer Analyst',
            company: 'Bain Capability Network / Avalon Consulting',
            location: 'Lower Parel / BKC, Mumbai',
            stipend: '₹25,000 / month',
            timing: '2 Months Summer',
            skillsGained: 'Market sizing (guesstimates), vendor benchmark studies, executive slide decks.',
            applicationWindow: 'On-campus and LinkedIn referrals',
          },
        ], */
        proTips: [
          'Quantify every bullet on your resume: "Boosted trial signups by 24% by redesigning onboarding flow" beats "Helped with onboarding".',
        ],
      },
      {
        stepNumber: 5,
        stageTitle: 'Associate Consultant / APM & CAT / MBA Pipeline',
        badge: 'Career Launch',
        timeline: 'Graduation & Beyond',
        summary: 'Land full-time roles as Associate Consultant at firms like Deloitte Strategy, Kearney, or Gartner, or Associate Product Manager at Mumbai unicorns. Target CAT / GMAT for top IIMs, ISB, or JBIMS.',
        proTips: [
          'Average starting packages range from ₹9L–₹16L/yr for undergrad hires, leaping to ₹28L–₹40L/yr after top MBA qualification.',
        ],
      },
    ],
  },
  {
    id: 'fintech-software-engineering',
    title: 'FinTech Software Engineer & Data Analyst',
    tagline: 'High-frequency trading engines, banking APIs, and scalable distributed systems in Mumbai.',
    category: 'tech',
    streamFit: ['Class 12th Science with Mathematics', 'Class 12th Commerce with Mathematics'],
    targetSalaryRange: '₹10L – ₹22L / year starting package',
    keyIndustries: ['Algorithmic Trading & HFT Desks', 'Banking Technology (BFSI)', 'Payment Gateways & Neo-Banks', 'Enterprise Cloud & SaaS'],
    workLocations: ['Bandra Kurla Complex (BKC)', 'Powai (Hiranandani Tech Hub)', 'Airoli / Navi Mumbai Mindspace'],
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Mathematical & Programming Basics',
        badge: 'Class 11–12 Preparation',
        timeline: 'Age 16–18',
        summary: 'Achieve high marks in Mathematics and Computer Science / Information Technology in Class 12th. Learn core Python and basic data structures (arrays, hash tables, linked lists).',
        proTips: [
          'Solve easy-level problems on LeetCode or HackerRank; grasp time complexity (Big-O notation).',
        ],
      },
      {
        stepNumber: 2,
        stageTitle: 'Target Mumbai Tech Degrees (B.Sc IT / Data Science)',
        badge: 'Recommended Mumbai Degrees',
        timeline: 'Undergraduate Years 1–3',
        summary: 'Enroll in modern, hands-on technology degrees in Mumbai autonomous institutions with up-to-date programming curricula.',
        degreesOrCourses: [
          {
            code: 'B.Sc Data Science',
            name: 'B.Sc in Data Science & Analytics',
            duration: '3 Years (6 Semesters)',
            whyFit: 'Combines linear algebra, predictive statistics, Python data engineering (Pandas, NumPy), and financial time series modeling.',
            recommendedColleges: [
              {
                id: 'jai-hind',
                name: 'Jai Hind College (Autonomous)',
                location: 'Churchgate, South Mumbai',
                commuteTip: '7-min walk from Churchgate',
                highlight: 'Pioneering autonomous curriculum designed in consultation with tech & analytics leaders.',
              },
            ],
          },
          {
            code: 'B.Sc IT',
            name: 'Bachelor of Science in Information Technology (B.Sc IT)',
            duration: '3 Years (6 Semesters)',
            whyFit: 'Comprehensive foundation in relational databases (PostgreSQL/MySQL), cloud microservices, software engineering, and network protocols.',
            recommendedColleges: [
              {
                id: 'hinduja',
                name: 'K.P.B. Hinduja College of Commerce',
                location: 'Charni Road East',
                commuteTip: '4-min walk from Charni Road platform',
                highlight: 'Strong software lab infrastructure and direct campus recruitment by IT service & BFSI firms.',
              },
              {
                id: 'nm-college',
                name: 'Narsee Monjee College (NM College)',
                location: 'Vile Parle West',
                commuteTip: '6-min walk from station',
                highlight: 'Premier academic environment with high tech campus placements.',
              },
              {
                id: 'mithibai',
                name: 'Mithibai College',
                location: 'Vile Parle West',
                commuteTip: '5-min walk from station',
                highlight: 'State-of-the-art computer labs and active tech festival (Luminary).',
              },
            ],
          },
        ],
        proTips: [
          'Maintain a public GitHub portfolio with 3 clean, deployed full-stack web or analytics apps using modern frameworks.',
        ],
      },
      {
        stepNumber: 3,
        stageTitle: 'Data Structures, Algorithms & Cloud Certifications',
        badge: 'Technical Competencies',
        timeline: 'Semesters 3–5',
        summary: 'Master Data Structures & Algorithms (Trees, Graphs, Dynamic Programming) in C++ or Java. Build cloud deployment skills using Docker and AWS/GCP.',
        certifications: [
          {
            name: 'AWS Certified Cloud Practitioner or Solutions Architect',
            provider: 'Amazon Web Services (AWS)',
            duration: '2 Months self-study',
            relevance: 'Crucial for understanding how Mumbai FinTech platforms deploy elastic banking microservices.',
            whenToTake: 'Semester 4 or 5',
          },
          {
            name: 'Python for Algorithmic Trading & Financial Engineering',
            provider: 'QuantInsti (Mumbai)',
            duration: '8 Weeks',
            relevance: 'Teaches automated backtesting, volatility strategies, and Zerodha Kite Connect / Angel One trading APIs.',
            whenToTake: 'Semester 4',
          },
        ],
        proTips: [
          'Participate in Mumbai hackathons (e.g., Smart India Hackathon, SVKM Tech Hacks) to demonstrate rapid prototyping under pressure.',
        ],
      },
      {
        stepNumber: 4,
        stageTitle: 'Mumbai FinTech & Tech Developer Internships',
        badge: 'Industry Internships',
        timeline: 'Semesters 4–6',
        summary: 'Gain practical experience building backend systems, RESTful APIs, or analytics pipelines at Mumbai financial tech firms and brokerages.',
        /* internships: [
          {
            title: 'Backend Engineering Intern',
            company: 'Groww / Zerodha Tech Hub',
            location: 'BKC / Remote Mumbai',
            stipend: '₹25,000 / month',
            timing: '3–6 Months',
            skillsGained: 'Go / Python microservices, Redis caching, high-throughput order queues.',
            applicationWindow: 'December & May cycles',
          },
          {
            title: 'Quantitative Research & Data Trainee',
            company: 'Motilal Oswal Financial Technologies',
            location: 'Malad West, Mumbai',
            stipend: '₹18,000 / month',
            timing: '6 Months',
            skillsGained: 'Time-series price analysis, machine learning prediction models, SQL data extraction.',
            applicationWindow: 'Rolling intake',
          },
        ], */
        proTips: [
          'Clean code and thorough unit tests in your GitHub repos make you stand out 10x more than generic copy-pasted tutorial projects.',
        ],
      },
      {
        stepNumber: 5,
        stageTitle: 'Software Development Engineer (SDE) & Tech Lead',
        badge: 'Career Milestones',
        timeline: 'Post-Graduation',
        summary: 'Join as Software Development Engineer 1 (SDE-1) or Quantitative Analyst. Top Mumbai FinTech startups and investment banks (Morgan Stanley, JP Morgan, Nomura, Barclays) pay ₹10L–₹22L/yr base to fresh grads.',
        proTips: [
          'Transition into Quant Developer or Engineering Manager within 4–6 years with compensation exceeding ₹35L+.',
        ],
      },
    ],
  },
  {
    id: 'corporate-law-securities',
    title: 'Corporate Securities Lawyer & M&A Counsel',
    tagline: 'SEBI capital market regulations, PE term sheets, and corporate transactions in South Mumbai.',
    category: 'law',
    streamFit: ['Class 12th Commerce', 'Class 12th Arts / Humanities', 'Class 12th Science'],
    targetSalaryRange: '₹12L – ₹20L / year starting package at Tier-1 law firms',
    keyIndustries: ['Corporate M&A & Private Equity', 'SEBI Capital Markets (IPOs)', 'Banking & Insolvency (IBC)', 'Commercial Litigation'],
    workLocations: ['Fort & Churchgate (High Court Precinct)', 'Lower Parel (Peninsula Corporate Park)', 'Nariman Point & BKC'],
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Verbal Reasoning, Current Affairs & MH-CET Law Prep',
        badge: 'Junior College (Class 11–12)',
        timeline: 'Age 16–18',
        summary: 'Target high marks in Class 12th while preparing for Maharashtra Law CET (MH-CET Law) and CLAT. Build strong reading speed and constitutional reasoning skills.',
        proTips: [
          'Read the Hindu editorial section and LiveLaw daily for high-impact Supreme Court and Bombay High Court judgments.',
        ],
      },
      {
        stepNumber: 2,
        stageTitle: 'Undergraduate Degree / Law School Selection in Mumbai',
        badge: 'Recommended Mumbai Degrees',
        timeline: 'Years 1–3 or 5-Year Integrated Course',
        summary: 'Either pursue 5-year B.L.S. LL.B. at Government Law College (GLC Mumbai, Churchgate) or a 3-year BAF/B.Com at Hinduja/HR followed by 3-year LL.B.',
        degreesOrCourses: [
          {
            code: 'BAF / B.Com -> LL.B',
            name: 'Commerce Degree + LL.B (3-Year Law Path)',
            duration: '3 Years Undergrad + 3 Years LL.B',
            whyFit: 'In-depth financial statements and accounting literacy makes you an extraordinarily sharp corporate M&A lawyer.',
            recommendedColleges: [
              {
                id: 'hinduja',
                name: 'K.P.B. Hinduja College of Commerce',
                location: 'Charni Road East',
                commuteTip: '4-min walk from Charni Road station',
                highlight: 'Early morning shift leaves afternoon free for judicial chamber clerkships.',
              },
              {
                id: 'hr-college',
                name: 'H.R. College of Commerce',
                location: 'Churchgate',
                commuteTip: '3-min walk from Churchgate',
                highlight: 'Direct walking access to Bombay High Court and Fort legal chambers.',
              },
            ],
          },
        ],
        proTips: [
          'Government Law College (GLC Churchgate) is located right behind the Bombay High Court, allowing students to intern at law firms from Year 1.',
        ],
      },
      {
        stepNumber: 3,
        stageTitle: 'SEBI Regulations & Company Secretary (CS) Foundation',
        badge: 'Certifications & Credentials',
        timeline: 'Semesters 3–6',
        summary: 'Study the Companies Act 2013, SEBI (ICDR) Regulations for IPOs, and Insolvency and Bankruptcy Code (IBC). Clear ICSI Company Secretary Executive exams for double qualification.',
        certifications: [
          {
            name: 'Company Secretary (CS Executive)',
            provider: 'Institute of Company Secretaries of India (ICSI)',
            duration: '1 Year intensive prep',
            relevance: 'Dual qualification (Law + CS) makes you the premier choice for in-house corporate counsel and IPO legal diligence.',
            whenToTake: 'During undergraduate degree',
          },
        ],
        proTips: [
          'Participate in national corporate law moot court competitions hosted in Mumbai and Pune.',
        ],
      },
      {
        stepNumber: 4,
        stageTitle: 'Corporate Law Internships in South Mumbai & Lower Parel',
        badge: 'Legal Internships',
        timeline: 'Semester Breaks & Year 3–5',
        summary: 'Intern with premier corporate law firms in Mumbai, reviewing transaction agreements, drafting non-disclosure agreements (NDAs), and verifying land and company titles.',
        /* internships: [
          {
            title: 'Corporate Securities Legal Intern',
            company: 'Cyril Amarchand Mangaldas',
            location: 'Peninsula Corporate Park, Lower Parel, Mumbai',
            stipend: '₹15,000 / month',
            timing: '2 Months (Summer / Winter)',
            skillsGained: 'SEBI filing disclosures, drafting due diligence reports, board resolution compliance.',
            applicationWindow: 'Apply 4 months in advance via firm careers portal',
          },
          {
            title: 'Commercial Law Intern',
            company: 'Shardul Amarchand Mangaldas / AZB & Partners',
            location: 'Express Towers, Nariman Point, Mumbai',
            stipend: '₹15,000 / month',
            timing: '2 Months',
            skillsGained: 'Shareholder agreements, venture capital funding term sheets, trademark searches.',
            applicationWindow: 'October & April deadlines',
          },
        ], */
        proTips: [
          'Publish well-researched case commentaries on recent SEBI insider trading orders on SCC Online or Bar & Bench.',
        ],
      },
      {
        stepNumber: 5,
        stageTitle: 'Bar Council Enrollment & Associate Counsel',
        badge: 'Career Milestones',
        timeline: 'Post-LL.B Qualification',
        summary: 'Enroll with the Bar Council of Maharashtra & Goa. Clear the All India Bar Examination (AIBE). Join Tier-1 corporate law firms as Associate with starting packages of ₹12L–₹18L/yr.',
        proTips: [
          'Corporate lawyers in Mumbai advising on cross-border M&A and private equity routinely reach Partner track within 8–10 years.',
        ],
      },
    ],
  },
  {
    id: 'digital-brand-marketing',
    title: 'Brand Strategist & Creative Media Producer',
    tagline: 'Integrated advertising campaigns, digital media planning, and brand storytelling in Mumbai.',
    category: 'media',
    streamFit: ['Class 12th Arts / Humanities', 'Class 12th Commerce', 'Class 12th Science'],
    targetSalaryRange: '₹6.5L – ₹14L / year starting package',
    keyIndustries: ['Digital Advertising Agencies', 'Brand Management & FMCG', 'Media Production Houses', 'Public Relations & Influencer Marketing'],
    workLocations: ['Bandra West (Pali Hill / Bandra Kurla Complex)', 'Worli & Lower Parel', 'Andheri West (Versova / Lokhandwala)'],
    steps: [
      {
        stepNumber: 1,
        stageTitle: 'Creative Writing, Visual Storytelling & Social Trends',
        badge: 'Junior College (Class 11–12)',
        timeline: 'Age 16–18',
        summary: 'Hone strong creative and persuasive writing skills. Build familiarity with digital social media distribution algorithms, short-form video narrative pacing, and typography.',
        proTips: [
          'Create and run a niche Instagram content page or Substack newsletter to learn organic audience acquisition and analytics.',
        ],
      },
      {
        stepNumber: 2,
        stageTitle: 'Bachelor of Arts in Multimedia and Mass Communication (BAMMC)',
        badge: 'Recommended Mumbai Degrees',
        timeline: 'Undergraduate Years 1–3',
        summary: 'Enroll in BAMMC (formerly BMM) in Mumbai’s premier media colleges known for industry connections and film/advertising festivals.',
        degreesOrCourses: [
          {
            code: 'BAMMC',
            name: 'B.A. in Multimedia and Mass Communication (BAMMC)',
            duration: '3 Years (6 Semesters)',
            whyFit: 'Comprehensive training in advertising copywriting, media planning, digital journalism, consumer psychology, and video production.',
            recommendedColleges: [
              {
                id: 'jai-hind',
                name: 'Jai Hind College (Autonomous)',
                location: 'Churchgate, Marine Drive',
                commuteTip: '7-min walk from Churchgate',
                highlight: 'Top-ranked media faculty and annual national media fest (Detour).',
              },
              {
                id: 'mithibai',
                name: 'Mithibai College',
                location: 'Vile Parle West',
                commuteTip: '5-min walk from station',
                highlight: 'Direct proximity to Mumbai advertising, television, and film production houses.',
              },
              {
                id: 'hinduja',
                name: 'K.P.B. Hinduja College of Commerce',
                location: 'Charni Road East',
                commuteTip: '4-min walk from Charni Road station',
                highlight: 'Practical digital PR and advertising project curriculum.',
              },
            ],
          },
        ],
        proTips: [
          'Master Figma, Adobe Photoshop, Premiere Pro, and Canva; creative directors in Mumbai value students who can visualize their own copy.',
        ],
      },
      {
        stepNumber: 3,
        stageTitle: 'Performance Marketing & Brand Analytics Certifications',
        badge: 'Digital Marketing Mastery',
        timeline: 'Semesters 3–5',
        summary: 'Learn paid media performance marketing (Meta Ads Manager, Google Search/Display Ads), SEO, and conversion rate optimization.',
        certifications: [
          {
            name: 'Meta Certified Digital Marketing Associate',
            provider: 'Meta Blueprint',
            duration: '4 Weeks self-study',
            relevance: 'Industry standard for running paid social ad campaigns and calculating ROAS (Return on Ad Spend).',
            whenToTake: 'Semester 3 or 4',
          },
          {
            name: 'Google Analytics 4 (GA4) Certification',
            provider: 'Google Skillshop',
            duration: '3 Weeks',
            relevance: 'Essential for tracking consumer user journeys and attribution models.',
            whenToTake: 'Semester 4',
          },
        ],
        proTips: [
          'Publish a comprehensive 10-slide brand teardown on LinkedIn analyzing how a legacy Indian brand (like Amul or Tata Tea) repositioned for Gen Z.',
        ],
      },
      {
        stepNumber: 4,
        stageTitle: 'Mumbai Advertising Agency & Media Internships',
        badge: 'Agency Internships',
        timeline: 'Semester 4 & 5',
        summary: 'Intern at top creative agencies, digital consultancies, or FMCG marketing teams in Lower Parel, Bandra, and Andheri.',
        /* internships: [
          {
            title: 'Brand Strategy & Media Planning Intern',
            company: 'Schbang Digital Agency',
            location: 'Worli / Lower Parel, Mumbai',
            stipend: '₹12,000 / month',
            timing: '4 Months',
            skillsGained: 'Creative pitch deck creation, influencer marketing briefs, brand campaign calendar management.',
            applicationWindow: 'Rolling internships',
          },
          {
            title: 'Creative Copywriting Trainee',
            company: 'Ogilvy / Dentsu Creative Mumbai',
            location: 'Lower Parel / Goregaon, Mumbai',
            stipend: '₹15,000 / month',
            timing: '3 Months',
            skillsGained: 'TV commercial script drafts, digital social ad copies, brand voice guidelines.',
            applicationWindow: 'Summer & Autumn cycles',
          },
        ], */
        proTips: [
          'A crisp, interactive Notion portfolio link showcasing 5 high-impact creative campaigns is 100x more effective than a traditional PDF resume.',
        ],
      },
      {
        stepNumber: 5,
        stageTitle: 'Brand Manager / Account Planner & Agency Director',
        badge: 'Career Milestones',
        timeline: 'Post-Graduation',
        summary: 'Join as Junior Brand Strategist, Creative Copywriter, or Digital Account Executive. Progress into Brand Manager or Creative Director handling multi-crore national advertising budgets.',
        proTips: [
          'Starting salaries range from ₹6.5L–₹12L/yr, growing rapidly with proven track records of viral campaigns and client retention.',
        ],
      },
    ],
  },
];
