import { SearchResultItem, CategoryType } from '../types';
import { ALL_SEARCH_RESULTS } from '../data/mockData';
import { CLASSES, ClassData } from '../data/classes';
import { CUTOFFS, CutoffMetadata } from '../data/cutoffs';
import { FYJC_CUTOFFS, FyjcCutoff } from '../data/fyjcCutoffs';
import { INITIAL_PDF_RESOURCES } from '../data/pdfResources';
import { getAllColleges, formatCollegeTitle, getCollegeGroupingKey } from './collegeData';

/**
 * Computes relevance score for ranking exact matches above weaker description/metadata matches.
 */
function computeScore(
  title: string,
  secondaryTexts: (string | undefined | null)[],
  q: string,
  tokens: string[]
): number {
  if (!q) return 0;
  const titleLower = title.toLowerCase().trim();
  let score = 0;

  // 1. Exact title match
  if (titleLower === q) {
    score += 1000;
  } else if (titleLower.startsWith(q)) {
    score += 600;
  } else if (titleLower.includes(q)) {
    score += 400;
  } else if (tokens.length > 0 && tokens.every((t) => titleLower.includes(t))) {
    score += 250;
  } else {
    const titleTokenMatches = tokens.filter((t) => titleLower.includes(t)).length;
    if (titleTokenMatches > 0) {
      score += titleTokenMatches * 50;
    }
  }

  // 2. Secondary text matching (subtitles, location, streams, specializations, metadata)
  const secondaryCombined = secondaryTexts.filter(Boolean).join(' ').toLowerCase();
  if (secondaryCombined.includes(q)) {
    score += 100;
  } else {
    const secondaryTokenMatches = tokens.filter((t) => secondaryCombined.includes(t)).length;
    if (secondaryTokenMatches > 0) {
      score += secondaryTokenMatches * 20;
    }
  }

  return score;
}

