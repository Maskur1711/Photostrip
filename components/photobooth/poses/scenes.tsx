/**
 * 20 Zootopia-inspired pose scenes as inline SVGs.
 * Mix of solo (10) and couple (10).
 * Each scene is a React component that accepts a className prop.
 */

import {
  Bunny,
  Cheetah,
  Elephant,
  Fox,
  Heart,
  Lion,
  MotionLines,
  Panda,
  Sheep,
  Sloth,
  Sparkle,
  Star,
  Tiger,
  Wolf,
  STROKE,
} from './animals'

interface SceneProps {
  className?: string
  /** When true, adds a gentle background shape behind the scene. */
  showBackdrop?: boolean
  backdropColor?: string
}

const VB = '0 0 240 200'

function Backdrop({ color }: { color: string }) {
  return (
    <rect x={0} y={0} width={240} height={200} fill={color} rx={18} />
  )
}

/* ---------- reusable body helpers ---------- */

/** A simple rounded torso under a head — used by most poses. */
function Body({
  cx,
  top = 95,
  w = 46,
  h = 70,
  color,
  strokeColor = STROKE,
}: {
  cx: number
  top?: number
  w?: number
  h?: number
  color: string
  strokeColor?: string
}) {
  return (
    <rect
      x={cx - w / 2}
      y={top}
      width={w}
      height={h}
      rx={w / 2}
      fill={color}
      stroke={strokeColor}
      strokeWidth={1.3}
    />
  )
}

function Hand({
  cx,
  cy,
  color,
  r = 6,
}: {
  cx: number
  cy: number
  color: string
  r?: number
}) {
  return (
    <circle cx={cx} cy={cy} r={r} fill={color} stroke={STROKE} strokeWidth={1.2} />
  )
}

function Arm({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 10,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  width?: number
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  )
}

/** A finger-gun hand (tiny). */
function FingerGun({
  cx,
  cy,
  color,
  flip = false,
}: {
  cx: number
  cy: number
  color: string
  flip?: boolean
}) {
  const dir = flip ? -1 : 1
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={color} stroke={STROKE} strokeWidth={1.2} />
      <rect
        x={cx}
        y={cy - 2}
        width={10 * dir}
        height={3}
        fill={color}
        stroke={STROKE}
        strokeWidth={1}
        transform={flip ? `translate(${-10}, 0)` : undefined}
      />
      <rect
        x={cx - 2}
        y={cy - 6}
        width={4}
        height={4}
        fill={color}
        stroke={STROKE}
        strokeWidth={1}
      />
    </g>
  )
}

/** Peace sign (two fingers up). */
function PeaceHand({
  cx,
  cy,
  color,
}: {
  cx: number
  cy: number
  color: string
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={color} stroke={STROKE} strokeWidth={1.2} />
      <rect
        x={cx - 5}
        y={cy - 12}
        width={3.5}
        height={9}
        rx={1.5}
        fill={color}
        stroke={STROKE}
        strokeWidth={1}
      />
      <rect
        x={cx + 1.5}
        y={cy - 12}
        width={3.5}
        height={9}
        rx={1.5}
        fill={color}
        stroke={STROKE}
        strokeWidth={1}
      />
    </g>
  )
}

/** Thumbs up hand. */
function ThumbsUpHand({
  cx,
  cy,
  color,
}: {
  cx: number
  cy: number
  color: string
}) {
  return (
    <g>
      <rect
        x={cx - 6}
        y={cy - 4}
        width={12}
        height={10}
        rx={4}
        fill={color}
        stroke={STROKE}
        strokeWidth={1.2}
      />
      <rect
        x={cx - 2}
        y={cy - 14}
        width={5}
        height={11}
        rx={2.5}
        fill={color}
        stroke={STROKE}
        strokeWidth={1.2}
      />
    </g>
  )
}

/** Rock horn hand — pinky and index up. */
function RockHand({
  cx,
  cy,
  color,
}: {
  cx: number
  cy: number
  color: string
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={color} stroke={STROKE} strokeWidth={1.2} />
      <rect x={cx - 7} y={cy - 13} width={3.5} height={9} rx={1.5} fill={color} stroke={STROKE} strokeWidth={1} />
      <rect x={cx + 3.5} y={cy - 13} width={3.5} height={9} rx={1.5} fill={color} stroke={STROKE} strokeWidth={1} />
    </g>
  )
}

