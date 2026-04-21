export type FilterId =
  | 'none'
  | 'bw'
  | 'sepia'
  | 'vintage'
  | 'cool'
  | 'warm'
  | 'dreamy'
  | 'noir'

export interface FilterOption {
  id: FilterId
  label: string
  /** CSS filter string applied to the live preview */
  css: string
}

export const FILTERS: FilterOption[] = [
  { id: 'none', label: 'Original', css: 'none' },
  {
    id: 'bw',
    label: 'B&W',
    css: 'grayscale(1) contrast(1.05)',
  },
  {
    id: 'sepia',
    label: 'Sepia',
    css: 'sepia(0.7) contrast(1.05) saturate(1.1)',
  },
  {
    id: 'vintage',
    label: 'Vintage',
    css: 'sepia(0.35) contrast(1.1) saturate(1.2) hue-rotate(-10deg)',
  },
  {
    id: 'cool',
    label: 'Cool',
    css: 'saturate(1.1) hue-rotate(180deg) brightness(1.02)',
  },
  {
    id: 'warm',
    label: 'Warm',
    css: 'saturate(1.2) hue-rotate(-15deg) brightness(1.05)',
  },
  {
    id: 'dreamy',
    label: 'Dreamy',
    css: 'contrast(0.95) saturate(1.15) brightness(1.08) blur(0.3px)',
  },
  {
    id: 'noir',
    label: 'Noir',
    css: 'grayscale(1) contrast(1.3) brightness(0.9)',
  },
]

export const FRAME_COLORS: {
  id: string
  label: string
  bg: string
  fg: string
}[] = [
  { id: 'cream', label: 'Cream', bg: '#f7efe4', fg: '#2a1d18' },
  { id: 'rose', label: 'Rose', bg: '#d94c6a', fg: '#fff5ef' },
  { id: 'noir', label: 'Noir', bg: '#1a1414', fg: '#f7efe4' },
  { id: 'mint', label: 'Mint', bg: '#cfe8d8', fg: '#1f3a2c' },
  { id: 'sand', label: 'Sand', bg: '#e8d5b7', fg: '#3b2a1a' },
  { id: 'sky', label: 'Sky', bg: '#bcd3e8', fg: '#1d2a3b' },
]
