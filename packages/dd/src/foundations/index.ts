export { cn } from './cn'
export { colors, type Colors } from './colors'
export { typography, type Typography } from './typography'
export { spacing, type Spacing } from './spacing'
export { boxShadow, type BoxShadow } from './boxShadow'

export const fontFamily = {
  sans: ['Pretendard', 'sans-serif'],
} as const

export const zIndex = {
  tooltip: 50,
  floating: 100,
  dim: 200,
  modal: 1000,
  toast: 9999,
} as const
