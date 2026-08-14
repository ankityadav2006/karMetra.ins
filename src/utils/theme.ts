export type AppTheme = 'teal' | 'indigo' | 'emerald' | 'violet' | 'amber' | 'dark';

export interface ThemeOption {
  id: AppTheme;
  name: string;
  colorHex: string;
  badge: string;
  description: string;
  primaryClass: string;
  bgLightClass: string;
  borderClass: string;
  textClass: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'teal',
    name: 'Teal Ocean',
    colorHex: '#0d9488',
    badge: 'Classic',
    description: 'Clean professional marketplace theme with teal & slate accents',
    primaryClass: 'bg-teal-600 text-white hover:bg-teal-700',
    bgLightClass: 'bg-teal-50 text-teal-800 border-teal-200',
    borderClass: 'border-teal-500',
    textClass: 'text-teal-700',
  },
  {
    id: 'indigo',
    name: 'Electric Indigo',
    colorHex: '#4f46e5',
    badge: 'Modern Tech',
    description: 'Sleek corporate tech theme with electric indigo and royal blue',
    primaryClass: 'bg-indigo-600 text-white hover:bg-indigo-700',
    bgLightClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    borderClass: 'border-indigo-500',
    textClass: 'text-indigo-700',
  },
  {
    id: 'emerald',
    name: 'Emerald Growth',
    colorHex: '#059669',
    badge: 'Fresh',
    description: 'Vibrant green theme symbolizing career growth and trust',
    primaryClass: 'bg-emerald-600 text-white hover:bg-emerald-700',
    bgLightClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-700',
  },
  {
    id: 'violet',
    name: 'Royal Violet',
    colorHex: '#7c3aed',
    badge: 'Premium',
    description: 'Elegant purple & violet luxury styling for executive hiring',
    primaryClass: 'bg-violet-600 text-white hover:bg-violet-700',
    bgLightClass: 'bg-violet-50 text-violet-800 border-violet-200',
    borderClass: 'border-violet-500',
    textClass: 'text-violet-700',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    colorHex: '#d97706',
    badge: 'Vibrant',
    description: 'Warm, high-energy amber and gold theme for fast hiring',
    primaryClass: 'bg-amber-600 text-white hover:bg-amber-700',
    bgLightClass: 'bg-amber-50 text-amber-900 border-amber-200',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-700',
  },
  {
    id: 'dark',
    name: 'Midnight Dark',
    colorHex: '#0f172a',
    badge: 'Eye-Safe',
    description: 'High-contrast dark mode for low-light browsing comfort',
    primaryClass: 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700',
    bgLightClass: 'bg-slate-800 text-slate-200 border-slate-700',
    borderClass: 'border-teal-400',
    textClass: 'text-teal-400',
  },
];

const THEME_STORAGE_KEY = 'karmetra_active_theme';

export function getStoredTheme(): AppTheme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && THEMES.some(t => t.id === saved)) {
      return saved as AppTheme;
    }
  } catch (err) {
    console.warn('Failed to read theme from storage', err);
  }
  return 'teal';
}

export function setStoredTheme(theme: AppTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyThemeToDOM(theme);
  } catch (err) {
    console.warn('Failed to save theme', err);
  }
}

export function applyThemeToDOM(theme: AppTheme): void {
  const root = document.documentElement;
  // Remove existing theme classes
  THEMES.forEach(t => root.classList.remove(`theme-${t.id}`));
  root.classList.add(`theme-${theme}`);

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