/* ============================================================
   SOLO POSES (10)
   ============================================================ */

/** 1. Bunny peace + wink */
export function BunnyPeaceWink({ className, showBackdrop, backdropColor = '#FEF0EC' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Sparkle cx={40} cy={40} size={6} color="#F2B4AC" />
      <Sparkle cx={200} cy={50} size={8} color="#F2C94C" />
      <Sparkle cx={210} cy={160} size={5} color="#F2B4AC" />
      {/* body */}
      <Body cx={120} color="#FCE6E0" />
      {/* left arm down */}
      <Arm x1={107} y1={110} x2={88} y2={150} color="#FCE6E0" />
      <Hand cx={88} cy={150} color="#FCE6E0" />
      {/* right arm up peace */}
      <Arm x1={133} y1={108} x2={158} y2={70} color="#FCE6E0" />
      <PeaceHand cx={158} cy={62} color="#FCE6E0" />
      <Bunny cx={120} cy={75} winkRight mouthOpen={false} />
    </svg>
  )
}

/** 2. Fox heart hands above head */
export function FoxHeartHands({ className, showBackdrop, backdropColor = '#FFE8D4' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Heart cx={120} cy={30} size={14} color="#E84B6A" />
      <Heart cx={50} cy={60} size={8} color="#F5A7A0" />
      <Heart cx={195} cy={50} size={10} color="#F5A7A0" />
      <Body cx={120} color="#E8944A" />
      {/* arms up */}
      <Arm x1={107} y1={108} x2={100} y2={60} color="#E8944A" />
      <Arm x1={133} y1={108} x2={140} y2={60} color="#E8944A" />
      <Hand cx={110} cy={55} color="#E8944A" r={7} />
      <Hand cx={130} cy={55} color="#E8944A" r={7} />
      <Heart cx={120} cy={50} size={11} color="#E84B6A" />
      <Fox cx={120} cy={80} sparkleEyes />
    </svg>
  )
}

/** 3. Tiger finger guns */
export function TigerFingerGuns({ className, showBackdrop, backdropColor = '#FEEDD4' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Star cx={35} cy={40} size={7} color="#F2C94C" />
      <Star cx={200} cy={40} size={7} color="#F2C94C" />
      <Body cx={120} color="#F2A14C" />
      <Arm x1={107} y1={108} x2={70} y2={120} color="#F2A14C" />
      <Arm x1={133} y1={108} x2={170} y2={120} color="#F2A14C" />
      <FingerGun cx={62} cy={120} color="#F2A14C" flip />
      <FingerGun cx={178} cy={120} color="#F2A14C" />
      <Tiger cx={120} cy={78} winkLeft />
    </svg>
  )
}

/** 4. Panda V-cheer (both arms up in V) */
export function PandaCheer({ className, showBackdrop, backdropColor = '#EFE9E0' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Star cx={50} cy={40} size={8} color="#F2C94C" />
      <Star cx={200} cy={40} size={8} color="#F2C94C" />
      <Sparkle cx={30} cy={120} size={5} color="#F2C94C" />
      <Sparkle cx={210} cy={120} size={5} color="#F2C94C" />
      <Body cx={120} color="#FFFFFF" />
      <rect x={100} y={105} width={40} height={30} rx={10} fill="#2C2C2C" />
      <Arm x1={105} y1={110} x2={72} y2={58} color="#FFFFFF" />
      <Arm x1={135} y1={110} x2={168} y2={58} color="#FFFFFF" />
      <Hand cx={70} cy={52} color="#FFFFFF" r={7} />
      <Hand cx={170} cy={52} color="#FFFFFF" r={7} />
      <Panda cx={120} cy={80} mouthOpen />
    </svg>
  )
}

