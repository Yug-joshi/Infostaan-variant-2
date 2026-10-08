import { SearchResultItem, CategoryType } from '../types';
import { ALL_SEARCH_RESULTS } from '../data/mockData';
import { CLASSES, ClassData } from '../data/classes';
import { CUTOFFS, CutoffMetadata } from '../data/cutoffs';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';

export function searchInfostaan(query: string, category: CategoryType): SearchResultItem[] {
  const q = query.toLowerCase().trim();
  
  let results: SearchResultItem[] = [];

  // 1. Existing mock data
  const mockResults = ALL_SEARCH_RESULTS.filter(item => {
    if (category !== 'all' && item.category !== category) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.badgeCategory.toLowerCase().includes(q)
    );
  });
  results = [...results, ...mockResults];

  // 2. Classes
  if (category === 'all' || category === 'classes') {
    const classResults: SearchResultItem[] = CLASSES.filter(cls => {
      if (!q) return true;
      return (
        cls.name.toLowerCase().includes(q) ||
        cls.area?.toLowerCase().includes(q) ||
        cls.region?.toLowerCase().includes(q) ||
        cls.streams?.toLowerCase().includes(q) ||
        cls.specializations?.toLowerCase().includes(q)
      );
    }).slice(0, 15).map(cls => ({
      id: cls.id,
      category: 'classes',
      badgeCategory: 'Coaching Class',
      badgeSub: cls.area || cls.region || 'Mumbai',
      title: cls.name,
      subtitle: cls.specializations ? `Specialization: ${cls.specializations}` : 'Coaching & Classes',
      meta: cls.streams ? [cls.streams] : [],
      whyRelevant: q ? `Matches your search for "${query}"` : 'Recommended coaching class in Mumbai',
      tagColor: 'lavender',
      actionLabel: 'View Details',
    }));
    results = [...results, ...classResults];
  }

  // 3. Cutoffs
  if (category === 'all' || category === 'cutoffs') {
    const cutoffResults: SearchResultItem[] = CUTOFFS.filter(cutoff => {
      if (!q) return true;
      return (
        cutoff.documentTitle.toLowerCase().includes(q) ||
        cutoff.collegeName?.toLowerCase().includes(q) ||
        cutoff.stream?.toLowerCase().includes(q)
      );
    }).map(cutoff => ({
      id: cutoff.id,
      category: 'cutoffs',
      badgeCategory: 'Cutoff / Admission Information',
      badgeSub: cutoff.academicYear || '2025-26',
      title: cutoff.documentTitle,
      subtitle: cutoff.collegeName,
      meta: [cutoff.stream || 'General', 'Official PDF'],
      whyRelevant: q ? `Matches your search for "${query}"` : 'Official admission data',
      tagColor: 'tertiary',
      actionLabel: 'View Cutoff PDF',
      collegeId: cutoff.collegeId,
      sourceFile: cutoff.sourceFile
    }));

    const fyjcResults: SearchResultItem[] = FYJC_CUTOFFS.filter(c => {
      if (!q) return true;
      return c.collegeName.toLowerCase().includes(q) || c.stream.toLowerCase().includes(q);
    }).slice(0, 30).map(c => ({
      id: c.id,
      category: 'cutoffs',
      badgeCategory: `${c.stream} Cutoff`,
      badgeSub: `${c.cutoff}% (${c.year})`,
      title: c.collegeName,
      subtitle: `FYJC Cutoff: ${c.cutoff}% • Choice Code: ${c.choiceCode} • Category: ${c.category || 'General'}`,
      meta: [c.stream, `Category: ${c.category}`, `Code: ${c.choiceCode}`],
      whyRelevant: `Official FYJC cutoff threshold: ${c.cutoff}%`,
      tagColor: 'tertiary',
      actionLabel: 'View Details',
      collegeId: c.collegeId || c.collegeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }));

    results = [...results, ...cutoffResults, ...fyjcResults];
  }

  // Simple sorting: put cutoffs and classes near the top if they strongly match
  if (q) {
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(q);
      const bTitleMatch = b.title.toLowerCase().includes(q);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });
  }

  return results;
}
