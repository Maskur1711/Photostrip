export interface Character {
  id: string
  name: string
  species: string
  pose: string
  tagline: string
  image: string
  /** Accent color used for speech bubble / badge */
  accent: string
}

export const CHARACTERS: Character[] = [
  {
    id: 'bunny',
    name: 'Judy',
    species: 'Kelinci',
    pose: 'Peace sign + kedip',
    tagline: 'Angkat dua jari, mata berbinar!',
    image: '/characters/bunny.jpg',
    accent: '#b7c7e8',
  },
  {
    id: 'fox',
    name: 'Nick',
    species: 'Rubah',
    pose: 'Jempol santai + smirk',
    tagline: 'Cool-cool aja, jempol ke atas.',
    image: '/characters/fox.jpg',
    accent: '#f2b472',
  },
  {
    id: 'sloth',
    name: 'Flash',
    species: 'Sloth',
    pose: 'Love sign dua tangan',
    tagline: 'Pelan-pelan... bentuk hati!',
    image: '/characters/sloth.jpg',
    accent: '#d8b48a',
  },
  {
    id: 'tiger',
    name: 'Rio',
    species: 'Harimau',
    pose: 'Double finger guns',
    tagline: 'Tembakkan jempol ke kamera!',
    image: '/characters/tiger.jpg',
    accent: '#e8a87c',
  },
  {
    id: 'sheep',
    name: 'Bellwether',
    species: 'Domba',
    pose: 'Shy pose, tangan di pipi',
    tagline: 'Malu-malu, tangan di pipi.',
    image: '/characters/sheep.jpg',
    accent: '#d9c9e8',
  },
  {
    id: 'panda',
    name: 'Momo',
    species: 'Panda',
    pose: 'Kedua tangan V ke atas',
    tagline: 'Angkat tangan tinggi-tinggi!',
    image: '/characters/panda.jpg',
    accent: '#f0d77a',
  },
]

export type CharacterId = (typeof CHARACTERS)[number]['id']
