// Centralized values and enums for the app

export const DIMENSIONS = {
  DEFAULT_HOUSE: { width: 6.1, length: 7.62, height: 4.57, platformHeight: 1.22 },
  TRADITIONAL_MALAY: { width: 8.0, length: 10.0, height: 5.0, platformHeight: 1.5 },
};

export const COLORS = {
  light: {
    tint: '#ff821e', // Epic Homes Orange
    icon: '#ff821e',
    background: '#fff',
    cardBg: 'rgba(255,255,255,0.1)',
    cardSelected: 'rgba(255,130,30,0.1)', // Epic Homes Orange with opacity
    cardBorder: '#ff821e',
    white: '#ffffff',
    error: '#d32f2f',
    warning: '#ff9800',
    success: '#4caf50',
  },
  dark: {
    tint: '#ff821e', // Epic Homes Orange
    icon: '#ff821e',
    background: '#2c2c2c',
    cardBg: 'rgba(255,255,255,0.1)',
    cardSelected: 'rgba(255,130,30,0.1)', // Epic Homes Orange with opacity
    cardBorder: '#ff821e',
    white: '#ffffff',
    error: '#d32f2f',
    warning: '#ff9800',
    success: '#4caf50',
  },
  // Direct access properties for backward compatibility
  WHITE: '#ffffff',
  BACKGROUND: '#2c2c2c',
  PRIMARY: '#ff821e', // Epic Homes Orange
  SECONDARY: '#666666',
  CARD_BG: 'rgba(255,255,255,0.1)',
  CARD_BORDER: '#ff821e', // Epic Homes Orange
  ERROR: '#d32f2f',
  WARNING: '#ff9800',
  SUCCESS: '#4caf50',
};

export enum TimeEstimates {
  SITE_PREP = '2-3 hours',
  FOUNDATION = '1-2 days',
} 