/** 5. Sloth chill peace */
export function SlothChillPeace({ className, showBackdrop, backdropColor = '#EEE4D3' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <text x={30} y={50} fontFamily="Georgia, serif" fontSize={22} fill="#8B6F4C" opacity={0.5} fontStyle="italic">z</text>
      <text x={40} y={35} fontFamily="Georgia, serif" fontSize={16} fill="#8B6F4C" opacity={0.4} fontStyle="italic">z</text>
      <Body cx={120} top={100} color="#B8956A" />
      <Arm x1={107} y1={115} x2={75} y2={155} color="#B8956A" />
      <Hand cx={75} cy={155} color="#B8956A" />
      <Arm x1={133} y1={112} x2={170} y2={70} color="#B8956A" />
      <PeaceHand cx={170} cy={62} color="#B8956A" />
      <Sloth cx={120} cy={75} tilt={-8} closedEyes />
    </svg>
  )
}

/** 6. Sheep shy hands-on-cheeks */
export function SheepShyBlush({ className, showBackdrop, backdropColor = '#FDEEE8' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Heart cx={35} cy={50} size={8} color="#F5A7A0" />
      <Heart cx={205} cy={55} size={8} color="#F5A7A0" />
      <Sparkle cx={40} cy={150} size={5} color="#F2B4AC" />
      <Body cx={120} color="#FAF6EB" />
      {/* hands up touching cheeks */}
      <Arm x1={105} y1={108} x2={95} y2={85} color="#FAF6EB" />
      <Arm x1={135} y1={108} x2={145} y2={85} color="#FAF6EB" />
      <Hand cx={95} cy={80} color="#FAF6EB" r={7} />
      <Hand cx={145} cy={80} color="#FAF6EB" r={7} />
      <Sheep cx={120} cy={75} closedEyes />
    </svg>
  )
}

/** 7. Wolf howl */
export function WolfHowl({ className, showBackdrop, backdropColor = '#E8EBEF' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      {/* moon */}
      <circle cx={200} cy={45} r={20} fill="#FEF3C7" />
      <circle cx={194} cy={40} r={3} fill="#E8DCB2" />
      <circle cx={205} cy={50} r={2} fill="#E8DCB2" />
      {/* sound waves */}
      <path d={`M50 70 Q 70 85 50 100`} stroke={STROKE} strokeWidth={2} fill="none" opacity={0.4} strokeLinecap="round" />
      <path d={`M35 60 Q 65 85 35 110`} stroke={STROKE} strokeWidth={2} fill="none" opacity={0.3} strokeLinecap="round" />
      <Body cx={120} color="#8B8D93" />
      <Arm x1={107} y1={110} x2={90} y2={148} color="#8B8D93" />
      <Arm x1={133} y1={110} x2={150} y2={148} color="#8B8D93" />
      <Hand cx={90} cy={152} color="#8B8D93" />
      <Hand cx={150} cy={152} color="#8B8D93" />
      <Wolf cx={120} cy={78} tilt={-15} mouthOpen closedEyes />
    </svg>
  )
}

/** 8. Cheetah running */
export function CheetahRunning({ className, showBackdrop, backdropColor = '#FCEED4' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <MotionLines x={45} y={90} direction="left" />
      <MotionLines x={45} y={120} direction="left" />
      <MotionLines x={45} y={150} direction="left" />
      <Body cx={128} color="#E5B679" />
      {/* forward arm */}
      <Arm x1={133} y1={108} x2={175} y2={95} color="#E5B679" />
      <Hand cx={178} cy={93} color="#E5B679" />
      {/* backward arm */}
      <Arm x1={117} y1={112} x2={85} y2={135} color="#E5B679" />
      <Hand cx={82} cy={138} color="#E5B679" />
      <Cheetah cx={128} cy={76} tilt={-8} mouthOpen />
    </svg>
  )
}

/** 9. Lion roar */
export function LionRoar({ className, showBackdrop, backdropColor = '#FBE5C5' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      {/* roar lines */}
      <path d={`M30 70 L 50 80`} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" opacity={0.5} />
      <path d={`M30 90 L 55 90`} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" opacity={0.5} />
      <path d={`M30 110 L 50 100`} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" opacity={0.5} />
      <path d={`M210 70 L 190 80`} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" opacity={0.5} />
      <path d={`M210 90 L 185 90`} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" opacity={0.5} />
      <path d={`M210 110 L 190 100`} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" opacity={0.5} />
      <Body cx={120} color="#E8A860" />
      {/* claws up */}
      <Arm x1={107} y1={108} x2={80} y2={85} color="#E8A860" />
      <Arm x1={133} y1={108} x2={160} y2={85} color="#E8A860" />
      <Hand cx={76} cy={82} color="#E8A860" r={7} />
      <Hand cx={164} cy={82} color="#E8A860" r={7} />
      {/* claw marks */}
      <path d={`M72 75 L 70 80 M76 72 L 75 78 M80 75 L 82 80`} stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" />
      <path d={`M168 75 L 170 80 M164 72 L 165 78 M160 75 L 158 80`} stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" />
      <Lion cx={120} cy={78} mouthOpen />
    </svg>
  )
}

