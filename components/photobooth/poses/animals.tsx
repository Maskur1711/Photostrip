/**
 * Compact, chibi-style SVG head components for each Zootopia-inspired
 * animal character. All heads render inside a shared coordinate system
 * so pose scenes can position them at arbitrary (cx, cy).
 *
 * Each head is ~60 units wide. Default view: face forward, eyes open, smile.
 */

export interface HeadProps {
  cx: number
  cy: number
  scale?: number
  /** rotation around (cx, cy) in degrees */
  tilt?: number
  /** render a wink (closed eye) on left/right */
  winkLeft?: boolean
  winkRight?: boolean
  /** both eyes closed (happy/content) */
  closedEyes?: boolean
  /** sparkle eyes (shy/cute) */
  sparkleEyes?: boolean
  /** mouth open (for shouting/singing/kiss) */
  mouthOpen?: boolean
  /** puckered kiss mouth */
  kissMouth?: boolean
  /** wear sunglasses */
  shades?: boolean
  /** wear a tiny crown */
  crown?: boolean
  /** flip horizontally (for couples facing each other) */
  flip?: boolean
}

const STROKE = '#2A1F1A'

/* ---------- shared primitives (eyes / mouth / extras) ---------- */

function Eyes({
  cx,
  cy,
  winkLeft,
  winkRight,
  closed,
  sparkle,
  shades,
}: {
  cx: number
  cy: number
  winkLeft?: boolean
  winkRight?: boolean
  closed?: boolean
  sparkle?: boolean
  shades?: boolean
}) {
  if (shades) {
    return (
      <g>
        <rect
          x={cx - 16}
          y={cy - 4}
          width={32}
          height={9}
          rx={4}
          fill={STROKE}
        />
        <rect
          x={cx - 16}
          y={cy - 1}
          width={32}
          height={2}
          fill="#FFFFFF"
          opacity={0.25}
        />
      </g>
    )
  }
  const leftEye = (() => {
    if (closed || winkLeft) {
      return (
        <path
          d={`M${cx - 11} ${cy} Q ${cx - 8} ${cy - 3} ${cx - 5} ${cy}`}
          stroke={STROKE}
          strokeWidth={1.8}
          fill="none"
          strokeLinecap="round"
        />
      )
    }
    return (
      <g>
        <ellipse cx={cx - 8} cy={cy} rx={3} ry={3.5} fill={STROKE} />
        <circle cx={cx - 7} cy={cy - 1.2} r={1} fill="#FFFFFF" />
        {sparkle && (
          <circle cx={cx - 9} cy={cy + 1} r={0.6} fill="#FFFFFF" />
        )}
      </g>
    )
  })()
  const rightEye = (() => {
    if (closed || winkRight) {
      return (
        <path
          d={`M${cx + 5} ${cy} Q ${cx + 8} ${cy - 3} ${cx + 11} ${cy}`}
          stroke={STROKE}
          strokeWidth={1.8}
          fill="none"
          strokeLinecap="round"
        />
      )
    }
    return (
      <g>
        <ellipse cx={cx + 8} cy={cy} rx={3} ry={3.5} fill={STROKE} />
        <circle cx={cx + 9} cy={cy - 1.2} r={1} fill="#FFFFFF" />
        {sparkle && (
          <circle cx={cx + 7} cy={cy + 1} r={0.6} fill="#FFFFFF" />
        )}
      </g>
    )
  })()
  return (
    <g>
      {leftEye}
      {rightEye}
    </g>
  )
}

function Mouth({
  cx,
  cy,
  open,
  kiss,
}: {
  cx: number
  cy: number
  open?: boolean
  kiss?: boolean
}) {
  if (kiss) {
    return (
      <g>
        <ellipse
          cx={cx}
          cy={cy}
          rx={2.5}
          ry={3}
          fill="#E84B6A"
        />
      </g>
    )
  }
  if (open) {
    return (
      <g>
        <path
          d={`M${cx - 5} ${cy - 1} Q ${cx} ${cy + 7} ${cx + 5} ${cy - 1} Z`}
          fill="#8B2A3A"
          stroke={STROKE}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        <path
          d={`M${cx - 4.5} ${cy - 0.5} L ${cx + 4.5} ${cy - 0.5}`}
          stroke="#FFFFFF"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </g>
    )
  }
  return (
    <path
      d={`M${cx - 4} ${cy} Q ${cx} ${cy + 3} ${cx + 4} ${cy}`}
      stroke={STROKE}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
    />
  )
}

