import { SearchResultItem } from '../types';
import { CLASSES, ClassData } from '../data/classes';

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
    name.includes('ELPHINSTONE') || name.includes('WILSON')
  ) return 'South Mumbai';
  if (
    name.includes('MITHIBAI') || name.includes('N.M.') || name.includes('NARSEE') ||
    name.includes('SVKM') || name.includes('ANDHERI') || name.includes('PARLE') ||
    name.includes('MALAD') || name.includes('BORIVALI') || name.includes('BANDRA') ||
    name.includes('KANDIVALI') || name.includes('GOREGAON') || name.includes('SANTACRUZ') ||
    name.includes('BHAVAN')
  ) return 'Western Suburbs';
  if (
    name.includes('PODAR') || name.includes('MATUNGA') || name.includes('DADAR') ||
    name.includes('SIES') || name.includes('RUPAREL') || name.includes('KHALSA') ||
    name.includes('VIDYALANKAR')
  ) return 'Central Suburbs';
  if (
    name.includes('GHATKOPAR') || name.includes('MULUND') || name.includes('BHANDUP') ||
    name.includes('VIKHROLI') || name.includes('SOMAIYA')
  ) return 'Eastern Suburbs';
  if (name.includes('CHEMBUR') || name.includes('VASHI') || name.includes('BELAPUR')) {
    return 'Harbour / Central-East';
  }
  return 'All Mumbai';
};

/**
 * Tests whether a SearchResultItem matches the user's selected Mumbai region.
 */
export const matchItemRegion = (
  item: SearchResultItem,
  targetRegion: string | null | undefined,
): boolean => {
  if (!targetRegion || targetRegion === 'All Mumbai') return true;
  const text = [
    item.title,
    item.badgeSub || '',
    ...(item.meta || []),
    item.subtitle || '',
  ].join(' ').toUpperCase();

  if (targetRegion === 'South Mumbai') {
    return (
      text.includes('SOUTH MUMBAI') || text.includes('CHURCHGATE') ||
      text.includes('CHARNI') || text.includes('FORT') ||
      text.includes('MARINE') || text.includes('SOUTH')
    );
  }
  if (targetRegion === 'Western Suburbs') {
    return (
      text.includes('WESTERN') || text.includes('VILE PARLE') ||
      text.includes('ANDHERI') || text.includes('BORIVALI') ||
      text.includes('BANDRA') || text.includes('SUBURBS')
    );
  }
  if (targetRegion === 'Central Suburbs') {
    return (
      text.includes('CENTRAL') || text.includes('MATUNGA') ||
      text.includes('DADAR') || text.includes('KURLA')
    );
  }
  if (targetRegion === 'Eastern Suburbs') {
    return (
      text.includes('EASTERN') || text.includes('GHATKOPAR') ||
      text.includes('MULUND') || text.includes('BHANDUP')
    );
  }
  if (targetRegion === 'Harbour / Central-East') {
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
  const keywords = streamFilter.toLowerCase().split(/[\s&,/]+/).filter(Boolean);
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

  const regionStr = (cls.region || '').toUpperCase();
  const areaStr   = (cls.area    || '').toUpperCase();
  const addrStr   = (cls.address || '').toUpperCase();
  const combined  = `${regionStr} ${areaStr} ${addrStr}`;

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
      combined.includes('MIRA ROAD')
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
    // Text search across name, area, address, and specializations
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

    // Specialization filter
    const matchesSpec =
      !params.specialization || params.specialization.startsWith('All') ||
      cls.specializations?.toLowerCase().includes(params.specialization.toLowerCase()) ||
      cls.streams?.toLowerCase().includes(params.specialization.toLowerCase());

    // Exclude non-Mumbai locations (Kalyan, Thane, Navi Mumbai, Vasai, Virar)
    const regionUpper = (cls.region || '').toUpperCase();
    const isInMumbai = !['KALYAN', 'THANE', 'VASAI', 'VIRAR', 'NAVI MUMBAI'].some(
      (excluded) => regionUpper.includes(excluded)
    );

    return matchesSearch && matchesInterest && matchesRegion && matchesSpec && isInMumbai;
  }).slice(0, 200);
};