/** 10. Elephant blow kiss */
export function ElephantBlowKiss({ className, showBackdrop, backdropColor = '#E8ECF0' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Heart cx={175} cy={75} size={12} color="#E84B6A" />
      <Heart cx={200} cy={55} size={8} color="#F5A7A0" />
      <Heart cx={215} cy={100} size={6} color="#F5A7A0" />
      <Body cx={115} color="#B8BAC0" />
      <Arm x1={102} y1={108} x2={78} y2={145} color="#B8BAC0" />
      <Hand cx={76} cy={148} color="#B8BAC0" />
      <Arm x1={128} y1={108} x2={152} y2={95} color="#B8BAC0" />
      <Hand cx={156} cy={92} color="#B8BAC0" r={7} />
      <Elephant cx={115} cy={76} kissMouth winkLeft />
    </svg>
  )
}

/* ============================================================
   COUPLE POSES (10)
   ============================================================ */

const C_LEFT = 80
const C_RIGHT = 160

/** 11. Bunny + Fox — half heart each (together forms heart) */
export function CoupleHeartTogether({ className, showBackdrop, backdropColor = '#FFE8E8' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Heart cx={30} cy={50} size={7} color="#F5A7A0" />
      <Heart cx={210} cy={55} size={8} color="#F5A7A0" />
      <Sparkle cx={50} cy={160} size={5} color="#F2C94C" />
      <Sparkle cx={200} cy={170} size={5} color="#F2C94C" />
      {/* bodies */}
      <Body cx={C_LEFT} color="#FCE6E0" w={40} />
      <Body cx={C_RIGHT} color="#E8944A" w={40} />
      {/* outer arms down */}
      <Arm x1={69} y1={108} x2={55} y2={145} color="#FCE6E0" />
      <Hand cx={55} cy={148} color="#FCE6E0" />
      <Arm x1={171} y1={108} x2={185} y2={145} color="#E8944A" />
      <Hand cx={185} cy={148} color="#E8944A" />
      {/* inner arms meet in middle forming heart */}
      <Arm x1={92} y1={106} x2={115} y2={60} color="#FCE6E0" />
      <Hand cx={115} cy={58} color="#FCE6E0" r={7} />
      <Arm x1={148} y1={106} x2={125} y2={60} color="#E8944A" />
      <Hand cx={125} cy={58} color="#E8944A" r={7} />
      <Heart cx={120} cy={55} size={18} color="#E84B6A" />
      <Bunny cx={C_LEFT} cy={75} sparkleEyes />
      <Fox cx={C_RIGHT} cy={75} sparkleEyes flip />
    </svg>
  )
}

/** 12. Panda + Tiger — high five */
export function CoupleHighFive({ className, showBackdrop, backdropColor = '#FEEDD4' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Star cx={120} cy={50} size={14} color="#F2C94C" />
      <Sparkle cx={105} cy={35} size={5} color="#F2C94C" />
      <Sparkle cx={135} cy={35} size={5} color="#F2C94C" />
      <Body cx={C_LEFT} color="#FFFFFF" w={42} />
      <Body cx={C_RIGHT} color="#F2A14C" w={42} />
      <Arm x1={67} y1={108} x2={55} y2={148} color="#FFFFFF" />
      <Hand cx={55} cy={150} color="#FFFFFF" />
      <Arm x1={173} y1={108} x2={185} y2={148} color="#F2A14C" />
      <Hand cx={185} cy={150} color="#F2A14C" />
      {/* inner arms raised — hands meeting for high five */}
      <Arm x1={95} y1={105} x2={114} y2={65} color="#FFFFFF" />
      <Arm x1={145} y1={105} x2={126} y2={65} color="#F2A14C" />
      <Hand cx={117} cy={62} color="#FFFFFF" r={7} />
      <Hand cx={123} cy={62} color="#F2A14C" r={7} />
      <Panda cx={C_LEFT} cy={75} mouthOpen />
      <Tiger cx={C_RIGHT} cy={75} mouthOpen flip />
    </svg>
  )
}

