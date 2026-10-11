import { SearchResultItem } from '../types';
import { CLASSES, ClassData } from '../data/classes';
import { ALL_SEARCH_RESULTS } from '../data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Locality utilities (Mumbai only)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Canonical list of Mumbai localities offered in the Region / Area filter.
 * Matching is done against the real area / address / location fields of each
 * dataset — see getAvailableLocalities() for which ones actually have data.
 */
export const MUMBAI_LOCALITIES: string[] = [
  'Borivali', 'Kandivali', 'Malad', 'Goregaon', 'Jogeshwari', 'Andheri',
  'Vile Parle', 'Santacruz', 'Bandra', 'Dadar', 'Matunga', 'Sion', 'Kurla',
  'Ghatkopar', 'Vikhroli', 'Bhandup', 'Mulund', 'Chembur', 'Powai',
  'Lower Parel', 'Worli', 'Charni Road', 'Churchgate', 'Fort', 'Colaba',
  'Marine Lines', 'Grant Road', 'Mumbai Central', 'Mahalaxmi', 'Elphinstone Road',
  'Prabhadevi', 'Parel', 'Tilak Nagar', 'Vidyavihar', 'Kanjurmarg',
  'Dahisar', 'Mira Road', 'Bhayandar', 'Naigaon', 'Vasai Road', 'Nalasopara', 'Virar'
];

export const CANONICAL_REGIONS = [
  'South Mumbai',
  'Western Suburbs',
  'Central Suburbs',
  'Eastern Suburbs',
  'Harbour / Central-East',
] as const;

export type CanonicalRegion = typeof CANONICAL_REGIONS[number];

export const LOCALITY_ZONES = [
  {
    zone: 'Western Suburbs',
    localities: [
      'Virar', 'Nalasopara', 'Vasai Road', 'Vasai', 'Naigaon', 'Bhayandar', 'Mira Road',
      'Dahisar', 'Borivali', 'Kandivali', 'Malad', 'Goregaon', 'Jogeshwari', 'Andheri',
      'Vile Parle', 'Santacruz', 'Bandra', 'Khar', 'Juhu', 'Versova', 'Oshiwara', 'Lokhandwala'
    ],
  },
  {
    zone: 'South Mumbai',
    localities: [
      'Churchgate', 'Colaba', 'Fort', 'Marine Lines', 'Marine Drive', 'Nariman Point', 'Cuffe Parade',
      'Charni Road', 'Grant Road', 'Mumbai Central', 'Mahalaxmi', 'Lower Parel', 'Worli',
      'Elphinstone Road', 'Elphinstone', 'Prabhadevi', 'Parel', 'Currey Road', 'Byculla',
      'Mazgaon', 'Girgaon', 'Chowpatty', 'Walkeshwar', 'Malabar Hill', 'Pedder Road',
      'Cumballa Hill', 'Breach Candy', 'Dhobi Talao', 'Kalbadevi', 'Tardeo', 'Sewri'
    ],
  },
  {
    zone: 'Central Suburbs',
    localities: [
      'Dadar', 'Matunga', 'Wadala', 'Sion', 'Kurla', 'Vidyavihar', 'Tilak Nagar',
      'Chunabhatti', 'GTB Nagar', 'Antop Hill'
    ],
  },
  {
    zone: 'Eastern Suburbs',
    localities: [
      'Ghatkopar', 'Vikhroli', 'Kanjurmarg', 'Bhandup', 'Nahur', 'Mulund', 'Powai', 'Chandivali'
    ],
  },
  {
    zone: 'Harbour / Central-East',
    localities: [
      'Chembur', 'Govandi', 'Mankhurd', 'Trombay', 'Deonar', 'Mahul', 'Vashi', 'Sanpada',
      'Juinagar', 'Nerul', 'Seawoods', 'Belapur', 'Kharghar', 'Panvel', 'Navi Mumbai',
      'Airoli', 'Ghansoli', 'Koparkhairane'
    ],
  },
];

/** Locality to canonical region dictionary with exact boundary lookup */
const LOCALITY_TO_REGION_MAP: Record<string, CanonicalRegion> = {};
LOCALITY_ZONES.forEach(({ zone, localities }) => {
  localities.forEach((loc) => {
    LOCALITY_TO_REGION_MAP[loc.toLowerCase()] = zone as CanonicalRegion;
  });
});