function Blush({ cx, cy, color = '#F5A7A0' }: { cx: number; cy: number; color?: string }) {
  return (
    <g opacity={0.55}>
      <ellipse cx={cx - 14} cy={cy + 3} rx={3.5} ry={2} fill={color} />
      <ellipse cx={cx + 14} cy={cy + 3} rx={3.5} ry={2} fill={color} />
    </g>
  )
}

function Crown({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <path
        d={`M${cx - 10} ${cy} L ${cx - 10} ${cy - 7} L ${cx - 5} ${cy - 3} L ${cx} ${cy - 10} L ${cx + 5} ${cy - 3} L ${cx + 10} ${cy - 7} L ${cx + 10} ${cy} Z`}
        fill="#F2C94C"
        stroke={STROKE}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <circle cx={cx - 6} cy={cy - 2} r={1.2} fill="#E84B6A" />
      <circle cx={cx} cy={cy - 6} r={1.2} fill="#E84B6A" />
      <circle cx={cx + 6} cy={cy - 2} r={1.2} fill="#E84B6A" />
    </g>
  )
}

/* ---------- helpers ---------- */

function wrap(
  cx: number,
  cy: number,
  scale: number,
  tilt: number,
  flip: boolean,
  children: React.ReactNode,
) {
  const parts: string[] = []
  parts.push(`translate(${cx} ${cy})`)
  if (tilt) parts.push(`rotate(${tilt})`)
  if (scale !== 1) parts.push(`scale(${scale})`)
  if (flip) parts.push(`scale(-1 1)`)
  parts.push(`translate(${-cx} ${-cy})`)
  return <g transform={parts.join(' ')}>{children}</g>
}

/* =============== INDIVIDUAL ANIMALS =============== */

export function Bunny({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* ears */}
      <ellipse cx={cx - 12} cy={cy - 34} rx={6} ry={20} fill="#FCE6E0" stroke={STROKE} strokeWidth={1.2} />
      <ellipse cx={cx + 12} cy={cy - 34} rx={6} ry={20} fill="#FCE6E0" stroke={STROKE} strokeWidth={1.2} />
      <ellipse cx={cx - 12} cy={cy - 32} rx={3} ry={14} fill="#F5B2AA" />
      <ellipse cx={cx + 12} cy={cy - 32} rx={3} ry={14} fill="#F5B2AA" />
      {/* head */}
      <ellipse cx={cx} cy={cy} rx={22} ry={20} fill="#FCE6E0" stroke={STROKE} strokeWidth={1.4} />
      {crown && <Crown cx={cx} cy={cy - 22} />}
      <Eyes cx={cx} cy={cy - 2} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      {/* nose */}
      <path
        d={`M${cx - 2} ${cy + 6} Q ${cx} ${cy + 9} ${cx + 2} ${cy + 6} Z`}
        fill="#E89B9B"
        stroke={STROKE}
        strokeWidth={0.8}
      />
      <Mouth cx={cx} cy={cy + 10} open={mouthOpen} kiss={kissMouth} />
      <Blush cx={cx} cy={cy + 2} />
    </g>,
  )
}

export function Fox({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* ears */}
      <path
        d={`M${cx - 22} ${cy - 10} L ${cx - 15} ${cy - 32} L ${cx - 6} ${cy - 15} Z`}
        fill="#E8944A"
        stroke={STROKE}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <path
        d={`M${cx + 22} ${cy - 10} L ${cx + 15} ${cy - 32} L ${cx + 6} ${cy - 15} Z`}
        fill="#E8944A"
        stroke={STROKE}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <path
        d={`M${cx - 19} ${cy - 13} L ${cx - 15} ${cy - 26} L ${cx - 10} ${cy - 15} Z`}
        fill="#FFE9D1"
      />
      <path
        d={`M${cx + 19} ${cy - 13} L ${cx + 15} ${cy - 26} L ${cx + 10} ${cy - 15} Z`}
        fill="#FFE9D1"
      />
      {/* head */}
      <ellipse cx={cx} cy={cy} rx={22} ry={19} fill="#E8944A" stroke={STROKE} strokeWidth={1.4} />
      {/* white muzzle */}
      <ellipse cx={cx} cy={cy + 5} rx={16} ry={12} fill="#FFE9D1" />
      {crown && <Crown cx={cx} cy={cy - 22} />}
      <Eyes cx={cx} cy={cy - 4} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      {/* nose */}
      <ellipse cx={cx} cy={cy + 6} rx={2.5} ry={1.8} fill={STROKE} />
      <Mouth cx={cx} cy={cy + 11} open={mouthOpen} kiss={kissMouth} />
    </g>,
  )
}