/** 13. Sheep + Wolf — side hug */
export function CoupleSideHug({ className, showBackdrop, backdropColor = '#EEE8F0' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Heart cx={120} cy={40} size={10} color="#E84B6A" />
      <Heart cx={40} cy={50} size={6} color="#F5A7A0" />
      <Heart cx={200} cy={50} size={6} color="#F5A7A0" />
      <Body cx={C_LEFT} color="#FAF6EB" w={42} />
      <Body cx={C_RIGHT} color="#8B8D93" w={42} />
      {/* outer arms down */}
      <Arm x1={64} y1={108} x2={52} y2={148} color="#FAF6EB" />
      <Hand cx={52} cy={150} color="#FAF6EB" />
      <Arm x1={176} y1={108} x2={188} y2={148} color="#8B8D93" />
      <Hand cx={188} cy={150} color="#8B8D93" />
      {/* inner arms around each other */}
      <Arm x1={96} y1={110} x2={148} y2={108} color="#FAF6EB" width={9} />
      <Arm x1={144} y1={105} x2={96} y2={104} color="#8B8D93" width={9} />
      <Hand cx={152} cy={108} color="#FAF6EB" />
      <Hand cx={92} cy={104} color="#8B8D93" />
      <Sheep cx={C_LEFT} cy={75} tilt={6} closedEyes />
      <Wolf cx={C_RIGHT} cy={75} tilt={-6} flip closedEyes />
    </svg>
  )
}

/** 14. Sloth + Cheetah — holding hands */
export function CoupleHoldHands({ className, showBackdrop, backdropColor = '#F4EBDA' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Heart cx={120} cy={130} size={10} color="#F5A7A0" />
      <Sparkle cx={40} cy={50} size={5} color="#F2C94C" />
      <Sparkle cx={200} cy={50} size={5} color="#F2C94C" />
      <Body cx={C_LEFT} color="#B8956A" w={42} />
      <Body cx={C_RIGHT} color="#E5B679" w={42} />
      <Arm x1={64} y1={110} x2={50} y2={150} color="#B8956A" />
      <Hand cx={50} cy={152} color="#B8956A" />
      <Arm x1={176} y1={110} x2={190} y2={150} color="#E5B679" />
      <Hand cx={190} cy={152} color="#E5B679" />
      {/* inner holding hands */}
      <Arm x1={95} y1={115} x2={118} y2={130} color="#B8956A" />
      <Arm x1={145} y1={115} x2={122} y2={130} color="#E5B679" />
      <Hand cx={120} cy={131} color="#D4A574" />
      <Sloth cx={C_LEFT} cy={75} />
      <Cheetah cx={C_RIGHT} cy={75} flip />
    </svg>
  )
}

/** 15. Lion + Elephant — royal crowns, regal pose */
export function CoupleRoyal({ className, showBackdrop, backdropColor = '#FAE8C8' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Sparkle cx={40} cy={60} size={6} color="#F2C94C" />
      <Sparkle cx={200} cy={60} size={6} color="#F2C94C" />
      <Sparkle cx={120} cy={175} size={5} color="#F2C94C" />
      <Body cx={C_LEFT} color="#E8A860" w={42} />
      <Body cx={C_RIGHT} color="#B8BAC0" w={42} />
      {/* hand on hip (outer) */}
      <Arm x1={64} y1={112} x2={55} y2={135} color="#E8A860" />
      <Hand cx={54} cy={135} color="#E8A860" />
      <Arm x1={176} y1={112} x2={185} y2={135} color="#B8BAC0" />
      <Hand cx={186} cy={135} color="#B8BAC0" />
      {/* inner arms wave */}
      <Arm x1={96} y1={110} x2={110} y2={130} color="#E8A860" />
      <Hand cx={112} cy={132} color="#E8A860" />
      <Arm x1={144} y1={110} x2={130} y2={130} color="#B8BAC0" />
      <Hand cx={128} cy={132} color="#B8BAC0" />
      <Lion cx={C_LEFT} cy={78} crown />
      <Elephant cx={C_RIGHT} cy={78} crown flip />
    </svg>
  )
}

