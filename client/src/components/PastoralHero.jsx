/**
 * The hero plate: a quiet coastal landscape — pale sky, cream clouds, a few
 * birds, soft hills, grey rocks and a small lighthouse. Drawn inline so it
 * stays crisp at any size and always matches the paper palette.
 *
 * Used as the hero's background layer: `slice` keeps the frame covered at any
 * shape, and anchoring left keeps the lighthouse in view on narrow screens.
 */
const BIRDS = [
  [520, 172, 0.9],
  [566, 140, 0.7],
  [612, 196, 1],
  [660, 158, 0.62],
  [700, 118, 0.5],
  [744, 176, 0.78],
  [790, 210, 0.55],
  [836, 166, 0.9],
  [880, 128, 0.6],
  [918, 196, 0.72],
  [468, 232, 0.6],
  [546, 250, 0.5],
  [640, 244, 0.44],
  [730, 256, 0.5],
];

const FLOWERS = [
  [92, 664, "#e6c74f"],
  [148, 686, "#f2e4ae"],
  [232, 672, "#e6c74f"],
  [318, 690, "#f2e4ae"],
  [404, 676, "#e6c74f"],
  [492, 692, "#f2e4ae"],
  [604, 674, "#e6c74f"],
  [712, 688, "#f2e4ae"],
  [806, 676, "#e6c74f"],
  [902, 690, "#f2e4ae"],
  [1004, 672, "#e6c74f"],
  [1094, 686, "#f2e4ae"],
  [1258, 674, "#e6c74f"],
  [1352, 690, "#f2e4ae"],
  [1456, 668, "#e6c74f"],
  [1540, 684, "#f2e4ae"],
  [174, 648, "#f2e4ae"],
  [672, 656, "#e6c74f"],
  [1160, 658, "#f2e4ae"],
];

const TUFTS = [
  [60, 700],
  [150, 692],
  [268, 700],
  [380, 694],
  [520, 700],
  [660, 696],
  [780, 700],
  [960, 700],
  [1080, 694],
  [1300, 700],
  [1440, 696],
  [1560, 700],
];