export function Panda({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* ears (black) */}
      <circle cx={cx - 17} cy={cy - 18} r={8} fill="#2C2C2C" />
      <circle cx={cx + 17} cy={cy - 18} r={8} fill="#2C2C2C" />
      {/* head */}
      <ellipse cx={cx} cy={cy} rx={23} ry={21} fill="#FFFFFF" stroke={STROKE} strokeWidth={1.4} />
      {crown && <Crown cx={cx} cy={cy - 24} />}
      {/* eye patches */}
      <ellipse cx={cx - 9} cy={cy - 3} rx={6.5} ry={7} fill="#2C2C2C" transform={`rotate(-15 ${cx - 9} ${cy - 3})`} />
      <ellipse cx={cx + 9} cy={cy - 3} rx={6.5} ry={7} fill="#2C2C2C" transform={`rotate(15 ${cx + 9} ${cy - 3})`} />
      <Eyes cx={cx} cy={cy - 2} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      {/* nose */}
      <ellipse cx={cx} cy={cy + 7} rx={2.5} ry={1.8} fill={STROKE} />
      <Mouth cx={cx} cy={cy + 11} open={mouthOpen} kiss={kissMouth} />
      <Blush cx={cx} cy={cy + 3} />
    </g>,
  )
}

export function Tiger({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* ears */}
      <circle cx={cx - 16} cy={cy - 19} r={7} fill="#F2A14C" stroke={STROKE} strokeWidth={1.2} />
      <circle cx={cx + 16} cy={cy - 19} r={7} fill="#F2A14C" stroke={STROKE} strokeWidth={1.2} />
      <circle cx={cx - 16} cy={cy - 18} r={3.5} fill="#FFE4C8" />
      <circle cx={cx + 16} cy={cy - 18} r={3.5} fill="#FFE4C8" />
      {/* head */}
      <ellipse cx={cx} cy={cy} rx={23} ry={20} fill="#F2A14C" stroke={STROKE} strokeWidth={1.4} />
      {/* stripes */}
      <path d={`M${cx - 15} ${cy - 14} Q ${cx - 12} ${cy - 10} ${cx - 18} ${cy - 6}`} stroke="#2A1F1A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 15} ${cy - 14} Q ${cx + 12} ${cy - 10} ${cx + 18} ${cy - 6}`} stroke="#2A1F1A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d={`M${cx - 5} ${cy - 16} Q ${cx - 2} ${cy - 12} ${cx - 6} ${cy - 8}`} stroke="#2A1F1A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 5} ${cy - 16} Q ${cx + 2} ${cy - 12} ${cx + 6} ${cy - 8}`} stroke="#2A1F1A" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* muzzle */}
      <ellipse cx={cx} cy={cy + 5} rx={14} ry={10} fill="#FFE4C8" />
      {crown && <Crown cx={cx} cy={cy - 22} />}
      <Eyes cx={cx} cy={cy - 3} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      <ellipse cx={cx} cy={cy + 5} rx={2.5} ry={1.8} fill={STROKE} />
      <Mouth cx={cx} cy={cy + 10} open={mouthOpen} kiss={kissMouth} />
    </g>,
  )
}

