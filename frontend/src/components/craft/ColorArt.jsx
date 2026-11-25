import React from "react";

// Drawn colour inspos for the bouquet and key chain. If a colourway has an
// `image`, the photo is shown instead (see colorways.js).

function Peony({ cx, cy, r, fill, deep }) {
  const outer = Array.from({ length: 10 }, (_, i) => i * 36);
  const inner = Array.from({ length: 7 }, (_, i) => i * 51 + 18);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r} fill={fill} stroke={deep} strokeWidth="1.5" />
      {outer.map((a) => (
        <ellipse key={a} cy={-r * 0.62} rx={r * 0.3} ry={r * 0.4} transform={`rotate(${a})`} fill={fill} stroke={deep} strokeWidth="1.2" />
      ))}
      {inner.map((a) => (
        <ellipse key={a} cy={-r * 0.34} rx={r * 0.22} ry={r * 0.3} transform={`rotate(${a})`} fill={fill} stroke={deep} strokeWidth="1" />
      ))}
      <circle r={r * 0.2} fill={deep} opacity="0.5" />
    </g>
  );
}

function Lily({ cx, cy, s = 1, fill, deep }) {
  const petal = "M0 0 C-17 -22 -20 -56 0 -76 C20 -56 17 -22 0 0 Z";
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s}) rotate(-8)`}>
      {angles.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={petal} fill={fill} stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M0 -8 L0 -62" stroke={deep} strokeWidth="2.4" strokeLinecap="round" opacity="0.45" />
          <path d="M0 -8 L-6 -48 M0 -8 L6 -48" stroke={deep} strokeWidth="1.4" strokeLinecap="round" opacity="0.28" />
        </g>
      ))}
      {[-50, -20, 10, 40, 70, 100].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 0 L0 -26" stroke="#E9DFC9" strokeWidth="1.6" />
          <circle cy="-28" r="3" fill="#EBCB6B" />
        </g>
      ))}
      <circle r="6" fill="#E9DFC9" />
    </g>
  );
}

export function BouquetArt({ art, className }) {
  const { lily, lilyDeep, peony, peonyDeep, wrap, wrapDeep, leaf } = art;
  return (
    <svg viewBox="0 0 300 380" className={className} role="img" aria-hidden="true" focusable="false">
      {/* wrapping paper */}
      <path d="M62 140 L238 140 L186 340 Q150 352 114 340 Z" fill={wrapDeep} />
      <path d="M62 140 L196 150 L172 346 Q150 352 114 340 Z" fill={wrap} />
      <path d="M238 140 L196 150 L172 346 L186 340 Z" fill={wrap} opacity="0.8" />
      <g stroke={wrapDeep} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7">
        <path d="M112 236 q6 -14 0 -28 M112 224 q-8 -4 -10 -12 M112 216 q8 -4 10 -12" />
        <path d="M150 300 q6 -14 0 -28 M150 288 q-8 -4 -10 -12 M150 280 q8 -4 10 -12" />
        <path d="M196 236 q6 -14 0 -28 M196 224 q-8 -4 -10 -12 M196 216 q8 -4 10 -12" />
      </g>

      {/* pipe-cleaner leaves */}
      <g transform="translate(84 178) rotate(-24)">
        <ellipse rx="42" ry="12" fill={leaf} stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2.5" />
        <path d="M-36 0 L36 0" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.5" />
      </g>
      <g transform="translate(220 186) rotate(26)">
        <ellipse rx="36" ry="11" fill={leaf} stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2.5" />
        <path d="M-30 0 L30 0" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.5" />
      </g>

      {/* flowers */}
      <Peony cx={100} cy={106} r={40} fill={peony} deep={peonyDeep} />
      <Peony cx={192} cy={94} r={42} fill={peony} deep={peonyDeep} />
      <Peony cx={218} cy={158} r={36} fill={peony} deep={peonyDeep} />
      <Lily cx={142} cy={168} s={1} fill={lily} deep={lilyDeep} />

      {/* twine bow */}
      <g stroke="#B89A6A" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M150 264 C118 238 96 270 126 280 C140 284 148 274 150 264" />
        <path d="M150 264 C182 238 204 270 174 280 C160 284 152 274 150 264" />
        <path d="M150 264 L126 316 M150 264 L178 312 M150 264 L112 306 M150 264 L192 304" />
      </g>
      <circle cx="150" cy="264" r="5" fill="#B89A6A" />
    </svg>
  );
}

function Tulip({ color, rot, beads }) {
  const stemBeads = [-10, -24, -38, -52, -66];
  return (
    <g transform={`rotate(${rot})`}>
      <path d="M0 0 L0 -80" stroke="#B9BCC2" strokeWidth="2" />
      {stemBeads.map((y, i) => (
        <circle key={y} cy={y} cx={i % 2 ? 1.5 : -1.5} r={i % 2 ? 6.5 : 5.5} fill={beads} stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.2" />
      ))}
      {/* tulip head */}
      <path d="M-17 -84 C-20 -108 -9 -124 0 -116 C9 -124 20 -108 17 -84 C9 -74 -9 -74 -17 -84 Z" fill={color} stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="1.5" />
      <path d="M-4 -115 C-8 -104 -8 -90 -4 -78 M4 -115 C8 -104 8 -90 4 -78" fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="1.5" />
      <ellipse cx="-8" cy="-100" rx="3" ry="9" fill="#FFFFFF" opacity="0.5" transform="rotate(8 -8 -100)" />
    </g>
  );
}

export function KeychainArt({ art, className }) {
  const [a, b, c] = art.tulips;
  return (
    <svg viewBox="0 0 200 320" className={className} role="img" aria-hidden="true" focusable="false">
      {/* ring + clasp */}
      <circle cx="100" cy="42" r="26" fill="none" stroke="#B9BCC2" strokeWidth="5" />
      <circle cx="100" cy="42" r="26" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="18 120" />
      <rect x="92" y="68" width="16" height="28" rx="6" fill="#C9CCD2" stroke="#9FA3AB" strokeWidth="1.5" />
      <circle cx="100" cy="106" r="7" fill="none" stroke="#B9BCC2" strokeWidth="3.5" />

      {/* tulip bundle */}
      <g transform="translate(100 206)">
        <Tulip color={a} rot={-17} beads={art.beads} />
        <Tulip color={c} rot={17} beads={art.beads} />
        <Tulip color={b} rot={0} beads={art.beads} />
      </g>

      {/* wire bow + spiral tails */}
      <g stroke="#B9BCC2" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M100 208 C80 194 66 214 90 218 C98 219 100 214 100 208" />
        <path d="M100 208 C120 194 134 214 110 218 C102 219 100 214 100 208" />
        <path d="M94 218 C90 238 86 250 86 262" />
        <path d="M106 218 C110 238 114 250 114 262" />
        <circle cx="86" cy="272" r="9" />
        <circle cx="114" cy="272" r="9" />
        <circle cx="86" cy="272" r="4" />
        <circle cx="114" cy="272" r="4" />
      </g>
    </svg>
  );
}

export function ProductArt({ product, colorway, className }) {
  if (colorway.image) {
    return <img src={colorway.image} alt={`${colorway.name} ${product}`} className={className} style={{ objectFit: "contain" }} draggable={false} />;
  }
  return product === "bouquet" ? (
    <BouquetArt art={colorway.art} className={className} />
  ) : (
    <KeychainArt art={colorway.art} className={className} />
  );
}
