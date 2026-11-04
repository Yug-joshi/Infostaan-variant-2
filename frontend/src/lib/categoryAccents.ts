/**
 * Centralized category accent configuration for Discovery Shortcuts.
 *
 * Each category uses a clearly distinct color family.
 *
 * Used by:
 *   - HomeScreen (Discovery Shortcut buttons)
 *   - CategoryFilterModal (popup header + selected states)
 *   - CategoryResultsPage (page badge, filter chips, active highlights)
 *
 * Color palette:
 *   - Colleges: Royal Blue
 *   - Courses: Amber
 *   - Careers: Red
 *   - Classes: Emerald
 *   - Cutoffs: Purple
 *   - Guidance: Magenta
 */

export type DiscoveryCategory =
  | 'colleges'
  | 'courses'
  | 'careers'
  | 'classes'
  | 'cutoffs'
  | 'guidance';

export interface CategoryAccent {
  /** Main accent hex */
  color: string;
  /** Slightly brighter variant for hover / emphasis */
  colorHover: string;
  /** Light background tint (CSS rgba) */
  bgLight: string;
  /** Dark-mode tint */
  bgDark: string;
  /** Border tint */
  borderLight: string;
  borderDark: string;
  /** Ring / focus color for selected states */
  ring: string;
  /** Selected text color in modal */
  selectedText: string;
  /** Chip / badge tint */
  chipBgLight: string;
  chipBgDark: string;
  chipText: string;
  chipTextDark: string;
  /** Primary CTA button bg */
  ctaBg: string;
  ctaHover: string;
}

export const CATEGORY_ACCENTS: Record<DiscoveryCategory, CategoryAccent> = {
  colleges: {
    // Soft Royal Blue
    color: '#2563EB',
    colorHover: '#1D4ED8',
    bgLight: '#E0EBFF',
    bgDark: 'rgba(37,99,235,0.15)',
    borderLight: '#B8D0FF',
    borderDark: 'rgba(37,99,235,0.30)',
    ring: '#2563EB',
    selectedText: '#1D4ED8',
    chipBgLight: '#E0EBFF',
    chipBgDark: 'rgba(37,99,235,0.20)',
    chipText: '#1D4ED8',
    chipTextDark: '#93C5FD',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },

  courses: {
    // Soft Warm Orange
    color: '#F59E0B',
    colorHover: '#B45309',
    bgLight: '#FFF4E5',
    bgDark: 'rgba(245,158,11,0.15)',
    borderLight: '#F3D9B4',
    borderDark: 'rgba(245,158,11,0.30)',
    ring: '#F59E0B',
    selectedText: '#B45309',
    chipBgLight: '#FFF4E5',
    chipBgDark: 'rgba(245,158,11,0.20)',
    chipText: '#B45309',
    chipTextDark: '#FCD34D',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },

  careers: {
    // Soft Coral Red
    color: '#EF4444',
    colorHover: '#DC2626',
    bgLight: '#FCEBEC',
    bgDark: 'rgba(239,68,68,0.15)',
    borderLight: '#F5C6C8',
    borderDark: 'rgba(239,68,68,0.30)',
    ring: '#EF4444',
    selectedText: '#DC2626',
    chipBgLight: '#FCEBEC',
    chipBgDark: 'rgba(239,68,68,0.20)',
    chipText: '#B91C1C',
    chipTextDark: '#FCA5A5',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },

  classes: {
    // Soft Mint / Teal Green
    color: '#10B981',
    colorHover: '#047857',
    bgLight: '#DFF5F1',
    bgDark: 'rgba(16,185,129,0.15)',
    borderLight: '#AFE5D9',
    borderDark: 'rgba(16,185,129,0.30)',
    ring: '#10B981',
    selectedText: '#047857',
    chipBgLight: '#DFF5F1',
    chipBgDark: 'rgba(16,185,129,0.20)',
    chipText: '#047857',
    chipTextDark: '#6EE7B7',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },

  cutoffs: {
    // Soft Violet
    color: '#8B5CF6',
    colorHover: '#7C3AED',
    bgLight: '#F1EBFF',
    bgDark: 'rgba(139,92,246,0.15)',
    borderLight: '#DCCDFB',
    borderDark: 'rgba(139,92,246,0.30)',
    ring: '#8B5CF6',
    selectedText: '#7C3AED',
    chipBgLight: '#F1EBFF',
    chipBgDark: 'rgba(139,92,246,0.20)',
    chipText: '#6D28D9',
    chipTextDark: '#C4B5FD',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },

  guidance: {
    // Soft Periwinkle / Indigo
    color: '#4F46E5',
    colorHover: '#4338CA',
    bgLight: '#EEF2FF',
    bgDark: 'rgba(79,70,229,0.15)',
    borderLight: '#E0E7FF',
    borderDark: 'rgba(79,70,229,0.30)',
    ring: '#4F46E5',
    selectedText: '#4338CA',
    chipBgLight: '#EEF2FF',
    chipBgDark: 'rgba(79,70,229,0.20)',
    chipText: '#3730A3',
    chipTextDark: '#C7D2FE',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },
};

/** Falls back to colleges accent for unknown categories */
export const getCategoryAccent = (category: string): CategoryAccent => {
  return (
    CATEGORY_ACCENTS[category as DiscoveryCategory] ??
    CATEGORY_ACCENTS.colleges
  );
};