export function Sheep({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* wool puffs around head */}
      {Array.from({ length: 9 }).map((_, i) => {
        const ang = (i / 9) * Math.PI * 2
        const r = 24
        const px = cx + Math.cos(ang) * r
        const py = cy - 3 + Math.sin(ang) * (r - 2)
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={8}
            fill="#FAF6EB"
            stroke={STROKE}
            strokeWidth={1}
          />
        )
      })}
      {/* face */}
      <ellipse cx={cx} cy={cy + 2} rx={18} ry={16} fill="#E6BFA5" stroke={STROKE} strokeWidth={1.3} />
      {/* ears */}
      <ellipse cx={cx - 24} cy={cy - 2} rx={6} ry={4} fill="#E6BFA5" stroke={STROKE} strokeWidth={1} transform={`rotate(-20 ${cx - 24} ${cy - 2})`} />
      <ellipse cx={cx + 24} cy={cy - 2} rx={6} ry={4} fill="#E6BFA5" stroke={STROKE} strokeWidth={1} transform={`rotate(20 ${cx + 24} ${cy - 2})`} />
      {crown && <Crown cx={cx} cy={cy - 22} />}
      <Eyes cx={cx} cy={cy - 1} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      <ellipse cx={cx} cy={cy + 8} rx={2} ry={1.3} fill={STROKE} />
      <Mouth cx={cx} cy={cy + 12} open={mouthOpen} kiss={kissMouth} />
      <Blush cx={cx} cy={cy + 4} color="#E89B9B" />
    </g>,
  )
}

export function Wolf({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* ears */}
      <path
        d={`M${cx - 20} ${cy - 8} L ${cx - 14} ${cy - 30} L ${cx - 6} ${cy - 14} Z`}
        fill="#8B8D93"
        stroke={STROKE}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <path
        d={`M${cx + 20} ${cy - 8} L ${cx + 14} ${cy - 30} L ${cx + 6} ${cy - 14} Z`}
        fill="#8B8D93"
        stroke={STROKE}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <path d={`M${cx - 17} ${cy - 11} L ${cx - 14} ${cy - 25} L ${cx - 10} ${cy - 15} Z`} fill="#C5C7CB" />
      <path d={`M${cx + 17} ${cy - 11} L ${cx + 14} ${cy - 25} L ${cx + 10} ${cy - 15} Z`} fill="#C5C7CB" />
      {/* head */}
      <ellipse cx={cx} cy={cy} rx={22} ry={20} fill="#8B8D93" stroke={STROKE} strokeWidth={1.4} />
      {/* light chest / muzzle area */}
      <ellipse cx={cx} cy={cy + 6} rx={14} ry={11} fill="#C5C7CB" />
      {crown && <Crown cx={cx} cy={cy - 22} />}
      <Eyes cx={cx} cy={cy - 4} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      <ellipse cx={cx} cy={cy + 6} rx={2.5} ry={1.8} fill={STROKE} />
      <Mouth cx={cx} cy={cy + 11} open={mouthOpen} kiss={kissMouth} />
    </g>,
  )
}

export function Sloth({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* head (round) */}
      <circle cx={cx} cy={cy} r={22} fill="#B8956A" stroke={STROKE} strokeWidth={1.4} />
      {/* face cream mask */}
      <ellipse cx={cx} cy={cy + 3} rx={16} ry={14} fill="#E8D2B0" />
      {/* dark eye patches */}
      <ellipse cx={cx - 8} cy={cy - 1} rx={5} ry={6} fill="#5A3E20" />
      <ellipse cx={cx + 8} cy={cy - 1} rx={5} ry={6} fill="#5A3E20" />
      {crown && <Crown cx={cx} cy={cy - 24} />}
      <Eyes cx={cx} cy={cy} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      <ellipse cx={cx} cy={cy + 7} rx={2.5} ry={1.8} fill={STROKE} />
      <Mouth cx={cx} cy={cy + 11} open={mouthOpen} kiss={kissMouth} />
    </g>,
  )
}

