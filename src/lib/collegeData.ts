import { SearchResultItem } from '../types';
import { ALL_SEARCH_RESULTS } from '../data/mockData';
import { FYJC_CUTOFFS, FyjcCutoff } from '../data/fyjcCutoffs';
import { getCollegeRegion } from './categoryFilters';

/**
 * Cleanly formats college names (e.g. UPPERCASE -> Title Case)
 * while preserving acronyms like JR., SR., K.C., SIES, etc.
 */
export function formatCollegeTitle(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  
  // If it's already mixed case, keep it
  const isAllUpper = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
  if (!isAllUpper) return trimmed;

  const words = trimmed.toLowerCase().split(/\s+/);
  return words
    .map((word) => {
      if (['and', '&', 'of', 'for', 'in', 'at', 'on', 'the', 'to'].includes(word)) {
        return word;
      }
      if (word === 'jr' || word === 'jr.') return 'Jr.';
      if (word === 'sr' || word === 'sr.') return 'Sr.';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/^(.)/, (c) => c.toUpperCase());
}

const CURATED_COLLEGE_CODES: Record<string, string[]> = {
  'mithibai': ['MU7133'],
  'hinduja': ['MU6746'],
  'podar': ['MU6833'],
  'jai-hind': ['MU6727'],
  'xaviers': ['MU6724'],
  'sies-college': ['MU6831'],
  'bhavans-college': ['MU7125'],
  'dahanukar-college': ['MU7152'],
  'somaiya-college': ['MU6917'],
  'sophia-college': ['MU6750'],
  'wilson-college': ['MU6743'],
  'ruparel-college': ['MU6768'],
  'rizvi-college': ['MU7061'],
  'vaze-college': ['MU7024'],
  'hr-college': ['MU6728'],
  'nm-college': ['MU7134'],
};

const codeToCurated = new Map<string, string>();
Object.entries(CURATED_COLLEGE_CODES).forEach(([id, codes]) => {
  codes.forEach((c) => codeToCurated.set(c, id));
});

/**
 * Unique institutional identifier for grouping cutoffs so every college
 * produces strictly ONE card regardless of how many streams it offers.
 */
export function getCollegeGroupingKey(c: FyjcCutoff): string {
  if (c.collegeId) return c.collegeId.toLowerCase();
  const m = c.choiceCode ? c.choiceCode.match(/^(MU\d+)[A-Z]/i) : null;
  if (m) {
    const code = m[1].toUpperCase();
    if (codeToCurated.has(code)) return codeToCurated.get(code)!;
    return code;
  }
  return c.collegeName.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getBestCollegeName(group: FyjcCutoff[]): string {
  const names = group.map((c) => c.collegeName.trim());
  names.sort((a, b) => {
    const aPenalty = a.endsWith('&') || a.endsWith('AND') ? -20 : 0;
    const bPenalty = b.endsWith('&') || b.endsWith('AND') ? -20 : 0;
    return (b.length + bPenalty) - (a.length + aPenalty);
  });
  return names[0];
}

let cachedAllColleges: SearchResultItem[] | null = null;
let cachedCollegeMap: Map<string, FyjcCutoff[]> | null = null;

/**
 * Returns grouped cutoffs for any given college slug.
 */
export function getCollegeCutoffGroup(slug: string): FyjcCutoff[] | undefined {
  if (!cachedCollegeMap) {
    getAllColleges(); // Populates cachedCollegeMap
  }
  return cachedCollegeMap?.get(slug);
}

/**
 * Returns the unified list of all colleges in Mumbai:
 * Strictly ONE card per college, aggregating all streams (Arts, Commerce, Science).
 */
export function getAllColleges(): SearchResultItem[] {
  if (cachedAllColleges) {
    return cachedAllColleges;
  }

  // 1. Existing curated colleges from mock data
  const curatedColleges = ALL_SEARCH_RESULTS.filter((item) => item.category === 'colleges');
  const seenSlugs = new Set<string>();
  const seenNormalizedNames = new Set<string>();

  curatedColleges.forEach((col) => {
    if (col.collegeId) seenSlugs.add(col.collegeId.toLowerCase());
    if (col.collegeSlug) seenSlugs.add(col.collegeSlug.toLowerCase());
    const slugFromTitle = col.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    seenSlugs.add(slugFromTitle);
    seenNormalizedNames.add(col.title.toLowerCase().replace(/[^a-z0-9]/g, ''));
  });

  // 2. Group FYJC cutoffs strictly by college key
  const cutoffGroups = new Map<string, FyjcCutoff[]>();
  for (const c of FYJC_CUTOFFS) {
    const key = getCollegeGroupingKey(c);
    if (!cutoffGroups.has(key)) {
      cutoffGroups.set(key, []);
    }
    cutoffGroups.get(key)!.push(c);
  }
  cachedCollegeMap = cutoffGroups;

  // 3. Transform non-duplicate cutoff colleges into SearchResultItem
  const cutoffColleges: SearchResultItem[] = [];

  for (const [key, group] of cutoffGroups.entries()) {
    const bestName = getBestCollegeName(group);
    const normName = bestName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const slug = key.startsWith('MU')
      ? bestName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : key;

    // Index by slug as well if distinct
    if (slug !== key && !cachedCollegeMap.has(slug)) {
      cachedCollegeMap.set(slug, group);
    }

    // Skip if already in curated list
    if (seenSlugs.has(key.toLowerCase()) || seenSlugs.has(slug) || seenNormalizedNames.has(normName)) {
      continue;
    }

    const streams = Array.from(new Set(group.map((c) => c.stream)));
    const cutoffs = group.map((c) => c.cutoff).filter((n) => typeof n === 'number' && !isNaN(n));
    const minCutoff = cutoffs.length > 0 ? Math.min(...cutoffs) : null;
    const maxCutoff = cutoffs.length > 0 ? Math.max(...cutoffs) : null;
    const region = getCollegeRegion(bestName);
    const title = formatCollegeTitle(bestName);

    const cutoffSummary = maxCutoff !== null
      ? (minCutoff !== null && minCutoff !== maxCutoff ? `${minCutoff}%–${maxCutoff}%` : `${maxCutoff}%`)
      : '';

    const streamText = streams.join(', ');

    cutoffColleges.push({
      id: `col-${slug}`,
      slug: slug,
      category: 'colleges',
      badgeCategory: streams.length > 1 ? 'Junior College' : `${streams[0]} Jr. College`,
      badgeSub: `${region}, Mumbai`,
      title: title,
      subtitle: `Offered: ${streamText}${cutoffSummary ? ` • Cutoff: ${cutoffSummary}` : ''}`,
      meta: [
        streamText,
        cutoffSummary ? `FYJC Cutoff: ${cutoffSummary}` : 'FYJC Affiliated',
        `Region: ${region}`,
      ],
      whyRelevant: cutoffSummary
        ? `Official FYJC cutoff threshold: ${cutoffSummary} (${group[0]?.year || '2025-26'})`
        : 'Official Mumbai Junior College',
      tagColor: 'secondary',
      actionLabel: 'Explore College',
      collegeId: slug,
      collegeSlug: slug,
    });
  }

  // Combine curated colleges first, followed by all cutoff colleges
  cachedAllColleges = [...curatedColleges, ...cutoffColleges];
  return cachedAllColleges;
}