export function searchInfostaan(query: string, category: CategoryType | string): SearchResultItem[] {
  const normalizedCategory = category || 'all';
  const q = query.toLowerCase().trim().replace(/\s+/g, ' ');
  const tokens = q ? q.split(' ').filter(Boolean) : [];

  let results: { item: SearchResultItem; score: number }[] = [];

  // Helper to match text against query
  const matchesQuery = (texts: (string | undefined | null)[]): boolean => {
    if (!q) return true;
    const combined = texts.filter(Boolean).join(' ').toLowerCase();
    // Match either full query or all individual space-delimited tokens
    return combined.includes(q) || (tokens.length > 1 && tokens.every((t) => combined.includes(t)));
  };

  // 1. Colleges: unified list of all institutions in Mumbai
  if (normalizedCategory === 'all' || normalizedCategory === 'colleges') {
    const allColleges = getAllColleges();
    const collegeMatches = allColleges.filter((item) => {
      if (!q) return true;
      return matchesQuery([
        item.title,
        item.subtitle,
        item.badgeCategory,
        item.badgeSub,
        item.collegeId,
        item.collegeSlug,
        ...(item.meta || []),
      ]);
    });

    collegeMatches.forEach((item) => {
      const score = computeScore(
        item.title,
        [item.subtitle, item.badgeSub, item.badgeCategory, ...(item.meta || [])],
        q,
        tokens
      );
      results.push({ item, score });
    });
  }

  // 2. Courses and Careers from curated catalog
  if (normalizedCategory === 'all' || normalizedCategory === 'courses' || normalizedCategory === 'careers') {
    const curatedMatches = ALL_SEARCH_RESULTS.filter((item) => {
      if (item.category === 'colleges') return false; // Handled via getAllColleges
      if (normalizedCategory !== 'all' && item.category !== normalizedCategory) return false;
      if (!q) return true;
      return matchesQuery([
        item.title,
        item.subtitle,
        item.badgeCategory,
        item.badgeSub,
        item.whyRelevant,
        item.courseFamily,
        item.qualificationLevel,
        ...(item.meta || []),
        ...(item.discipline || []),
      ]);
    });

    curatedMatches.forEach((item) => {
      const score = computeScore(
        item.title,
        [
          item.subtitle,
          item.badgeSub,
          item.badgeCategory,
          item.whyRelevant,
          item.courseFamily,
          item.qualificationLevel,
          ...(item.meta || []),
          ...(item.discipline || []),
        ],
        q,
        tokens
      );
      results.push({ item, score });
    });
  }

  // 3. Coaching Classes & Institutes
  if (normalizedCategory === 'all' || normalizedCategory === 'classes') {
    const classFilter = (cls: ClassData) => {
      if (!q) return true;
      return matchesQuery([
        cls.name,
        cls.area,
        cls.region,
        cls.streams,
        cls.specializations,
        cls.address,
      ]);
    };

    // When a query is present or in category-specific view, do not impose arbitrary slice limits.
    // In empty 'all' mode, take a representative selection to avoid overwhelming initial memory.
    const rawClassMatches = CLASSES.filter(classFilter);
    const classesToInclude = (!q && normalizedCategory === 'all')
      ? rawClassMatches.slice(0, 30)
      : rawClassMatches;

    classesToInclude.forEach((cls) => {
      const item: SearchResultItem = {
        id: cls.id,
        slug: cls.slug || cls.id,
        category: 'classes',
        badgeCategory: 'Coaching Class',
        badgeSub: cls.area || cls.region || 'Mumbai',
        title: cls.name,
        subtitle: cls.specializations ? `Specialization: ${cls.specializations}` : (cls.streams ? `Streams: ${cls.streams}` : 'Coaching & Classes'),
        meta: [cls.streams, cls.area, cls.region].filter(Boolean) as string[],
        whyRelevant: q ? `Matches your search for "${query}"` : 'Recommended coaching class in Mumbai',
        tagColor: 'lavender',
        actionLabel: 'View Class Details',
      };

      const score = computeScore(
        cls.name,
        [cls.specializations, cls.streams, cls.area, cls.region, cls.address],
        q,
        tokens
      );
      results.push({ item, score });
    });
  }

  // 4. Admission Cutoffs & Cutoff PDFs
  if (normalizedCategory === 'all' || normalizedCategory === 'cutoffs') {
    // A. Official PDF cutoff documents
    const cutoffMatches = CUTOFFS.filter((cutoff) => {
      if (!q) return true;
      return matchesQuery([
        cutoff.documentTitle,
        cutoff.collegeName,
        cutoff.stream,
        cutoff.description,
        cutoff.academicYear,
      ]);
    });

    cutoffMatches.forEach((cutoff) => {
      const item: SearchResultItem = {
        id: cutoff.id,
        category: 'cutoffs',
        badgeCategory: `${cutoff.stream || 'Admission'} Cutoff Document`,
        badgeSub: cutoff.academicYear || '2025-26',
        title: cutoff.documentTitle,
        subtitle: cutoff.collegeName ? `${cutoff.collegeName} • ${cutoff.description || 'Official Document'}` : cutoff.description,
        meta: [cutoff.stream || 'General', 'Official PDF Document'],
        whyRelevant: q ? `Matches your search for "${query}"` : 'Official admission data document',
        tagColor: 'tertiary',
        actionLabel: 'View Cutoff Document',
        collegeId: cutoff.collegeId,
        sourceFile: cutoff.sourceFile,
        slug: cutoff.slug,
      };

      const score = computeScore(
        cutoff.documentTitle,
        [cutoff.collegeName, cutoff.stream, cutoff.description],
        q,
        tokens
      );
      results.push({ item, score: score + 10 }); // Cutoff documents matching query rank cleanly
    });

    // B. FYJC Cutoffs (grouped deduplicated cutoff entries)
    if (q || normalizedCategory === 'cutoffs') {
      const fyjcMatches = FYJC_CUTOFFS.filter((c) => {
        if (!q) return true;
        return matchesQuery([
          c.collegeName,
          c.stream,
          c.category,
          c.choiceCode,
        ]);
      });

      // In universal 'all' search, group by collegeGroupingKey so a college search
      // produces clean, distinct cutoff insights rather than hundreds of duplicate cards
      if (normalizedCategory === 'all' && q) {
        const grouped = new Map<string, FyjcCutoff[]>();
        for (const c of fyjcMatches) {
          const key = getCollegeGroupingKey(c);
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key)!.push(c);
        }

        grouped.forEach((group) => {
          const primary = group[0];
          const bestName = formatCollegeTitle(primary.collegeName);
          const streams = Array.from(new Set(group.map((g) => g.stream))).join(', ');
          const minCut = Math.min(...group.map((g) => g.cutoff));
          const maxCut = Math.max(...group.map((g) => g.cutoff));
          const slug = primary.collegeId || bestName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

          const item: SearchResultItem = {
            id: `cutoff-${primary.id}`,
            category: 'cutoffs',
            badgeCategory: group.length > 1 ? 'Multiple FYJC Cutoffs' : `${primary.stream} Cutoff`,
            badgeSub: minCut === maxCut ? `${maxCut}% (${primary.year})` : `${minCut}%–${maxCut}% (${primary.year})`,
            title: `${bestName} — Cutoff Data`,
            subtitle: group.length > 1
              ? `${group.length} Streams: ${streams} • Threshold Range: ${minCut}%–${maxCut}%`
              : `FYJC Cutoff: ${primary.cutoff}% • Choice Code: ${primary.choiceCode}`,
            meta: [streams, `Top: ${maxCut}%`, `Year: ${primary.year}`],
            whyRelevant: `Official FYJC cutoff threshold for ${bestName}`,
            tagColor: 'tertiary',
            actionLabel: 'View College Details',
            collegeId: primary.collegeId || slug,
            collegeSlug: primary.collegeId || slug,
          };

          const score = computeScore(bestName, [streams, primary.choiceCode, primary.stream], q, tokens);
          results.push({ item, score });
        });
      } else if (normalizedCategory === 'cutoffs') {
        fyjcMatches.forEach((c) => {
          const bestName = formatCollegeTitle(c.collegeName);
          const slug = c.collegeId || bestName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const item: SearchResultItem = {
            id: c.id,
            category: 'cutoffs',
            badgeCategory: `${c.stream} Cutoff`,
            badgeSub: `${c.cutoff}% (${c.year})`,
            title: bestName,
            subtitle: `FYJC Cutoff: ${c.cutoff}% • Choice Code: ${c.choiceCode} • Stream: ${c.stream} (${c.category || 'General'})`,
            meta: [c.stream, `Cutoff: ${c.cutoff}%`, `Code: ${c.choiceCode}`],
            whyRelevant: `Official FYJC cutoff threshold: ${c.cutoff}%`,
            tagColor: 'tertiary',
            actionLabel: 'View Details',
            collegeId: c.collegeId || slug,
            collegeSlug: c.collegeId || slug,
          };

          const score = computeScore(bestName, [c.stream, c.choiceCode, c.category], q, tokens);
          results.push({ item, score });
        });
      }
    }
  }

  // 5. Available Educational PDF Resources
  if (normalizedCategory === 'all' || normalizedCategory === 'pdf' || normalizedCategory === 'pdf-resources') {
    const pdfMatches = INITIAL_PDF_RESOURCES.filter((pdf) => {
      if (!q) return true;
      return matchesQuery([
        pdf.title,
        pdf.subtitle,
        pdf.description,
        pdf.category,
        pdf.edition,
        pdf.language,
        ...(pdf.topicsCovered || []),
      ]);
    });

    pdfMatches.forEach((pdf) => {
      const item: SearchResultItem = {
        id: pdf.id,
        category: 'pdf',
        badgeCategory: 'PDF Resource',
        badgeSub: `${pdf.category} • ₹${pdf.price}`,
        title: pdf.title,
        subtitle: pdf.subtitle || pdf.description,
        meta: [pdf.category, `${pdf.pages} Pages`, pdf.edition, `₹${pdf.price}`],
        whyRelevant: q ? `Matches your search for "${query}"` : 'Official Infostaan Study Resource',
        tagColor: 'primary',
        actionLabel: 'View PDF Details',
        slug: pdf.slug,
      };

      const score = computeScore(
        pdf.title,
        [pdf.subtitle, pdf.description, pdf.category, ...(pdf.topicsCovered || [])],
        q,
        tokens
      );
      results.push({ item, score });
    });
  }

  // Ranking: If a query is provided, sort by match score descending.
  // Break ties with exact title length or alphabetical order.
  if (q) {
    results.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.item.title.localeCompare(b.item.title);
    });
  }

  return results.map((r) => r.item);
}
