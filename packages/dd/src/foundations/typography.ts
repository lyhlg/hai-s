export const typography = {
  'display-h1-bold': ['72px', { lineHeight: '92px', letterSpacing: '-0.005em', fontWeight: '700' }],
  'display-h2-bold': ['60px', { lineHeight: '76px', letterSpacing: '-0.005em', fontWeight: '700' }],
  'display-h3-bold': ['48px', { lineHeight: '60px', letterSpacing: '-0.005em', fontWeight: '700' }],
  'display-h4-bold': ['36px', { lineHeight: '48px', letterSpacing: '-0.005em', fontWeight: '700' }],
  'display-h5-bold': ['32px', { lineHeight: '44px', letterSpacing: '-0.005em', fontWeight: '700' }],
  'display-h6-bold': ['28px', { lineHeight: '40px', letterSpacing: '-0.005em', fontWeight: '700' }],
  'display-h7-bold': ['24px', { lineHeight: '36px', letterSpacing: '-0.005em', fontWeight: '700' }],

  'subtitle-l-semibold': ['22px', { lineHeight: '32px', letterSpacing: '-0.005em', fontWeight: '600' }],
  'subtitle-l-medium': ['22px', { lineHeight: '32px', letterSpacing: '-0.005em', fontWeight: '500' }],
  'subtitle-m-semibold': ['20px', { lineHeight: '30px', letterSpacing: '-0.005em', fontWeight: '600' }],
  'subtitle-m-medium': ['20px', { lineHeight: '30px', letterSpacing: '-0.005em', fontWeight: '500' }],
  'subtitle-s-semibold': ['18px', { lineHeight: '28px', letterSpacing: '-0.005em', fontWeight: '600' }],
  'subtitle-s-medium': ['18px', { lineHeight: '28px', letterSpacing: '-0.005em', fontWeight: '500' }],

  'paragraph-l-semibold': ['16px', { lineHeight: '24px', letterSpacing: '-0.005em', fontWeight: '600' }],
  'paragraph-l-medium': ['16px', { lineHeight: '24px', letterSpacing: '-0.005em', fontWeight: '500' }],
  'paragraph-l-regular': ['16px', { lineHeight: '24px', letterSpacing: '-0.005em', fontWeight: '400' }],
  'paragraph-m-semibold': ['15px', { lineHeight: '22px', letterSpacing: '-0.005em', fontWeight: '600' }],
  'paragraph-m-medium': ['15px', { lineHeight: '22px', letterSpacing: '-0.005em', fontWeight: '500' }],
  'paragraph-m-regular': ['15px', { lineHeight: '22px', letterSpacing: '-0.005em', fontWeight: '400' }],
  'paragraph-s-semibold': ['14px', { lineHeight: '20px', letterSpacing: '-0.005em', fontWeight: '600' }],
  'paragraph-s-medium': ['14px', { lineHeight: '20px', letterSpacing: '-0.005em', fontWeight: '500' }],
  'paragraph-s-regular': ['14px', { lineHeight: '20px', letterSpacing: '-0.005em', fontWeight: '400' }],
  'paragraph-xs-medium': ['13px', { lineHeight: '18px', letterSpacing: '-0.005em', fontWeight: '500' }],
  'paragraph-xs-regular': ['13px', { lineHeight: '18px', letterSpacing: '-0.005em', fontWeight: '400' }],

  'caption-medium': ['12px', { lineHeight: '16px', letterSpacing: '-0.005em', fontWeight: '500' }],
  'caption-regular': ['12px', { lineHeight: '16px', letterSpacing: '-0.005em', fontWeight: '400' }],
  'footnote-medium': ['10px', { lineHeight: '14px', letterSpacing: '-0.005em', fontWeight: '500' }],
  'footnote-regular': ['10px', { lineHeight: '14px', letterSpacing: '-0.005em', fontWeight: '400' }],
} as const

export type Typography = typeof typography
