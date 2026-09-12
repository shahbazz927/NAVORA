export default function Swoosh({ variant = 'light', className = '' }) {
  const stroke =
    variant === 'dark'
      ? { main: 'rgba(147, 197, 253, 0.28)', soft: 'rgba(191, 219, 254, 0.2)', arrow: 'rgba(191, 219, 254, 0.45)' }
      : { main: 'rgba(37, 99, 235, 0.22)', soft: 'rgba(59, 130, 246, 0.16)', arrow: 'rgba(37, 99, 235, 0.4)' };

  return (
    <svg
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      viewBox="0 0 1440 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* flowing swoosh / wave lines */}
      <path
        d="M-60 300 C 220 200, 420 380, 720 290 S 1240 160, 1500 260"
        stroke={stroke.main}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M-60 336 C 240 238, 460 410, 760 326 S 1280 200, 1500 296"
        stroke={stroke.soft}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M-60 372 C 260 276, 500 440, 800 362 S 1320 240, 1500 332"
        stroke={stroke.main}
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* arrow motif */}
      <g fill={stroke.arrow}>
        <path d="M1500 250 L1468 242 L1468 258 Z" />
        <path d="M1500 286 L1472 279 L1472 293 Z" />
        <path d="M1500 322 L1476 316 L1476 328 Z" />
      </g>

      {/* small floating chevrons */}
      <g stroke={stroke.arrow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M360 250 L374 262 L360 274" />
        <path d="M760 208 L774 220 L760 232" />
        <path d="M1090 170 L1104 182 L1090 194" />
      </g>
    </svg>
  );
}