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
 * Mirrors the logic in ClassesModal.
 */
export const matchClassRegion = (cls: ClassData, targetRegion: string): boolean => {
  if (!targetRegion || targetRegion === 'All Mumbai') return true;
  const text = [cls.region || '', cls.area || '', cls.address || ''].join(' ').toUpperCase();
  if (targetRegion === 'South Mumbai') {
    return (
      text.includes('SOUTH') || text.includes('LOWER PAREL') ||
      text.includes('MAHALAKSHMI') || text.includes('FORT') ||
      text.includes('CHURCHGATE') || text.includes('CHARNI') ||
      text.includes('MUMBAI SOUTH')
    );
  }
  if (targetRegion === 'Western Suburbs') {
    return (
      text.includes('WESTERN') || text.includes('ANDHERI') ||
      text.includes('BANDRA') || text.includes('BORIVALI') ||
      text.includes('PARLE') || text.includes('MALAD') ||
      text.includes('KANDIVALI') || text.includes('GOREGAON') ||
      text.includes('SANTACRUZ')
    );
  }
  if (targetRegion === 'Central Suburbs') {
    return (
      text.includes('CENTRAL') || text.includes('MATUNGA') ||
      text.includes('DADAR') || text.includes('SIES') ||
      text.includes('KURLA') || text.includes('GHATKOPAR')
    );
  }
  if (targetRegion === 'Eastern Suburbs') {
    return (
      text.includes('EASTERN') || text.includes('MULUND') ||
      text.includes('BHANDUP') || text.includes('VIKHROLI')
    );
  }
  if (targetRegion === 'Harbour / Central-East') {
    return (
      text.includes('CHEMBUR') || text.includes('VASHI') ||
      text.includes('BELAPUR') || text.includes('HARBOUR')
    );
  }
  return true;
};

/**
 * Filters the CLASSES array by the given parameters.
 * Used by CategoryResultsPage for the /classes route.
 */
export const filterClasses = (params: ClassFilterParams): ClassData[] => {
  const q = (params.query || '').toLowerCase().trim();
  return CLASSES.filter((cls) => {
    const matchesSearch =
      !q ||
      cls.name.toLowerCase().includes(q) ||
      cls.area?.toLowerCase().includes(q) ||
      cls.specializations?.toLowerCase().includes(q);

    const matchesInterest =
      !params.interest || params.interest.startsWith('All') ||
      cls.streams?.toLowerCase().includes(params.interest.toLowerCase()) ||
      cls.specializations?.toLowerCase().includes(params.interest.toLowerCase());

    const matchesRegion = matchClassRegion(cls, params.region || 'All Mumbai');

    const matchesSpec =
      !params.specialization || params.specialization.startsWith('All') ||
      cls.specializations?.toLowerCase().includes(params.specialization.toLowerCase());

    return matchesSearch && matchesInterest && matchesRegion && matchesSpec;
  });
};