export function Cheetah({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* ears */}
      <circle cx={cx - 15} cy={cy - 19} r={6.5} fill="#E5B679" stroke={STROKE} strokeWidth={1.2} />
      <circle cx={cx + 15} cy={cy - 19} r={6.5} fill="#E5B679" stroke={STROKE} strokeWidth={1.2} />
      <circle cx={cx - 15} cy={cy - 18} r={3} fill="#F7DFB3" />
      <circle cx={cx + 15} cy={cy - 18} r={3} fill="#F7DFB3" />
      {/* head */}
      <ellipse cx={cx} cy={cy} rx={22} ry={19} fill="#E5B679" stroke={STROKE} strokeWidth={1.4} />
      {/* spots */}
      <circle cx={cx - 12} cy={cy - 9} r={1.5} fill="#3A2A1E" />
      <circle cx={cx + 12} cy={cy - 9} r={1.5} fill="#3A2A1E" />
      <circle cx={cx - 15} cy={cy - 3} r={1.3} fill="#3A2A1E" />
      <circle cx={cx + 15} cy={cy - 3} r={1.3} fill="#3A2A1E" />
      <circle cx={cx} cy={cy - 12} r={1.2} fill="#3A2A1E" />
      {/* muzzle */}
      <ellipse cx={cx} cy={cy + 5} rx={13} ry={10} fill="#F7DFB3" />
      {/* tear marks */}
      <path d={`M${cx - 7} ${cy + 2} L ${cx - 4} ${cy + 10}`} stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" />
      <path d={`M${cx + 7} ${cy + 2} L ${cx + 4} ${cy + 10}`} stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" />
      {crown && <Crown cx={cx} cy={cy - 22} />}
      <Eyes cx={cx} cy={cy - 3} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      <ellipse cx={cx} cy={cy + 5} rx={2.2} ry={1.6} fill={STROKE} />
      <Mouth cx={cx} cy={cy + 10} open={mouthOpen} kiss={kissMouth} />
    </g>,
  )
}

export function Lion({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* mane — cluster of circles */}
      {Array.from({ length: 10 }).map((_, i) => {
        const ang = (i / 10) * Math.PI * 2
        const r = 26
        const px = cx + Math.cos(ang) * r
        const py = cy + Math.sin(ang) * r
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={9}
            fill="#C67F2E"
            stroke={STROKE}
            strokeWidth={1}
          />
        )
      })}
      {/* ears */}
      <circle cx={cx - 15} cy={cy - 18} r={5} fill="#E8A860" stroke={STROKE} strokeWidth={1} />
      <circle cx={cx + 15} cy={cy - 18} r={5} fill="#E8A860" stroke={STROKE} strokeWidth={1} />
      {/* head */}
      <ellipse cx={cx} cy={cy} rx={20} ry={19} fill="#E8A860" stroke={STROKE} strokeWidth={1.4} />
      {/* muzzle */}
      <ellipse cx={cx} cy={cy + 5} rx={13} ry={10} fill="#F4CE92" />
      {crown && <Crown cx={cx} cy={cy - 20} />}
      <Eyes cx={cx} cy={cy - 3} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      <ellipse cx={cx} cy={cy + 5} rx={2.5} ry={1.8} fill={STROKE} />
      <Mouth cx={cx} cy={cy + 10} open={mouthOpen} kiss={kissMouth} />
    </g>,
  )
}

export function Elephant({
  cx,
  cy,
  scale = 1,
  tilt = 0,
  winkLeft,
  winkRight,
  closedEyes,
  sparkleEyes,
  mouthOpen,
  kissMouth,
  shades,
  crown,
  flip,
}: HeadProps) {
  return wrap(
    cx,
    cy,
    scale,
    tilt,
    !!flip,
    <g>
      {/* big ears */}
      <ellipse cx={cx - 24} cy={cy + 4} rx={12} ry={16} fill="#B8BAC0" stroke={STROKE} strokeWidth={1.2} />
      <ellipse cx={cx + 24} cy={cy + 4} rx={12} ry={16} fill="#B8BAC0" stroke={STROKE} strokeWidth={1.2} />
      <ellipse cx={cx - 22} cy={cy + 5} rx={7} ry={11} fill="#D5D7DB" />
      <ellipse cx={cx + 22} cy={cy + 5} rx={7} ry={11} fill="#D5D7DB" />
      {/* head */}
      <ellipse cx={cx} cy={cy} rx={21} ry={20} fill="#B8BAC0" stroke={STROKE} strokeWidth={1.4} />
      {/* trunk */}
      <path
        d={`M${cx - 4} ${cy + 10} Q ${cx - 6} ${cy + 25} ${cx + 8} ${cy + 24} Q ${cx + 14} ${cy + 20} ${cx + 4} ${cy + 12}`}
        fill="#B8BAC0"
        stroke={STROKE}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <path d={`M${cx - 2} ${cy + 15} L ${cx + 6} ${cy + 20}`} stroke={STROKE} strokeWidth={0.8} opacity={0.5} fill="none" />
      {crown && <Crown cx={cx} cy={cy - 22} />}
      <Eyes cx={cx} cy={cy - 4} winkLeft={winkLeft} winkRight={winkRight} closed={closedEyes} sparkle={sparkleEyes} shades={shades} />
      <Mouth cx={cx} cy={cy + 5} open={mouthOpen} kiss={kissMouth} />
    </g>,
  )
}