export const isLocality = (value: string | null | undefined): boolean => {
  if (!value) return false;
  const valLower = value.trim().toLowerCase();
  return MUMBAI_LOCALITIES.some((loc) => loc.toLowerCase() === valLower) ||
    Boolean(LOCALITY_TO_REGION_MAP[valLower]);
};

/** Whole-word, case-insensitive locality match (avoids "Sion" matching "Mansion"). */
export const textHasLocality = (text: string, locality: string): boolean => {
  if (!text || !locality) return false;
  let locPattern = locality.trim();
  if (/mahalaxmi|mahalakshmi/i.test(locPattern)) {
    locPattern = 'Mahala?xmi';
  } else if (/elphinstone/i.test(locPattern)) {
    locPattern = 'Elphinstone';
  }
  const escaped = locPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
};

/**
 * Multi-value URL params (currently only `region`) are stored comma-separated,
 * e.g. `region=Andheri,Vile Parle`. Values within one param are OR-ed.
 */
export const MULTI_VALUE_PARAMS = ['region'];

export const parseMultiValue = (value: string | null | undefined): string[] =>
  (value || '').split(',').map((v) => v.trim()).filter(Boolean);

// ─────────────────────────────────────────────────────────────────────────────
// Region utilities (shared between SearchResultsScreen and CategoryResultsPage)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Strips transit and railway line corridors (e.g. "Western Line", "Central Railway")
 * so transport terms are never confused with geographic regional boundaries.
 */
export const stripRailwayCorridors = (text: string): string => {
  return text.replace(/\b(Western|Central|Harbour)\s+(Line|Corridor|Railway)\b/gi, ' ');
};

/**
 * Resolves the canonical Mumbai region for any text or address.
 * Uses exact whole-word matching and verified locality definitions.
 */
export const resolveCanonicalRegion = (rawText: string | null | undefined): CanonicalRegion | null => {
  if (!rawText) return null;
  const cleaned = stripRailwayCorridors(rawText);

  // 1. Direct explicit region match
  for (const region of CANONICAL_REGIONS) {
    const escaped = region.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(cleaned)) {
      return region;
    }
  }

  // Handle "Harbour Line" as alias for "Harbour / Central-East"
  if (/\bHarbour(?:\s+Line)?\b/i.test(cleaned)) {
    return 'Harbour / Central-East';
  }

  // 2. Verified locality match (longest matches first)
  const sortedLocalities = Object.keys(LOCALITY_TO_REGION_MAP).sort((a, b) => b.length - a.length);
  for (const loc of sortedLocalities) {
    if (textHasLocality(cleaned, loc)) {
      return LOCALITY_TO_REGION_MAP[loc];
    }
  }

  return null;
};

/**
 * Resolves the canonical region for a SearchResultItem.
 * Inspects verified badge, meta, subtitle, and title in order of reliability.
 */
export const resolveItemCanonicalRegion = (
  item: SearchResultItem | { title: string; badgeSub?: string; meta?: string[]; subtitle?: string; location?: string; area?: string },
): CanonicalRegion | null => {
  // 1. Check badgeSub (e.g., 'Churchgate, South Mumbai', 'Vile Parle West, Western Suburbs')
  if (item.badgeSub) {
    const reg = resolveCanonicalRegion(item.badgeSub);
    if (reg) return reg;
  }

  // 2. Check meta array for 'Region: ...' tags
  if (item.meta && Array.isArray(item.meta)) {
    for (const m of item.meta) {
      if (/^Region:\s*/i.test(m)) {
        const reg = resolveCanonicalRegion(m.replace(/^Region:\s*/i, ''));
        if (reg) return reg;
      }
    }
    for (const m of item.meta) {
      const reg = resolveCanonicalRegion(m);
      if (reg) return reg;
    }
  }

  // 3. Check any explicit location / area field
  if ('location' in item && typeof item.location === 'string' && item.location) {
    const reg = resolveCanonicalRegion(item.location);
    if (reg) return reg;
  }
  if ('area' in item && typeof item.area === 'string' && item.area) {
    const reg = resolveCanonicalRegion(item.area);
    if (reg) return reg;
  }

  // 4. Check subtitle
  if (item.subtitle) {
    const reg = resolveCanonicalRegion(item.subtitle);
    if (reg) return reg;
  }

  // 5. Check title (with strict whole-word locality matches only)
  if (item.title) {
    const reg = resolveCanonicalRegion(item.title);
    if (reg) return reg;
  }

  return null;
};

/**
 * Canonical location classification utility for colleges.
 * Returns one of the 5 canonical zones, or 'All Mumbai' if unresolved.
 */
