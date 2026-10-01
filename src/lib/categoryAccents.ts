/**
 * Centralized category accent configuration for Discovery Shortcuts.
 *
 * Each category has a distinct but cohesive cool accent.
 * Used by:
 *   - HomeScreen (Discovery Shortcut buttons)
 *   - CategoryFilterModal (popup header + selected states)
 *   - CategoryResultsPage (page badge, filter chips, active highlights)
 *
 * Color philosophy (from Master Instructions §17):
 *   - Cool, refined, educational palette
 *   - No orange, warm pink, red, gold, neon
 *   - Harmonious with brand dark navy (#070D18) and primary blue (#007DCC)
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
    // Deep sky blue — primary brand extended
    color: '#007DCC',
    colorHover: '#19A7E8',
    bgLight: 'rgba(0,125,204,0.08)',
    bgDark: 'rgba(0,125,204,0.15)',
    borderLight: 'rgba(0,125,204,0.20)',
    borderDark: 'rgba(0,125,204,0.30)',
    ring: '#007DCC',
    selectedText: '#007DCC',
    chipBgLight: 'rgba(0,125,204,0.10)',
    chipBgDark: 'rgba(0,125,204,0.20)',
    chipText: '#007DCC',
    chipTextDark: '#86cfff',
    ctaBg: '#007DCC',
    ctaHover: '#006cb0',
  },
  courses: {
    // Indigo / lavender — academic depth
    color: '#6C63FF',
    colorHover: '#8B85FF',
    bgLight: 'rgba(108,99,255,0.08)',
    bgDark: 'rgba(108,99,255,0.15)',
    borderLight: 'rgba(108,99,255,0.20)',
    borderDark: 'rgba(108,99,255,0.30)',
    ring: '#6C63FF',
    selectedText: '#6C63FF',
    chipBgLight: 'rgba(108,99,255,0.10)',
    chipBgDark: 'rgba(108,99,255,0.20)',
    chipText: '#6C63FF',
    chipTextDark: '#b8b4ff',
    ctaBg: '#6C63FF',
    ctaHover: '#5a52e0',
  },
  careers: {
    // Periwinkle / blue-violet — forward momentum
    color: '#4F6EF7',
    colorHover: '#7191FA',
    bgLight: 'rgba(79,110,247,0.08)',
    bgDark: 'rgba(79,110,247,0.15)',
    borderLight: 'rgba(79,110,247,0.20)',
    borderDark: 'rgba(79,110,247,0.30)',
    ring: '#4F6EF7',
    selectedText: '#4F6EF7',
    chipBgLight: 'rgba(79,110,247,0.10)',
    chipBgDark: 'rgba(79,110,247,0.20)',
    chipText: '#4F6EF7',
    chipTextDark: '#a0b5fc',
    ctaBg: '#4F6EF7',
    ctaHover: '#3d5be5',
  },
  classes: {
    // Mint / teal-green — learning, growth
    color: '#0EB89C',
    colorHover: '#19B89A',
    bgLight: 'rgba(14,184,156,0.08)',
    bgDark: 'rgba(14,184,156,0.15)',
    borderLight: 'rgba(14,184,156,0.20)',
    borderDark: 'rgba(14,184,156,0.30)',
    ring: '#0EB89C',
    selectedText: '#0EB89C',
    chipBgLight: 'rgba(14,184,156,0.10)',
    chipBgDark: 'rgba(14,184,156,0.20)',
    chipText: '#0EB89C',
    chipTextDark: '#51dcbc',
    ctaBg: '#0EB89C',
    ctaHover: '#0aa088',
  },
  cutoffs: {
    // Teal / cyan-blue — data, precision
    color: '#0B9EC4',
    colorHover: '#10B8E2',
    bgLight: 'rgba(11,158,196,0.08)',
    bgDark: 'rgba(11,158,196,0.15)',
    borderLight: 'rgba(11,158,196,0.20)',
    borderDark: 'rgba(11,158,196,0.30)',
    ring: '#0B9EC4',
    selectedText: '#0B9EC4',
    chipBgLight: 'rgba(11,158,196,0.10)',
    chipBgDark: 'rgba(11,158,196,0.20)',
    chipText: '#0B9EC4',
    chipTextDark: '#62d6f5',
    ctaBg: '#0B9EC4',
    ctaHover: '#0888aa',
  },
  guidance: {
    // Soft violet — thoughtful decision support
    color: '#7C5CFC',
    colorHover: '#9B7FFE',
    bgLight: 'rgba(124,92,252,0.08)',
    bgDark: 'rgba(124,92,252,0.15)',
    borderLight: 'rgba(124,92,252,0.20)',
    borderDark: 'rgba(124,92,252,0.30)',
    ring: '#7C5CFC',
    selectedText: '#7C5CFC',
    chipBgLight: 'rgba(124,92,252,0.10)',
    chipBgDark: 'rgba(124,92,252,0.20)',
    chipText: '#7C5CFC',
    chipTextDark: '#c4b0ff',
    ctaBg: '#7C5CFC',
    ctaHover: '#6a4ae8',
  },
};

/** Falls back to colleges accent for unknown categories */
export const getCategoryAccent = (category: string): CategoryAccent => {
  return CATEGORY_ACCENTS[category as DiscoveryCategory] ?? CATEGORY_ACCENTS.colleges;
};