/** 16. Bunny + Panda — jump together (arms up) */
export function CoupleJump({ className, showBackdrop, backdropColor = '#E7F3EA' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Star cx={30} cy={40} size={7} color="#F2C94C" />
      <Star cx={210} cy={40} size={7} color="#F2C94C" />
      <Sparkle cx={120} cy={30} size={7} color="#F2C94C" />
      {/* ground shadows */}
      <ellipse cx={C_LEFT} cy={180} rx={20} ry={3} fill={STROKE} opacity={0.15} />
      <ellipse cx={C_RIGHT} cy={180} rx={20} ry={3} fill={STROKE} opacity={0.15} />
      {/* bodies floating a bit higher */}
      <Body cx={C_LEFT} top={90} h={55} color="#FCE6E0" w={40} />
      <Body cx={C_RIGHT} top={90} h={55} color="#FFFFFF" w={42} />
      {/* motion lines under feet */}
      <path d={`M${C_LEFT - 8} 160 L ${C_LEFT - 8} 170`} stroke={STROKE} strokeWidth={1.8} strokeLinecap="round" opacity={0.5} />
      <path d={`M${C_LEFT + 8} 160 L ${C_LEFT + 8} 170`} stroke={STROKE} strokeWidth={1.8} strokeLinecap="round" opacity={0.5} />
      <path d={`M${C_RIGHT - 8} 160 L ${C_RIGHT - 8} 170`} stroke={STROKE} strokeWidth={1.8} strokeLinecap="round" opacity={0.5} />
      <path d={`M${C_RIGHT + 8} 160 L ${C_RIGHT + 8} 170`} stroke={STROKE} strokeWidth={1.8} strokeLinecap="round" opacity={0.5} />
      {/* arms up */}
      <Arm x1={67} y1={100} x2={45} y2={55} color="#FCE6E0" />
      <Arm x1={93} y1={100} x2={115} y2={55} color="#FCE6E0" />
      <Hand cx={43} cy={50} color="#FCE6E0" r={7} />
      <Hand cx={117} cy={50} color="#FCE6E0" r={7} />
      <Arm x1={147} y1={100} x2={125} y2={55} color="#FFFFFF" />
      <Arm x1={173} y1={100} x2={195} y2={55} color="#FFFFFF" />
      <Hand cx={123} cy={50} color="#FFFFFF" r={7} />
      <Hand cx={197} cy={50} color="#FFFFFF" r={7} />
      <Bunny cx={C_LEFT} cy={72} mouthOpen tilt={-5} />
      <Panda cx={C_RIGHT} cy={72} mouthOpen tilt={5} />
    </svg>
  )
}

/** 17. Fox + Wolf — cool shades, arms crossed */
export function CoupleCoolShades({ className, showBackdrop, backdropColor = '#E3E8EC' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <path d={`M30 170 L 210 170`} stroke={STROKE} strokeWidth={1.2} opacity={0.3} />
      <Sparkle cx={40} cy={45} size={5} color="#F2C94C" />
      <Sparkle cx={195} cy={50} size={5} color="#F2C94C" />
      <Body cx={C_LEFT} color="#E8944A" w={42} />
      <Body cx={C_RIGHT} color="#8B8D93" w={42} />
      {/* crossed arms on chest */}
      <rect x={C_LEFT - 18} y={110} width={36} height={10} rx={5} fill="#E8944A" stroke={STROKE} strokeWidth={1.2} />
      <rect x={C_LEFT - 18} y={122} width={36} height={10} rx={5} fill="#E8944A" stroke={STROKE} strokeWidth={1.2} transform={`rotate(5 ${C_LEFT} 127)`} />
      <rect x={C_RIGHT - 18} y={110} width={36} height={10} rx={5} fill="#8B8D93" stroke={STROKE} strokeWidth={1.2} />
      <rect x={C_RIGHT - 18} y={122} width={36} height={10} rx={5} fill="#8B8D93" stroke={STROKE} strokeWidth={1.2} transform={`rotate(-5 ${C_RIGHT} 127)`} />
      <Fox cx={C_LEFT} cy={75} shades />
      <Wolf cx={C_RIGHT} cy={75} shades flip />
    </svg>
  )
}