export const getCollegeRegion = (collegeNameOrAddress: string): string => {
  const reg = resolveCanonicalRegion(collegeNameOrAddress);
  return reg || 'All Mumbai';
};

/**
 * Tests whether a SearchResultItem matches the user's selected Mumbai region.
 * Accepts a canonical zone, a locality, or a comma-separated list of either (OR).
 * Unresolved colleges are never falsely assigned to restrictive zones.
 */
export const matchItemRegion = (
  item: SearchResultItem | { title: string; badgeSub?: string; meta?: string[]; subtitle?: string; location?: string; area?: string },
  targetRegion: string | null | undefined,
): boolean => {
  if (!targetRegion || targetRegion === 'All Mumbai') return true;
  const targets = parseMultiValue(targetRegion);
  if (targets.length > 1) return targets.some((t) => matchItemRegion(item, t));

  const text = [
    item.title,
    item.badgeSub || '',
    ...(item.meta || []),
    item.subtitle || '',
  ].join(' ');

  // If filtering by a specific locality (e.g. 'Andheri', 'Churchgate')
  if (isLocality(targetRegion)) {
    return textHasLocality(text, targetRegion);
  }

  // If filtering by a canonical zone (e.g. 'South Mumbai', 'Western Suburbs')
  const itemRegion = resolveItemCanonicalRegion(item);
  if (!itemRegion) {
    // Unresolved college: excluded from restrictive region filters
    return false;
  }

  const normalizedTarget = targetRegion === 'Harbour Line' ? 'Harbour / Central-East' : targetRegion;
  return itemRegion === normalizedTarget;
};

/**
 * Matches a course item against a selected field of study / stream filter.
 * Uses structured discipline data first, with reliable domain fallback.
 * Excludes unrelated courses and avoids false positives from college names.
 */
export const matchCourseDiscipline = (
  item: SearchResultItem,
  streamFilter: string | null | undefined,
): boolean => {
  if (!streamFilter || streamFilter.startsWith('All') || streamFilter === 'All Fields') return true;

  const target = streamFilter.trim();

  // 1. Authoritative structured discipline field
  if (item.discipline && item.discipline.length > 0) {
    if (item.discipline.includes(target)) return true;
    if (item.discipline.some((d) => d.toLowerCase() === target.toLowerCase())) return true;

    if (target === 'Data Science & IT') {
      return item.discipline.some((d) => /data science|it|information technology|analytics|computing/i.test(d));
    }
    if (target === 'Commerce & Accounting') {
      return item.discipline.some((d) => /commerce|accounting|accountancy/i.test(d));
    }
    if (target === 'Management & Leadership') {
      return item.discipline.some((d) => /management|leadership|bms/i.test(d));
    }
    if (target === 'Finance & Markets') {
      return item.discipline.some((d) => /finance|markets|banking|insurance/i.test(d));
    }
    return false;
  }

  // 2. Structured fallback matching on title and relevant domain description (never on meta college names)
  const title = (item.title || '').trim();
  const why = (item.whyRelevant || '').trim();

  if (target === 'Data Science & IT') {
    return (
      /\b(data\s+science|data\s+analytics|b\.?sc\s+data|b\.?sc\s+it|information\s+technology|computing|software)\b/i.test(title) ||
      /\bIT\b/.test(title) ||
      /\b(machine\s+learning|data\s+architecture|cybersecurity)\b/i.test(why)
    );
  }

  if (target === 'Commerce & Accounting') {
    return (
      /\b(accounting|accountancy|commerce|baf|b\.?com|bcom)\b/i.test(title) ||
      /\b(financial\s+auditing|taxation)\b/i.test(why)
    );
  }

  if (target === 'Management & Leadership') {
    return (
      /\b(management|bms|bba|leadership)\b/i.test(title) ||
      /\b(strategic\s+management|corporate\s+marketing)\b/i.test(why)
    );
  }

  if (target === 'Finance & Markets') {
    return (
      /\b(financial\s+markets|bfm|banking|insurance|finance|bbi)\b/i.test(title) ||
      /\b(capital\s+markets|derivatives|bfsi|retail\s+banking)\b/i.test(why)
    );
  }

  // Generic token boundary match
  const tokens = target.toLowerCase().split(/[\s&,/()]+/).filter((t) => t.length > 2);
  return tokens.some((t) => new RegExp(`\\b${t}\\b`, 'i').test(title));
};

