import { SearchResultItem, CategoryType, PDFResource } from '../types';
import { ALL_SEARCH_RESULTS } from '../data/mockData';
import { CLASSES, ClassData } from '../data/classes';
import { CUTOFFS, CutoffMetadata } from '../data/cutoffs';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';
import { INITIAL_PDF_RESOURCES } from '../data/pdfResources';
import { MENTORS_DATA } from '../data/mentorsData';
import { getAllColleges } from './collegeData';

const SITE_PAGES: SearchResultItem[] = [
  { id: 'page-colleges', category: 'pages', badgeCategory: 'Site Section', badgeSub: 'Explore', title: 'Colleges', subtitle: 'Browse Mumbai colleges and programs', meta: [], whyRelevant: 'Explore colleges', tagColor: 'primary', actionLabel: 'Browse Colleges', href: '/colleges', searchTerms: ['college', 'institution', 'admission'] },
  { id: 'page-courses', category: 'pages', badgeCategory: 'Site Section', badgeSub: 'Explore', title: 'Courses', subtitle: 'Browse degrees and courses', meta: [], whyRelevant: 'Explore courses', tagColor: 'primary', actionLabel: 'Browse Courses', href: '/courses', searchTerms: ['course', 'degree', 'program'] },
  { id: 'page-careers', category: 'pages', badgeCategory: 'Site Section', badgeSub: 'Explore', title: 'Careers', subtitle: 'Explore career pathways and roadmaps', meta: [], whyRelevant: 'Explore careers', tagColor: 'primary', actionLabel: 'Browse Careers', href: '/careers', searchTerms: ['career', 'job', 'roadmap', 'work'] },
  { id: 'page-classes', category: 'pages', badgeCategory: 'Site Section', badgeSub: 'Explore', title: 'Coaching Classes', subtitle: 'Find coaching and classes in Mumbai', meta: [], whyRelevant: 'Explore classes', tagColor: 'primary', actionLabel: 'Browse Classes', href: '/classes', searchTerms: ['class', 'coaching', 'tuition'] },
  { id: 'page-cutoffs', category: 'pages', badgeCategory: 'Site Section', badgeSub: 'Admissions', title: 'Admission Cutoffs', subtitle: 'Search college admission cutoff data', meta: [], whyRelevant: 'Explore admission cutoffs', tagColor: 'primary', actionLabel: 'Browse Cutoffs', href: '/cutoffs', searchTerms: ['cutoff', 'percentage', 'marks', 'eligibility'] },
  { id: 'page-pdfs', category: 'pages', badgeCategory: 'Site Section', badgeSub: 'Study Resources', title: 'Paid PDFs', subtitle: 'Browse available study resources', meta: [], whyRelevant: 'Explore study resources', tagColor: 'primary', actionLabel: 'Browse PDFs', href: '/pdf-resources', searchTerms: ['pdf', 'notes', 'study resource', 'documents'] },
  { id: 'page-connect', category: 'pages', badgeCategory: 'Site Section', badgeSub: 'Infostaan Connect', title: 'Connect with Professionals', subtitle: 'Browse mentor profiles and book one-to-one guidance', meta: [], whyRelevant: 'Explore professional profiles', tagColor: 'secondary', actionLabel: 'Browse Profiles', href: '/dashboard', searchTerms: ['connect', 'mentor', 'people', 'profile', 'professional', 'networking'] },
  { id: 'page-saved', category: 'pages', badgeCategory: 'Your Account', badgeSub: 'Saved Items', title: 'Saved Items & Shortlist', subtitle: 'View your saved colleges and resources', meta: [], whyRelevant: 'Open your saved items', tagColor: 'secondary', actionLabel: 'View Saved Items', href: '/saved', searchTerms: ['saved', 'save', 'shortlist', 'bookmark'] },
  { id: 'page-cart', category: 'pages', badgeCategory: 'Your Account', badgeSub: 'Shopping', title: 'Shopping Cart', subtitle: 'Review PDFs in your cart', meta: [], whyRelevant: 'Open your cart', tagColor: 'secondary', actionLabel: 'Open Cart', href: '/cart', searchTerms: ['cart', 'shopping', 'checkout'] },
  { id: 'page-purchases', category: 'pages', badgeCategory: 'Your Account', badgeSub: 'Study Resources', title: 'My Purchases', subtitle: 'View purchased PDFs', meta: [], whyRelevant: 'View your purchases', tagColor: 'secondary', actionLabel: 'View Purchases', href: '/my-purchases', searchTerms: ['purchase', 'purchases', 'order', 'bought', 'download'] },
  { id: 'page-profile', category: 'pages', badgeCategory: 'Your Account', badgeSub: 'Profile', title: 'Sign In / Profile', subtitle: 'Open your account sign-in', meta: [], whyRelevant: 'Open your profile', tagColor: 'secondary', actionLabel: 'Open Profile', searchTerms: ['profile', 'account', 'sign in', 'login'], action: 'open-profile' },
  { id: 'page-appearance-settings', category: 'pages', badgeCategory: 'Settings', badgeSub: 'Appearance', title: 'Appearance Settings', subtitle: 'Switch between light and dark theme', meta: [], whyRelevant: 'Change the website appearance', tagColor: 'secondary', actionLabel: 'Toggle Theme', searchTerms: ['settings', 'setting', 'appearance', 'theme', 'dark mode', 'light mode'], action: 'toggle-theme' },
];

