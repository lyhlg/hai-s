import designSystemPreset from '@hai-s/design-system/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [designSystemPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/design-system/dist/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
