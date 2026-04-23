export interface FrameStyleOption {
  id: string
  label: string
  bg: string
  fg: string
  kind: 'classic' | 'polaroid' | 'vintage' | 'modern' | 'love'
}

export interface StripTemplateOption {
  id: string
  label: string
}

export interface StickerThemeOption {
  id: string
  label: string
  emojis: string[]
  frameBg?: string
}

export const FRAME_STYLES: FrameStyleOption[] = [
  {
    id: 'classic-cream',
    label: 'Classic',
    bg: '#f7efe4',
    fg: '#2a1d18',
    kind: 'classic',
  },
  {
    id: 'polaroid',
    label: 'Polaroid',
    bg: '#fefefe',
    fg: '#232323',
    kind: 'polaroid',
  },
  {
    id: 'vintage',
    label: 'Vintage',
    bg: '#ead4b0',
    fg: '#4c3525',
    kind: 'vintage',
  },
  {
    id: 'modern',
    label: 'Modern',
    bg: '#ccd8f5',
    fg: '#1f2a44',
    kind: 'modern',
  },
  {
    id: 'love',
    label: 'Love',
    bg: '#b00011',
    fg: '#fff1f2',
    kind: 'love',
  },
]

export const STRIP_TEMPLATES: StripTemplateOption[] = [
  { id: 'classic-strip', label: 'Classic Strip' },
  { id: 'grid-2x2', label: '2x2' },
  { id: 'grid-3x3', label: '3x3' },
  { id: 'grid-4x4', label: '4x4' },
]

export const STICKER_THEMES: StickerThemeOption[] = [
  { id: 'none', label: 'Tanpa Stiker', emojis: [] },
  {
    id: 'kawaii',
    label: 'Kawaii',
    emojis: ['🎀', '✨', '🐱', '🌸'],
    frameBg: '#d9e9ff',
  },
  {
    id: 'love',
    label: 'Love',
    emojis: ['💗', '💘', '💕', '💞'],
    frameBg: '#ffe7ef',
  },
  {
    id: 'star',
    label: 'Star',
    emojis: ['⭐', '🌟', '💫', '✨'],
    frameBg: '#f2ecff',
  },
  {
    id: 'retro',
    label: 'Retro',
    emojis: ['📼', '📸', '🧃', '🎞️'],
    frameBg: '#efe3d4',
  },
]