export function searchInfostaan(
  query: string,
  category: CategoryType,
  pdfResources: PDFResource[] = INITIAL_PDF_RESOURCES,
): SearchResultItem[] {
  const q = query.toLowerCase().trim();
  
  let results: SearchResultItem[] = [];

  // 1. Colleges: use the complete unified list (curated + all uploaded FYJC cutoffs excel data)
  if (category === 'all' || category === 'colleges') {
    const allColleges = getAllColleges();
    const collegeResults = allColleges.filter(item => {
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.badgeCategory.toLowerCase().includes(q) ||
        item.badgeSub?.toLowerCase().includes(q) ||
        item.meta?.some(m => m.toLowerCase().includes(q))
      );
    });
    results = [...results, ...collegeResults];
  }

  // 2. Courses and Careers from curated mock data
  if (category === 'all' || category === 'courses' || category === 'careers') {
    const otherResults = ALL_SEARCH_RESULTS.filter(item => {
      if (item.category === 'colleges') return false; // Already handled above
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.badgeCategory.toLowerCase().includes(q)
      );
    });
    results = [...results, ...otherResults];
  }

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

    if (category === 'cutoffs') {
      results = [...results, ...cutoffResults, ...fyjcResults];
    } else {
      results = [...results, ...cutoffResults];
    }
  }

  // 4. Paid PDFs
  if (category === 'all' || category === 'pdfs') {
    const pdfResults: SearchResultItem[] = pdfResources.filter(pdf => {
      if (!q) return true;
      return [pdf.title, pdf.subtitle, pdf.description, pdf.category, pdf.edition, ...pdf.topicsCovered]
        .filter(Boolean)
        .some(value => value!.toLowerCase().includes(q));
    }).map(pdf => ({
      id: pdf.id,
      category: 'pdfs',
      badgeCategory: 'Paid PDF',
      badgeSub: pdf.category,
      title: pdf.title,
      subtitle: `₹${pdf.price} • ${pdf.pages} pages • ${pdf.edition}`,
      meta: [pdf.category, `${pdf.pages} pages`, `₹${pdf.price}`],
      whyRelevant: q ? `Matches your search for "${query}"` : 'Available study resource',
      tagColor: 'secondary',
      actionLabel: 'View PDF',
      slug: pdf.slug,
    }));
    results = [...results, ...pdfResults];
  }

  // 5. Infostaan Connect mentors
  if (category === 'all' || category === 'connect') {
    const connectResults: SearchResultItem[] = MENTORS_DATA.filter(mentor => {
      if (!q) return true;
      return [mentor.name, mentor.role, mentor.area, mentor.company, mentor.desc, mentor.about, ...mentor.highlights]
        .some(value => value.toLowerCase().includes(q));
    }).map(mentor => ({
      id: mentor.id,
      category: 'connect',
      badgeCategory: 'Infostaan Connect',
      badgeSub: mentor.area,
      title: mentor.name,
      subtitle: `${mentor.role} • ${mentor.company}`,
      meta: [mentor.experience, `₹${mentor.price} per session`],
      whyRelevant: mentor.desc,
      tagColor: 'secondary',
      actionLabel: 'View Profile',
    }));
    results = [...results, ...connectResults];
  }

  if (category === 'all' && q) {
    results = [...results, ...SITE_PAGES.filter(page =>
      [page.title, page.subtitle, page.badgeCategory, page.badgeSub, ...(page.searchTerms || [])]
        .filter(Boolean)
        .some(value => value!.toLowerCase().includes(q))
    )];
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
