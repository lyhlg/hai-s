export const colors = {
  white: '#FFFFFF',
  black: '#0C0C0C',

  gray: {
    25: '#FCFCFC',
    50: '#F9F9F9',
    100: '#F3F3F3',
    200: '#E8E8E8',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#2A2A2A',
    900: '#1F1F1F',
  },

  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  secondary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  success: {
    50: '#E7F9EB',
    100: '#D1FAE5',
    500: '#10BA68',
    600: '#059669',
  },
  error: {
    50: '#FEF3F2',
    100: '#FEE2E2',
    500: '#EB3636',
    600: '#DC2626',
  },
  warning: {
    50: '#FFFAEB',
    100: '#FEF3C7',
    500: '#F79C00',
    600: '#D97706',
  },
  info: {
    50: '#F3F8FF',
    100: '#DBEAFE',
    500: '#5192FF',
    600: '#2563EB',
  },
} as const

export type Colors = typeof colors
