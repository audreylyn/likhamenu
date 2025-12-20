import { ThemeConfig } from '../types';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    brand50: string;
    brand100: string;
    brand200: string;
    brand500: string;
    brand600: string;
    brand700: string;
    brand900: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'golden-warmth',
    name: 'Golden Warmth',
    description: 'Warm browns and creams for a cozy, artisan feel',
    colors: {
      brand50: '#fbf8f3',   // Warm Cream
      brand100: '#f5efe4',  // Lighter Warm Cream
      brand200: '#ebdcc4',  // Light Brown Border
      brand500: '#c58550',  // Golden Bronze
      brand600: '#b96b40',  // Terracotta
      brand700: '#9a5336',  // Darker Terracotta
      brand900: '#67392b',  // Deep Coffee
    },
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean navy and grey tones for a professional look',
    colors: {
      brand50: '#f5f7fa',   // Light Grey
      brand100: '#e8ecf1',  // Lighter Grey
      brand200: '#cbd5e1',  // Medium Grey Border
      brand500: '#64748b',  // Medium Grey
      brand600: '#1e293b',  // Dark Navy
      brand700: '#0f172a',  // Darker Navy
      brand900: '#0a0e1a',  // Almost Black
    },
  },
  {
    id: 'forest-fresh',
    name: 'Forest Fresh',
    description: 'Natural greens and blues for an organic, fresh vibe',
    colors: {
      brand50: '#f0f9ff',   // Very Light Blue-Grey
      brand100: '#e0f2fe',  // Light Blue-Grey
      brand200: '#bae6fd',  // Light Blue Border
      brand500: '#0ea5e9',  // Sky Blue
      brand600: '#1e3a5f',  // Dark Navy
      brand700: '#0f2540',  // Darker Navy
      brand900: '#14532d',  // Dark Forest Green
    },
  },
  {
    id: 'elegant-rose',
    name: 'Elegant Rose',
    description: 'Sophisticated rose and burgundy for a luxurious feel',
    colors: {
      brand50: '#fdf2f8',   // Light Pink
      brand100: '#fce7f3',  // Lighter Pink
      brand200: '#fbcfe8',  // Pink Border
      brand500: '#ec4899',  // Deep Magenta
      brand600: '#be185d',  // Dark Burgundy
      brand700: '#9f1239',  // Darker Burgundy
      brand900: '#831843',  // Deep Burgundy
    },
  },
  {
    id: 'classic-navy',
    name: 'Classic Navy',
    description: 'Timeless navy and blue tones for a classic, trustworthy look',
    colors: {
      brand50: '#f0f4ff',   // Very Light Blue/Lavender
      brand100: '#e0e7ff',  // Light Lavender
      brand200: '#c7d2fe',  // Lavender Border
      brand500: '#6366f1',  // Medium Blue
      brand600: '#1e3a8a',  // Dark Navy
      brand700: '#1e40af',  // Darker Navy
      brand900: '#1e293b',  // Deep Navy
    },
  },
  {
    id: 'pastel-bakery',
    name: 'Pastel Bakery',
    description: 'Soft pastels and warm cream for a playful bakery look',
    colors: {
      brand50: '#fff8f2',
      brand100: '#fff1e6',
      brand200: '#ffe3cc',
      brand500: '#ff9fb1',
      brand600: '#ff6f61',
      brand700: '#e85a4f',
      brand900: '#6b2b25',
    },
  },
  {
    id: 'sunset-citrus',
    name: 'Sunset Citrus',
    description: 'Bright oranges and mellow purples inspired by sunsets',
    colors: {
      brand50: '#fff7ed',
      brand100: '#fff1d6',
      brand200: '#ffd8a8',
      brand500: '#ff7a18',
      brand600: '#e85a1e',
      brand700: '#c1441b',
      brand900: '#3b1f16',
    },
  },
  {
    id: 'monochrome-slate',
    name: 'Monochrome Slate',
    description: 'Minimal grayscale palette for unobtrusive, refined designs',
    colors: {
      brand50: '#fafafa',
      brand100: '#f3f4f6',
      brand200: '#e5e7eb',
      brand500: '#9ca3af',
      brand600: '#6b7280',
      brand700: '#374151',
      brand900: '#0f172a',
    },
  },
  {
    id: 'tropical-breeze',
    name: 'Tropical Breeze',
    description: 'Teals, aquas and sunny accents for a fresh tropical feel',
    colors: {
      brand50: '#f0fffb',
      brand100: '#e6fffa',
      brand200: '#b8f0e6',
      brand500: '#22c1b3',
      brand600: '#0ea5a3',
      brand700: '#0b8f86',
      brand900: '#054d44',
    },
  },
  {
    id: 'retro-teal',
    name: 'Retro Teal',
    description: 'Vintage-inspired teal and mustard tones',
    colors: {
      brand50: '#fbfbf7',
      brand100: '#f6f3ea',
      brand200: '#efe6cf',
      brand500: '#2bb6a3',
      brand600: '#0f9d8a',
      brand700: '#0b7b66',
      brand900: '#173e3a',
    },
  },
  {
    id: 'vibrant-coral',
    name: 'Vibrant Coral',
    description: 'Energetic coral and navy contrasts for bold brands',
    colors: {
      brand50: '#fff7f6',
      brand100: '#fff0ef',
      brand200: '#ffd6d3',
      brand500: '#ff6b6b',
      brand600: '#ef4b4b',
      brand700: '#c43b3b',
      brand900: '#2b1f2a',
    },
  },
];

/**
 * Apply a theme preset to a theme configuration
 */
export function applyPresetToTheme(preset: ThemePreset): ThemeConfig {
  return {
    primary: preset.colors.brand600,
    secondary: preset.colors.brand50,
    button: preset.colors.brand600,
    accent: preset.colors.brand500,
    background: 'light',
    headingFont: 'Playfair Display',
    bodyFont: 'Lato',
    colors: {
      brand50: preset.colors.brand50,
      brand100: preset.colors.brand100,
      brand200: preset.colors.brand200,
      brand500: preset.colors.brand500,
      brand600: preset.colors.brand600,
      brand700: preset.colors.brand700,
      brand900: preset.colors.brand900,
    },
  };
}