/* ---------- decorative elements ---------- */

export function Heart({
  cx,
  cy,
  size = 10,
  color = '#E84B6A',
}: {
  cx: number
  cy: number
  size?: number
  color?: string
}) {
  const s = size / 10
  return (
    <path
      d={`M ${cx} ${cy + 5 * s} 
          C ${cx - 8 * s} ${cy - 1 * s}, ${cx - 10 * s} ${cy - 9 * s}, ${cx - 5 * s} ${cy - 9 * s}
          C ${cx - 2 * s} ${cy - 9 * s}, ${cx} ${cy - 6 * s}, ${cx} ${cy - 4 * s}
          C ${cx} ${cy - 6 * s}, ${cx + 2 * s} ${cy - 9 * s}, ${cx + 5 * s} ${cy - 9 * s}
          C ${cx + 10 * s} ${cy - 9 * s}, ${cx + 8 * s} ${cy - 1 * s}, ${cx} ${cy + 5 * s} Z`}
      fill={color}
      stroke={STROKE}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  )
}

export function Sparkle({
  cx,
  cy,
  size = 6,
  color = '#F2C94C',
}: {
  cx: number
  cy: number
  size?: number
  color?: string
}) {
  return (
    <g>
      <path
        d={`M${cx} ${cy - size} L ${cx + size * 0.3} ${cy - size * 0.3} L ${cx + size} ${cy} L ${cx + size * 0.3} ${cy + size * 0.3} L ${cx} ${cy + size} L ${cx - size * 0.3} ${cy + size * 0.3} L ${cx - size} ${cy} L ${cx - size * 0.3} ${cy - size * 0.3} Z`}
        fill={color}
      />
    </g>
  )
}

export function Star({
  cx,
  cy,
  size = 8,
  color = '#F2C94C',
}: {
  cx: number
  cy: number
  size?: number
  color?: string
}) {
  const pts: string[] = []
  for (let i = 0; i < 10; i += 1) {
    const ang = (Math.PI / 5) * i - Math.PI / 2
    const r = i % 2 === 0 ? size : size * 0.45
    pts.push(`${cx + Math.cos(ang) * r},${cy + Math.sin(ang) * r}`)
  }
  return (
    <polygon
      points={pts.join(' ')}
      fill={color}
      stroke={STROKE}
      strokeWidth={0.8}
      strokeLinejoin="round"
    />
  )
}

export function MotionLines({
  x,
  y,
  direction = 'left',
}: {
  x: number
  y: number
  direction?: 'left' | 'right' | 'down'
}) {
  const lines = [-6, 0, 6].map((o) => {
    if (direction === 'left') {
      return (
        <line
          key={o}
          x1={x}
          y1={y + o}
          x2={x - 18}
          y2={y + o}
          stroke={STROKE}
          strokeWidth={1.8}
          strokeLinecap="round"
          opacity={0.7}
        />
      )
    }
    if (direction === 'right') {
      return (
        <line
          key={o}
          x1={x}
          y1={y + o}
          x2={x + 18}
          y2={y + o}
          stroke={STROKE}
          strokeWidth={1.8}
          strokeLinecap="round"
          opacity={0.7}
        />
      )
    }
    return (
      <line
        key={o}
        x1={x + o}
        y1={y}
        x2={x + o}
        y2={y + 18}
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.7}
      />
    )
  })
  return <g>{lines}</g>
}

export { STROKE }