/** 18. Tiger + Cheetah — racing forward */
export function CoupleRacing({ className, showBackdrop, backdropColor = '#FFE6C8' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <MotionLines x={45} y={80} direction="left" />
      <MotionLines x={45} y={120} direction="left" />
      <MotionLines x={45} y={160} direction="left" />
      <Body cx={C_LEFT} color="#F2A14C" w={42} />
      <Body cx={C_RIGHT + 10} color="#E5B679" w={42} />
      {/* running arms */}
      <Arm x1={64} y1={108} x2={50} y2={140} color="#F2A14C" />
      <Hand cx={48} cy={143} color="#F2A14C" />
      <Arm x1={96} y1={108} x2={122} y2={90} color="#F2A14C" />
      <Hand cx={124} cy={88} color="#F2A14C" />
      <Arm x1={C_RIGHT - 6} y1={110} x2={C_RIGHT - 20} y2={140} color="#E5B679" />
      <Hand cx={C_RIGHT - 22} cy={143} color="#E5B679" />
      <Arm x1={C_RIGHT + 26} y1={108} x2={C_RIGHT + 45} y2={85} color="#E5B679" />
      <Hand cx={C_RIGHT + 48} cy={83} color="#E5B679" />
      <Tiger cx={C_LEFT} cy={75} tilt={-8} mouthOpen />
      <Cheetah cx={C_RIGHT + 10} cy={75} tilt={-8} mouthOpen />
    </svg>
  )
}

/** 19. Sheep + Bunny — heart frame (arms arching over heads) */
export function CoupleHeartFrame({ className, showBackdrop, backdropColor = '#FEE8E4' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Heart cx={120} cy={26} size={10} color="#E84B6A" />
      <Heart cx={30} cy={130} size={8} color="#F5A7A0" />
      <Heart cx={210} cy={130} size={8} color="#F5A7A0" />
      <Body cx={C_LEFT} color="#FAF6EB" w={42} />
      <Body cx={C_RIGHT} color="#FCE6E0" w={40} />
      {/* outer arms down */}
      <Arm x1={64} y1={110} x2={52} y2={148} color="#FAF6EB" />
      <Hand cx={52} cy={150} color="#FAF6EB" />
      <Arm x1={176} y1={110} x2={188} y2={148} color="#FCE6E0" />
      <Hand cx={188} cy={150} color="#FCE6E0" />
      {/* arching arms forming heart shape above */}
      <path
        d={`M 96 105 Q 100 30 120 40`}
        stroke="#FAF6EB"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M 144 105 Q 140 30 120 40`}
        stroke="#FCE6E0"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
      <Hand cx={120} cy={40} color="#EBD6D0" r={6} />
      <Sheep cx={C_LEFT} cy={80} sparkleEyes />
      <Bunny cx={C_RIGHT} cy={80} sparkleEyes flip />
    </svg>
  )
}

/** 20. Sloth + Elephant — selfie cheek squish */
export function CoupleCheekSquish({ className, showBackdrop, backdropColor = '#E8ECF0' }: SceneProps) {
  return (
    <svg viewBox={VB} className={className} xmlns="http://www.w3.org/2000/svg">
      {showBackdrop && <Backdrop color={backdropColor} />}
      <Heart cx={45} cy={55} size={7} color="#F5A7A0" />
      <Heart cx={200} cy={55} size={7} color="#F5A7A0" />
      <Sparkle cx={30} cy={150} size={5} color="#F2C94C" />
      <Body cx={90} color="#B8956A" w={40} />
      <Body cx={150} color="#B8BAC0" w={40} />
      <Arm x1={73} y1={110} x2={58} y2={150} color="#B8956A" />
      <Hand cx={58} cy={152} color="#B8956A" />
      <Arm x1={167} y1={110} x2={182} y2={150} color="#B8BAC0" />
      <Hand cx={182} cy={152} color="#B8BAC0" />
      {/* inner arms hugging */}
      <Arm x1={107} y1={110} x2={140} y2={108} color="#B8956A" />
      <Arm x1={133} y1={108} x2={100} y2={106} color="#B8BAC0" />
      <Sloth cx={95} cy={80} tilt={10} closedEyes />
      <Elephant cx={145} cy={80} tilt={-10} flip closedEyes />
    </svg>
  )
}