export function PastoralHero({ className }) {
  return (
    <svg
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMinYMid slice"
      role="img"
      aria-label="Illustration: a green headland with a small lighthouse beneath a pale sky and cream clouds"
      className={className}
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a4dae4" />
          <stop offset="38%" stopColor="#c4e4e6" />
          <stop offset="68%" stopColor="#e2eee5" />
          <stop offset="100%" stopColor="#eef3e3" />
        </linearGradient>
        <linearGradient id="hero-hill" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#9ac86d" />
          <stop offset="100%" stopColor="#7cb058" />
        </linearGradient>
        <filter id="hero-haze" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width="1600" height="700" fill="url(#hero-sky)" />

      {/* Cream clouds, upper left */}
      <g fill="#fbf8ee">
        <ellipse cx="150" cy="148" rx="184" ry="112" />
        <ellipse cx="342" cy="106" rx="128" ry="78" />
        <ellipse cx="66" cy="292" rx="172" ry="130" />
        <ellipse cx="268" cy="268" rx="156" ry="108" />
        <ellipse cx="122" cy="422" rx="200" ry="102" />
      </g>
      <g fill="#efeada" opacity="0.85">
        <ellipse cx="304" cy="336" rx="138" ry="56" />
        <ellipse cx="176" cy="472" rx="172" ry="52" />
      </g>

      {/* Hazed cloud band along the horizon */}
      <g fill="#f3f6ed" opacity="0.9" filter="url(#hero-haze)">
        <ellipse cx="740" cy="336" rx="118" ry="44" />
        <ellipse cx="906" cy="300" rx="92" ry="36" />
        <ellipse cx="1086" cy="342" rx="142" ry="46" />
        <ellipse cx="1300" cy="296" rx="158" ry="52" />
        <ellipse cx="1496" cy="332" rx="132" ry="46" />
        <ellipse cx="1186" cy="248" rx="104" ry="34" />
        <ellipse cx="1268" cy="420" rx="204" ry="40" fill="#fbf8ee" />
      </g>

      {/* Birds */}
      <g
        fill="none"
        stroke="#3f5457"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      >
        {BIRDS.map(([x, y, scale], index) => (
          <g key={index} transform={`translate(${x} ${y}) scale(${scale})`}>
            <path d="M0 0q11-11 22 0q11-11 22 0" />
          </g>
        ))}
      </g>

      {/* Far hills behind the mist */}
      <path
        d="M250 470Q420 400 560 452Q700 502 860 460Q1010 420 1160 462Q1320 508 1460 466Q1540 444 1600 458L1600 620L250 620Z"
        fill="#c9dcb3"
      />

      {/* Water resting in the valley */}
      <path
        d="M0 512Q300 496 700 512Q1100 528 1600 504L1600 542Q1100 568 700 548Q300 532 0 546Z"
        fill="#e6efec"
        opacity="0.92"
      />

      {/* Middle hills */}
      <path
        d="M0 560Q200 500 420 546Q620 588 820 552Q1020 516 1220 556Q1400 592 1600 560L1600 700L0 700Z"
        fill="#a8ca7f"
      />
      <g fill="#e2d179" opacity="0.7">
        <path d="M520 566Q700 540 900 566Q720 588 540 580Z" />
        <path d="M1080 566Q1260 540 1460 566Q1280 590 1100 582Z" />
        <path d="M240 556Q380 536 500 556Q360 572 250 568Z" />
      </g>

      {/* Headland on the left, carrying the lighthouse */}
      <path
        d="M0 700L0 470Q70 438 180 470Q320 512 450 570Q590 632 700 700Z"
        fill="url(#hero-hill)"
      />
      <g fill="#e4d273" opacity="0.7">
        <path d="M0 566Q110 528 248 562Q130 586 0 596Z" />
        <path d="M320 588Q430 562 540 594Q420 618 320 610Z" />
      </g>

      {/* Small house beside the lighthouse */}
      <path d="M150 424L188 424L188 464L150 464Z" fill="#f8f5ec" />
      <path d="M144 424L169 402L194 424Z" fill="#d1483c" />
      <path d="M166 442L176 442L176 464L166 464Z" fill="#d6d0bd" />
      <path d="M154 432L162 432L162 440L154 440Z" fill="#cfd8d2" />

      {/* The lighthouse */}
      <path d="M100 456L106 356L134 356L140 456Z" fill="#f8f5ec" />
      <path d="M104 380L135 380L136 398L103 398Z" fill="#d1483c" />
      <path d="M102 422L138 422L139 440L101 440Z" fill="#d1483c" />
      <path d="M96 348L144 348L144 358L96 358Z" fill="#e8e3d4" />
      <path d="M106 322L134 322L134 348L106 348Z" fill="#fdfbf3" />
      <circle cx="120" cy="334" r="5" fill="#f3dda2" />
      <path d="M104 322Q120 294 136 322Z" fill="#d1483c" />
      <circle cx="120" cy="296" r="2.5" fill="#d1483c" />
      <path d="M94 456L146 456L152 470L88 470Z" fill="#77867b" />

      {/* Rocks in the foreground */}
      <path
        d="M330 700Q312 636 356 606Q392 580 436 604Q470 624 476 664Q480 688 470 700Z"
        fill="#5d6f68"
      />
      <path d="M352 636Q382 610 424 620Q398 646 366 652Z" fill="#7c8d85" opacity="0.9" />
      <path
        d="M480 700Q470 662 500 646Q534 630 560 650Q578 668 570 700Z"
        fill="#67796f"
      />
      <path
        d="M1148 700Q1128 626 1188 590Q1250 556 1320 578Q1380 600 1396 660Q1404 686 1392 700Z"
        fill="#57695f"
      />
      <path d="M1204 638Q1244 604 1302 616Q1260 648 1216 658Z" fill="#7b8c84" opacity="0.9" />
      <path
        d="M1400 700Q1394 650 1430 636Q1470 622 1494 652Q1506 672 1496 700Z"
        fill="#5d6f68"
      />

      {/* Meadow in front, with grass and small flowers */}
      <path
        d="M0 700L0 662Q260 640 560 668Q900 700 1220 676Q1420 662 1600 674L1600 700Z"
        fill="#79b25a"
      />
      <g fill="none" stroke="#5f9448" strokeWidth="3" strokeLinecap="round">
        {TUFTS.map(([x, y], index) => (
          <path key={index} d={`M${x} ${y}q7-16 14 0`} />
        ))}
      </g>
      <g>
        {FLOWERS.map(([x, y, fill], index) => (
          <circle key={index} cx={x} cy={y} r="3" fill={fill} />
        ))}
      </g>

      {/* A whisper of paper grain so the plate reads as printed matter */}
      <rect width="1600" height="700" fill="#f0eee6" opacity="0.06" />
    </svg>
  );
}

export default PastoralHero;
