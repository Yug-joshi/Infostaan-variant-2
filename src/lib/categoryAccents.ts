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
    // Soft Sky Blue
    color: '#0284C7',
    colorHover: '#0369A1',
    bgLight: '#E0F2FE',
    bgDark: 'rgba(14,165,233,0.15)',
    borderLight: '#BAE6FD',
    borderDark: 'rgba(14,165,233,0.30)',
    ring: '#0284C7',
    selectedText: '#0369A1',
    chipBgLight: '#E0F2FE',
    chipBgDark: 'rgba(14,165,233,0.20)',
    chipText: '#0369A1',
    chipTextDark: '#7DD3FC',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },

  courses: {
    // Soft Warm Amber
    color: '#D97706',
    colorHover: '#B45309',
    bgLight: '#FEF3C7',
    bgDark: 'rgba(245,158,11,0.15)',
    borderLight: '#FDE68A',
    borderDark: 'rgba(245,158,11,0.30)',
    ring: '#D97706',
    selectedText: '#B45309',
    chipBgLight: '#FEF3C7',
    chipBgDark: 'rgba(245,158,11,0.20)',
    chipText: '#92400E',
    chipTextDark: '#FDE68A',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },

  careers: {
    // Soft Lavender / Purple
    color: '#7C3AED',
    colorHover: '#6D28D9',
    bgLight: '#F3E8FF',
    bgDark: 'rgba(124,58,237,0.15)',
    borderLight: '#E9D5FF',
    borderDark: 'rgba(124,58,237,0.30)',
    ring: '#7C3AED',
    selectedText: '#6D28D9',
    chipBgLight: '#F3E8FF',
    chipBgDark: 'rgba(124,58,237,0.20)',
    chipText: '#6B21A8',
    chipTextDark: '#D8B4FE',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },

  classes: {
    // Soft Mint / Emerald Green
    color: '#059669',
    colorHover: '#047857',
    bgLight: '#DCFCE7',
    bgDark: 'rgba(16,185,129,0.15)',
    borderLight: '#BBF7D0',
    borderDark: 'rgba(16,185,129,0.30)',
    ring: '#059669',
    selectedText: '#047857',
    chipBgLight: '#DCFCE7',
    chipBgDark: 'rgba(16,185,129,0.20)',
    chipText: '#065F46',
    chipTextDark: '#86EFAC',
    ctaBg: '#0F172A',
    ctaHover: '#1E293B',
  },

  cutoffs: {
    // Soft Rose / Pink
    color: '#E11D48',
    colorHover: '#BE123C',
    bgLight: '#FFE4E6',
    bgDark: 'rgba(225,29,72,0.15)',
    borderLight: '#FECDD3',
    borderDark: 'rgba(225,29,72,0.30)',
    ring: '#E11D48',
    selectedText: '#BE123C',
    chipBgLight: '#FFE4E6',
    chipBgDark: 'rgba(225,29,72,0.20)',
    chipText: '#9F1239',
    chipTextDark: '#FDA4AF',
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