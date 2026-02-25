export const boxShadow = {
  'card-center': '0px 0px 16px 0px rgba(23, 23, 23, 0.12), 0px 0px 1px 0px rgba(23, 23, 23, 0.08)',
  'card-up': '0px -4px 20px 0px rgba(23, 23, 23, 0.12), 0px 0px 1px 0px rgba(23, 23, 23, 0.08)',
  'card-down': '0px 4px 20px 0px rgba(23, 23, 23, 0.12), 0px 0px 1px 0px rgba(23, 23, 23, 0.08)',
  'card-center-enhanced': '0px 0px 24px 0px rgba(23, 23, 23, 0.24), 0px 0px 1px 0px rgba(23, 23, 23, 0.16)',
  'button-hover': '0px 4px 12px 0px rgba(23, 23, 23, 0.15)',
} as const

export type BoxShadow = typeof boxShadow
