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

export const LOCALITY_ZONES = [
  {
    zone: 'Western Suburbs',
    localities: ['Virar', 'Nalasopara', 'Vasai Road', 'Naigaon', 'Bhayandar', 'Mira Road', 'Dahisar', 'Borivali', 'Kandivali', 'Malad', 'Goregaon', 'Jogeshwari', 'Andheri', 'Vile Parle', 'Santacruz', 'Bandra'],
  },
  {
    zone: 'South Mumbai',
    localities: ['Churchgate', 'Colaba', 'Fort', 'Marine Lines', 'Charni Road', 'Grant Road', 'Mumbai Central', 'Mahalaxmi', 'Lower Parel', 'Worli', 'Elphinstone Road', 'Prabhadevi', 'Parel'],
  },
  {
    zone: 'Central Suburbs',
    localities: ['Dadar', 'Matunga', 'Sion', 'Kurla', 'Ghatkopar', 'Vikhroli', 'Bhandup', 'Mulund', 'Powai', 'Tilak Nagar', 'Vidyavihar', 'Kanjurmarg'],
  },
  {
    zone: 'Harbour Line',
    localities: ['Chembur'],
  },
];

export const isLocality = (value: string | null | undefined): boolean => {
  if (!value) return false;
  const valLower = value.trim().toLowerCase();
  return MUMBAI_LOCALITIES.some((loc) => loc.toLowerCase() === valLower);
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
 * Heuristically maps a Mumbai college name to its regional zone.
 * Used for college and cutoff region filtering.
 */
export const getCollegeRegion = (collegeName: string): string => {
  const name = collegeName.toUpperCase();
  if (
    name.includes('XAVIER') || name.includes('H.R.') || name.includes('JAI HIND') ||
    name.includes('HINDUJA') || name.includes('FORT') || name.includes('CHURCHGATE') ||
    name.includes('CHARNI ROAD') || name.includes('MARINE') || name.includes('SYDENHAM') ||
    name.includes('ELPHINSTONE') || name.includes('WILSON') || name.includes('SOPHIA')
  ) return 'South Mumbai';
  if (
    name.includes('MITHIBAI') || name.includes('N.M.') || name.includes('NARSEE') ||
    name.includes('SVKM') || name.includes('ANDHERI') || name.includes('PARLE') ||
    name.includes('MALAD') || name.includes('BORIVALI') || name.includes('BANDRA') ||
    name.includes('KANDIVALI') || name.includes('GOREGAON') || name.includes('SANTACRUZ') ||
    name.includes('BHAVAN') || name.includes('RIZVI') || name.includes('DAHANUKAR') ||
    name.includes('KHANDWALA') || name.includes('SHROFF') || name.includes('VIVEK')
  ) return 'Western Suburbs';
  if (
    name.includes('PODAR') || name.includes('MATUNGA') || name.includes('DADAR') ||
    name.includes('SIES') || name.includes('RUPAREL') || name.includes('KHALSA') ||
    name.includes('VIDYALANKAR') || name.includes('SOMAIYA') || name.includes('VAZE') ||
    name.includes('KRISHNA MENON')
  ) return 'Central Suburbs';
  if (
    name.includes('GHATKOPAR') || name.includes('MULUND') || name.includes('BHANDUP') ||
    name.includes('VIKHROLI')
  ) return 'Eastern Suburbs';
  if (name.includes('CHEMBUR') || name.includes('VASHI') || name.includes('BELAPUR')) {
    return 'Harbour / Central-East';
  }
  return 'All Mumbai';
};

/**
 * Tests whether a SearchResultItem matches the user's selected Mumbai region.
 * Accepts a broad zone, a locality, or a comma-separated list of either (OR).
 */
export const matchItemRegion = (
  item: SearchResultItem | { title: string; badgeSub?: string; meta?: string[]; subtitle?: string },
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
  ].join(' ').toUpperCase();

  if (isLocality(targetRegion)) return textHasLocality(text, targetRegion);

  if (targetRegion === 'South Mumbai') {
    return (
      text.includes('SOUTH MUMBAI') || text.includes('CHURCHGATE') ||
      text.includes('CHARNI') || text.includes('FORT') ||
      text.includes('MARINE') || text.includes('SOUTH') ||
      text.includes('PAREL') || text.includes('WORLI') ||
      text.includes('COLABA') || text.includes('GRANT ROAD')
    );
  }
  if (targetRegion === 'Western Suburbs') {
    return (
      text.includes('WESTERN') || text.includes('VILE PARLE') ||
      text.includes('ANDHERI') || text.includes('BORIVALI') ||
      text.includes('BANDRA') || text.includes('MALAD') ||
      text.includes('KANDIVALI') || text.includes('GOREGAON') ||
      text.includes('SANTACRUZ') || text.includes('SUBURBS')
    );
  }
  if (targetRegion === 'Central Suburbs') {
    return (
      text.includes('CENTRAL') || text.includes('MATUNGA') ||
      text.includes('DADAR') || text.includes('KURLA') ||
      text.includes('SION') || text.includes('VIDYAVIHAR')
    );
  }
  if (targetRegion === 'Eastern Suburbs') {
    return (
      text.includes('EASTERN') || text.includes('GHATKOPAR') ||
      text.includes('MULUND') || text.includes('BHANDUP') ||
      text.includes('VIKHROLI') || text.includes('POWAI')
    );
  }
  if (targetRegion === 'Harbour / Central-East' || targetRegion === 'Harbour Line') {
    return text.includes('CHEMBUR') || text.includes('HARBOUR') || text.includes('BELAPUR');
  }
  return true;
};

/**
 * Applies a stream / field / interest / industry keyword filter to a result list.
 * Matches any of the keywords against the item's combined text.
 */
export const applyStreamFilter = (
  items: SearchResultItem[],
  streamFilter: string | null | undefined,
): SearchResultItem[] => {
  if (!streamFilter || streamFilter.startsWith('All')) return items;
  // Parentheses are separators too, so "Management (BMS)" yields "bms" (not "(bms)").
  const keywords = streamFilter.toLowerCase().split(/[\s&,/()]+/).filter(Boolean);
  return items.filter((item) => {
    const text = [
      item.title,
      item.badgeCategory,
      item.badgeSub || '',
      ...(item.meta || []),
      item.subtitle || '',
    ].join(' ').toLowerCase();
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
      cls.name.toLowerCase().includes(q);

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