/**
 * Matches an item against a qualification level filter (e.g. Undergraduate, Professional, Diploma).
 * Normalizes legacy composite labels such as "Undergraduate Degree (B.Com/BMS/BAF)".
 */
export const matchItemLevel = (
  item: SearchResultItem,
  levelFilter: string | null | undefined,
): boolean => {
  if (!levelFilter || levelFilter.startsWith('All') || levelFilter === 'All Levels') return true;

  const norm = levelFilter.toLowerCase().trim();

  // 1. Authoritative structured qualificationLevel field
  if (item.qualificationLevel) {
    const itemLevel = item.qualificationLevel.toLowerCase();
    if (norm.includes('undergraduate') && itemLevel.includes('undergraduate')) return true;
    if (norm.includes('professional') && itemLevel.includes('professional')) return true;
    if (norm.includes('diploma') && itemLevel.includes('diploma')) return true;
    if (norm.includes('certification') && itemLevel.includes('certification')) return true;
  }

  // 2. Undergraduate Degree (supports "Undergraduate Degree", "Undergraduate Degree (B.Com/BMS/BAF)", "Undergraduate")
  if (norm.includes('undergraduate')) {
    const badge = (item.badgeSub || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    return (
      badge.includes('undergraduate') ||
      /\bbachelor\b/i.test(title) ||
      /\bb\.(?:sc|com|a|af|fm|bi|ms)\b/i.test(title) ||
      /3-year/i.test(badge)
    );
  }

  // 3. Professional Qualification (CA / CS / CMA)
  if (norm.includes('professional') || norm.includes('ca/cs/cma')) {
    const badge = (item.badgeSub || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    return (
      badge.includes('professional') ||
      /\b(ca|cs|cma|cfa|acca)\b/i.test(title)
    );
  }

  // 4. Diploma & Certifications
  if (norm.includes('diploma') || norm.includes('certif')) {
    if (item.qualificationLevel) {
      const itemLevel = item.qualificationLevel.toLowerCase();
      if (itemLevel.includes('diploma') || itemLevel.includes('certif')) return true;
    }
    const badge = (item.badgeSub || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    return (
      badge.includes('diploma') ||
      badge.includes('certif') ||
      /\b(diploma|certification|certificate)\b/i.test(title)
    );
  }

  return false;
};

/**
 * Filters a result list by qualification level using AND logic.
 */
export const applyLevelFilter = (
  items: SearchResultItem[],
  levelFilter: string | null | undefined,
): SearchResultItem[] => {
  if (!levelFilter || levelFilter.startsWith('All') || levelFilter === 'All Levels') return items;
  return items.filter((item) => matchItemLevel(item, levelFilter));
};

/**
 * Applies a stream / field / interest / industry keyword filter to a result list.
 * Dispatches domain-specific matching for courses, colleges, and careers
 * to prevent false positives from short tokens and unrelated college names.
 */
export const applyStreamFilter = (
  items: SearchResultItem[],
  streamFilter: string | null | undefined,
): SearchResultItem[] => {
  if (!streamFilter || streamFilter.startsWith('All') || streamFilter === 'All Streams' || streamFilter === 'All Fields') {
    return items;
  }

  return items.filter((item) => {
    // 1. Courses: use strict discipline / taxonomy matching
    if (item.category === 'courses') {
      return matchCourseDiscipline(item, streamFilter);
    }

    // 2. Colleges: match offered programs and stream names using word boundaries
    if (item.category === 'colleges') {
      const offeredText = (item.subtitle || '').toLowerCase();
      const collegeTitle = (item.title || '').toLowerCase();

      if (streamFilter === 'Commerce') {
        return /\b(b\.?com|commerce|baf|bbi|bfm)\b/i.test(offeredText) || /\bcommerce\b/i.test(collegeTitle);
      }
      if (streamFilter === 'Arts') {
        return /\b(b\.?a|arts|bammc|bmm)\b/i.test(offeredText) || /\barts\b/i.test(collegeTitle);
      }
      if (streamFilter === 'Science') {
        return /\b(b\.?sc|science)\b/i.test(offeredText) || /\bscience\b/i.test(collegeTitle);
      }
      if (streamFilter === 'Management (BMS)' || streamFilter === 'Management') {
        return /\b(bms|management|bba)\b/i.test(offeredText);
      }
      if (streamFilter === 'Finance & Accounting (BAF)' || streamFilter === 'Finance') {
        return /\b(baf|finance|accounting|bfm)\b/i.test(offeredText);
      }
      if (streamFilter === 'Data Science & IT') {
        return /\b(b\.?sc\s*it|data\s*science|analytics)\b/i.test(offeredText) || /\bIT\b/.test(item.subtitle || '');
      }

      // General college keyword boundary match (avoiding stop words and 2-letter false matches)
      const stopWords = new Set(['and', 'the', 'for', 'with', 'all']);
      const kwList = streamFilter.toLowerCase().split(/[\s&,/()]+/).filter((k) => k.length >= 3 && !stopWords.has(k));
      return kwList.some((kw) =>
        new RegExp(`\\b${kw}\\b`, 'i').test(offeredText) ||
        new RegExp(`\\b${kw}\\b`, 'i').test(collegeTitle)
      );
    }

    // 3. Careers: match domain pathways
    if (item.category === 'careers') {
      const text = [item.title, item.badgeSub || '', ...(item.meta || [])].join(' ').toLowerCase();
      if (streamFilter === 'Investment & Equity Research') {
        return /investment|equity|analyst/i.test(text);
      }
      if (streamFilter === 'Corporate Banking & CA') {
        return /banking|audit|ca|finance/i.test(text);
      }
      if (streamFilter === 'Brand Management & Advertising') {
        return /brand|advertising|marketing/i.test(text);
      }
      if (streamFilter === 'Technology & Analytics') {
        return /tech|analytics|data/i.test(text);
      }

      const kwList = streamFilter.toLowerCase().split(/[\s&,/()]+/).filter((k) => k.length >= 3);
      return kwList.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(text));
    }

    // 4. Classes / Cutoffs / Other
    const text = [item.title, item.badgeCategory, item.badgeSub || '', ...(item.meta || []), item.subtitle || ''].join(' ').toLowerCase();
    const keywords = streamFilter.toLowerCase().split(/[\s&,/()]+/).filter((k) => k.length >= 3);
    return keywords.some((kw) => text.includes(kw));
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Classes filtering (reused by ClassesModal internal preview and CategoryResultsPage)
// ─────────────────────────────────────────────────────────────────────────────

export interface ClassFilterParams {
  interest?: string | null;
  region?: string | null;
  specialization?: string | null;
  query?: string | null;
}

/**
 * Matches a ClassData item against a Mumbai region string.
 *
 * Actual region values in the dataset:
 *   "Mumbai South"    → South Mumbai
 *   "Mumbai West"     → Western Suburbs
 *   "Mumbai North"    → Western Suburbs (Borivali/Kandivali/Malad belt)
 *   "Eastern Suburbs" → Eastern Suburbs
 *   "Kalyan" / "Thane" → excluded (not Mumbai proper)
 *
 * The area and address fields are also checked for locality keywords.
 */
export const matchClassRegion = (cls: ClassData, targetRegion: string): boolean => {
  if (!targetRegion || targetRegion === 'All Mumbai') return true;
  const targets = parseMultiValue(targetRegion);
  if (targets.length > 1) return targets.some((t) => matchClassRegion(cls, t));

  const regionStr = (cls.region || '').toUpperCase();
  const areaStr   = (cls.area    || '').toUpperCase();
  const addrStr   = (cls.address || '').toUpperCase();
  const combined  = `${regionStr} ${areaStr} ${addrStr}`;

  // Locality: match the class's own area / address fields only.
  if (isLocality(targetRegion)) return textHasLocality(`${areaStr} ${addrStr}`, targetRegion);

  if (targetRegion === 'South Mumbai') {
    return (
      regionStr === 'MUMBAI SOUTH' ||
      combined.includes('SOUTH') ||
      combined.includes('LOWER PAREL') ||
      combined.includes('MAHALAKSHMI') ||
      combined.includes('MAHALAXMI') ||
      combined.includes('FORT') ||
      combined.includes('CHURCHGATE') ||
      combined.includes('CHARNI') ||
      combined.includes('PAREL') ||
      combined.includes('WORLI') ||
      combined.includes('DADAR') ||
      combined.includes('NM JOSHI') ||
      combined.includes('DELISLE')
    );
  }

  if (targetRegion === 'Western Suburbs') {
    return (
      regionStr === 'MUMBAI WEST' ||
      regionStr === 'MUMBAI NORTH' ||
      combined.includes('WESTERN') ||
      combined.includes('ANDHERI') ||
      combined.includes('BANDRA') ||
      combined.includes('BORIVALI') ||
      combined.includes('KANDIVALI') ||
      combined.includes('MALAD') ||
      combined.includes('GOREGAON') ||
      combined.includes('SANTACRUZ') ||
      combined.includes('VILE PARLE') ||
      combined.includes('JOGESHWARI') ||
      combined.includes('DAHISAR') ||
      combined.includes('MIRA ROAD') ||
      combined.includes('BHAYANDAR') ||
      combined.includes('NAIGAON') ||
      combined.includes('VASAI') ||
      combined.includes('NALASOPARA') ||
      combined.includes('VIRAR')
    );
  }

  if (targetRegion === 'Central Suburbs') {
    return (
      combined.includes('MATUNGA') ||
      combined.includes('SION') ||
      combined.includes('KURLA') ||
      combined.includes('GHATKOPAR') ||
      combined.includes('CHEMBUR') ||
      combined.includes('WADALA') ||
      combined.includes('VIDYAVIHAR') ||
      combined.includes('TILAKNAGAR')
    );
  }

  if (targetRegion === 'Eastern Suburbs') {
    return (
      regionStr === 'EASTERN SUBURBS' ||
      combined.includes('EASTERN') ||
      combined.includes('MULUND') ||
      combined.includes('BHANDUP') ||
      combined.includes('VIKHROLI') ||
      combined.includes('KANJURMARG') ||
      combined.includes('NAHUR')
    );
  }

  if (targetRegion === 'Harbour / Central-East') {
    return (
      combined.includes('HARBOUR') ||
      combined.includes('BELAPUR') ||
      combined.includes('VASHI') ||
      combined.includes('NERUL') ||
      combined.includes('PANVEL')
    );
  }

  return true;
};

/**
 * Filters the CLASSES array by the given parameters.
 * Used by CategoryResultsPage for the /classes route.
 * Returns up to 200 results (the dataset is large).
 */
export const filterClasses = (params: ClassFilterParams): ClassData[] => {
  const q = (params.query || '').toLowerCase().trim();

  return CLASSES.filter((cls) => {
    const matchesSearch =
      !q ||
      cls.name.toLowerCase().includes(q) ||
      cls.area?.toLowerCase().includes(q) ||
      cls.address?.toLowerCase().includes(q) ||
      cls.specializations?.toLowerCase().includes(q) ||
      cls.streams?.toLowerCase().includes(q);

    // Interest / stream filter
    const matchesInterest =
      !params.interest || params.interest.startsWith('All') ||
      cls.streams?.toLowerCase().includes(params.interest.toLowerCase()) ||
      cls.specializations?.toLowerCase().includes(params.interest.toLowerCase());

    // Region filter
    const matchesRegion = matchClassRegion(cls, params.region || 'All Mumbai');

    // Specialization filter — composite options like "CA / CS / CMA" match any part.
    const specTokens = (params.specialization || '')
      .toLowerCase().split('/').map((t) => t.trim()).filter(Boolean);
    const matchesSpec =
      !params.specialization || params.specialization.startsWith('All') ||
      specTokens.some((t) =>
        cls.specializations?.toLowerCase().includes(t) ||
        cls.streams?.toLowerCase().includes(t));

    // Exclude non-Mumbai locations that are still out of scope
    const regionUpper = (cls.region || '').toUpperCase();
    const isInMumbai = !['KALYAN', 'THANE', 'NAVI MUMBAI'].some(
      (excluded) => regionUpper.includes(excluded)
    );

    return matchesSearch && matchesInterest && matchesRegion && matchesSpec && isInMumbai;
  }).slice(0, 200);
};

// ─────────────────────────────────────────────────────────────────────────────
// Available localities per category (derived from real data, computed once)
// ─────────────────────────────────────────────────────────────────────────────

const localityCache: Partial<Record<'colleges' | 'classes', string[]>> = {};

/**
 * Returns only the localities that have at least one matching record in the
 * dataset, so the filter never offers options that cannot produce results.
 */
export const getAvailableLocalities = (category: 'colleges' | 'classes'): string[] => {
  if (!localityCache[category]) {
    localityCache[category] = category === 'classes'
      ? MUMBAI_LOCALITIES.filter((loc) => filterClasses({ region: loc }).length > 0)
      : MUMBAI_LOCALITIES.filter((loc) =>
          ALL_SEARCH_RESULTS.some((item) => item.category === 'colleges' && matchItemRegion(item, loc)));
  }
  return localityCache[category]!;
};

