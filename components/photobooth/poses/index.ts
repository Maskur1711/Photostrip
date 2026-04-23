import * as S from './scenes'
import type { ReactElement } from 'react'

export type PoseType = 'solo' | 'couple'
export type PoseMode = 'solo' | 'couple' | 'mix'

export interface Pose {
  id: string
  title: string
  description: string
  type: PoseType
  accent: string
  Scene: (props: { className?: string; showBackdrop?: boolean; backdropColor?: string }) => ReactElement
}

export const POSES: Pose[] = [
  // ---------- SOLO (10) ----------
  {
    id: 'bunny-peace-wink',
    title: 'Peace & Wink',
    description: 'Dua jari ke atas sambil kedipkan satu mata — cute overload!',
    type: 'solo',
    accent: '#FEF0EC',
    Scene: S.BunnyPeaceWink,
  },
  {
    id: 'fox-heart-hands',
    title: 'Heart Hands',
    description: 'Kedua tangan di atas kepala bentuk hati mini.',
    type: 'solo',
    accent: '#FFE8D4',
    Scene: S.FoxHeartHands,
  },
  {
    id: 'tiger-finger-guns',
    title: 'Finger Guns',
    description: 'Dua tangan bentuk pistol jari — siap pose ala tiger!',
    type: 'solo',
    accent: '#FEEDD4',
    Scene: S.TigerFingerGuns,
  },
  {
    id: 'panda-cheer',
    title: 'V for Victory',
    description: 'Kedua tangan melambai ke atas bentuk V.',
    type: 'solo',
    accent: '#EFE9E0',
    Scene: S.PandaCheer,
  },
  {
    id: 'sloth-chill-peace',
    title: 'Chill Peace',
    description: 'Santai miringkan kepala, satu tangan peace — slow mode.',
    type: 'solo',
    accent: '#EEE4D3',
    Scene: S.SlothChillPeace,
  },
  {
    id: 'sheep-shy-blush',
    title: 'Shy Blush',
    description: 'Kedua tangan menempel pipi, mata berkaca — malu-malu!',
    type: 'solo',
    accent: '#FDEEE8',
    Scene: S.SheepShyBlush,
  },
  {
    id: 'wolf-howl',
    title: 'Howl to the Moon',
    description: 'Dongak ke atas, mulut membentuk O — auuuu!',
    type: 'solo',
    accent: '#E8EBEF',
    Scene: S.WolfHowl,
  },
  {
    id: 'cheetah-running',
    title: 'Speed Run',
    description: 'Pose condong ke depan seperti sedang berlari kencang.',
    type: 'solo',
    accent: '#FCEED4',
    Scene: S.CheetahRunning,
  },
  {
    id: 'lion-roar',
    title: 'Mighty Roar',
    description: 'Kedua tangan bentuk cakar, mulut terbuka lebar!',
    type: 'solo',
    accent: '#FBE5C5',
    Scene: S.LionRoar,
  },
  {
    id: 'elephant-blow-kiss',
    title: 'Blow a Kiss',
    description: 'Tangan dekat bibir, lempar ciuman ke kamera.',
    type: 'solo',
    accent: '#E8ECF0',
    Scene: S.ElephantBlowKiss,
  },

  // ---------- COUPLE (10) ----------
  {
    id: 'couple-heart-together',
    title: 'Heart Together',
    description: 'Berdua bentuk satu hati besar dengan tangan bagian dalam.',
    type: 'couple',
    accent: '#FFE8E8',
    Scene: S.CoupleHeartTogether,
  },
  {
    id: 'couple-high-five',
    title: 'Epic High Five',
    description: 'Toss tangan di udara, senyum lebar!',
    type: 'couple',
    accent: '#FEEDD4',
    Scene: S.CoupleHighFive,
  },
  {
    id: 'couple-side-hug',
    title: 'Side Hug',
    description: 'Rangkul pundak satu sama lain, miringkan kepala.',
    type: 'couple',
    accent: '#EEE8F0',
    Scene: S.CoupleSideHug,
  },
  {
    id: 'couple-hold-hands',
    title: 'Hold My Hand',
    description: 'Gandengan tangan, tatap kamera dengan senyum manis.',
    type: 'couple',
    accent: '#F4EBDA',
    Scene: S.CoupleHoldHands,
  },
  {
    id: 'couple-royal',
    title: 'Royal Duo',
    description: 'Pose regal — satu tangan di pinggang, satu melambai.',
    type: 'couple',
    accent: '#FAE8C8',
    Scene: S.CoupleRoyal,
  },
  {
    id: 'couple-jump',
    title: 'Jump Together',
    description: 'Lompat bareng, dua tangan naik ke atas!',
    type: 'couple',
    accent: '#E7F3EA',
    Scene: S.CoupleJump,
  },
  {
    id: 'couple-cool-shades',
    title: 'Too Cool',
    description: 'Pose kece dengan tangan bersilang di dada — vibe kacamata.',
    type: 'couple',
    accent: '#E3E8EC',
    Scene: S.CoupleCoolShades,
  },
  {
    id: 'couple-racing',
    title: 'Race Ya!',
    description: 'Badan condong ke depan, tangan mengayun ala pelari.',
    type: 'couple',
    accent: '#FFE6C8',
    Scene: S.CoupleRacing,
  },
  {
    id: 'couple-heart-frame',
    title: 'Heart Frame',
    description: 'Tangan melengkung di atas kepala bertemu membentuk hati.',
    type: 'couple',
    accent: '#FEE8E4',
    Scene: S.CoupleHeartFrame,
  },
  {
    id: 'couple-cheek-squish',
    title: 'Cheek Squish',
    description: 'Tempelkan pipi berdua, mata tertutup senyum menggemaskan.',
    type: 'couple',
    accent: '#E8ECF0',
    Scene: S.CoupleCheekSquish,
  },
]

/** Fisher-Yates shuffle. */
export function shufflePoses<T>(list: T[]): T[] {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Build a looping sequence of exactly `count` poses, drawing from a
 * shuffled deck so consecutive poses are always distinct.
 * @param mode 'solo' | 'couple' | 'mix' — filter pool pose
 */
export function buildPoseSequence(
  count: number,
  mode: PoseMode = 'mix',
  randomize = true,
): Pose[] {
  const pool =
    mode === 'mix' ? POSES : POSES.filter((p) => p.type === mode)
  const shuffled = randomize ? shufflePoses(pool) : [...pool]
  const seq: Pose[] = []
  let deck = shuffled
  let idx = 0
  while (seq.length < count) {
    if (idx >= deck.length) {
      // reshuffle to keep it feeling fresh when count > pool.length
      deck = (randomize ? shufflePoses(pool) : [...pool]).filter(
        (p) => p.id !== seq[seq.length - 1]?.id,
      )
      idx = 0
    }
    seq.push(deck[idx])
    idx += 1
  }
  return seq
}
