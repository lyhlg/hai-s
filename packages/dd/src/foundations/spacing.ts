const ROOT_FONT_SIZE = 16

function rem(px: number): string {
  return `${px / ROOT_FONT_SIZE}rem`
}

export const spacing = {
  0: rem(0),
  1: rem(1),
  2: rem(2),
  4: rem(4),
  6: rem(6),
  8: rem(8),
  10: rem(10),
  12: rem(12),
  16: rem(16),
  20: rem(20),
  24: rem(24),
  28: rem(28),
  32: rem(32),
  40: rem(40),
  48: rem(48),
  64: rem(64),
  80: rem(80),
  96: rem(96),
  112: rem(112),
  128: rem(128),
  160: rem(160),
  240: rem(240),
} as const

export type Spacing = typeof spacing
