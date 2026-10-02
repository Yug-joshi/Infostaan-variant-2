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
    // Royal Blue
    color: '#2563EB',
    colorHover: '#3B82F6',
    bgLight: 'rgba(37,99,235,0.08)',
    bgDark: 'rgba(37,99,235,0.15)',
    borderLight: 'rgba(37,99,235,0.20)',
    borderDark: 'rgba(37,99,235,0.30)',
    ring: '#2563EB',
    selectedText: '#2563EB',
    chipBgLight: 'rgba(37,99,235,0.10)',
    chipBgDark: 'rgba(37,99,235,0.20)',
    chipText: '#2563EB',
    chipTextDark: '#93C5FD',
    ctaBg: '#2563EB',
    ctaHover: '#1D4ED8',
  },

  courses: {
    // Amber / Yellow
    color: '#F59E0B',
    colorHover: '#FBBF24',
    bgLight: 'rgba(245,158,11,0.08)',
    bgDark: 'rgba(245,158,11,0.15)',
    borderLight: 'rgba(245,158,11,0.20)',
    borderDark: 'rgba(245,158,11,0.30)',
    ring: '#F59E0B',
    selectedText: '#D97706',
    chipBgLight: 'rgba(245,158,11,0.10)',
    chipBgDark: 'rgba(245,158,11,0.20)',
    chipText: '#D97706',
    chipTextDark: '#FCD34D',
    ctaBg: '#F59E0B',
    ctaHover: '#D97706',
  },

  careers: {
    // Red
    color: '#EF4444',
    colorHover: '#F87171',
    bgLight: 'rgba(239,68,68,0.08)',
    bgDark: 'rgba(239,68,68,0.15)',
    borderLight: 'rgba(239,68,68,0.20)',
    borderDark: 'rgba(239,68,68,0.30)',
    ring: '#EF4444',
    selectedText: '#DC2626',
    chipBgLight: 'rgba(239,68,68,0.10)',
    chipBgDark: 'rgba(239,68,68,0.20)',
    chipText: '#DC2626',
    chipTextDark: '#FCA5A5',
    ctaBg: '#EF4444',
    ctaHover: '#DC2626',
  },

  classes: {
    // Emerald Green
    color: '#10B981',
    colorHover: '#34D399',
    bgLight: 'rgba(16,185,129,0.08)',
    bgDark: 'rgba(16,185,129,0.15)',
    borderLight: 'rgba(16,185,129,0.20)',
    borderDark: 'rgba(16,185,129,0.30)',
    ring: '#10B981',
    selectedText: '#059669',
    chipBgLight: 'rgba(16,185,129,0.10)',
    chipBgDark: 'rgba(16,185,129,0.20)',
    chipText: '#059669',
    chipTextDark: '#6EE7B7',
    ctaBg: '#10B981',
    ctaHover: '#059669',
  },

  cutoffs: {
    // Purple
    color: '#8B5CF6',
    colorHover: '#A78BFA',
    bgLight: 'rgba(139,92,246,0.08)',
    bgDark: 'rgba(139,92,246,0.15)',
    borderLight: 'rgba(139,92,246,0.20)',
    borderDark: 'rgba(139,92,246,0.30)',
    ring: '#8B5CF6',
    selectedText: '#7C3AED',
    chipBgLight: 'rgba(139,92,246,0.10)',
    chipBgDark: 'rgba(139,92,246,0.20)',
    chipText: '#7C3AED',
    chipTextDark: '#C4B5FD',
    ctaBg: '#8B5CF6',
    ctaHover: '#7C3AED',
  },

  guidance: {
    // Magenta
    color: '#D946EF',
    colorHover: '#E879F9',
    bgLight: 'rgba(217,70,239,0.08)',
    bgDark: 'rgba(217,70,239,0.15)',
    borderLight: 'rgba(217,70,239,0.20)',
    borderDark: 'rgba(217,70,239,0.30)',
    ring: '#D946EF',
    selectedText: '#C026D3',
    chipBgLight: 'rgba(217,70,239,0.10)',
    chipBgDark: 'rgba(217,70,239,0.20)',
    chipText: '#C026D3',
    chipTextDark: '#F0ABFC',
    ctaBg: '#D946EF',
    ctaHover: '#C026D3',
  },
};

/** Falls back to colleges accent for unknown categories */
export const getCategoryAccent = (category: string): CategoryAccent => {
  return (
    CATEGORY_ACCENTS[category as DiscoveryCategory] ??
    CATEGORY_ACCENTS.colleges
  );
};