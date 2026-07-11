export function HeroStamp({
  size,
  ringText,
  line1,
  line2,
  pathId,
}: {
  size: number;
  ringText: string;
  line1: string;
  line2: string;
  pathId: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 172 172"
      aria-hidden="true"
      className="opacity-[0.93]"
    >
      <defs>
        <path
          id={pathId}
          d="M 86,86 m -63,0 a 63,63 0 1,1 126,0 a 63,63 0 1,1 -126,0"
        />
      </defs>
      <circle
        cx="86"
        cy="86"
        r="77"
        fill="none"
        stroke="#4F6B4A"
        strokeWidth="3"
        strokeDasharray="468 8"
        transform="rotate(16 86 86)"
      />
      <circle
        cx="87"
        cy="85"
        r="75"
        fill="none"
        stroke="#4F6B4A"
        strokeWidth="1.1"
        opacity="0.5"
      />
      <circle cx="86" cy="86" r="49" fill="none" stroke="#4F6B4A" strokeWidth="1.6" />
      <text
        fill="#4F6B4A"
        fontFamily="var(--font-mono)"
        fontSize="12"
        letterSpacing="3.2"
        fontWeight="500"
      >
        <textPath href={`#${pathId}`} startOffset="2">
          {ringText}
        </textPath>
      </text>
      <text
        x="86"
        y="81"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="16"
        fontWeight="600"
        fill="#4F6B4A"
      >
        {line1}
      </text>
      <text
        x="86"
        y="100"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="16"
        fontWeight="600"
        fill="#4F6B4A"
      >
        {line2}
      </text>
    </svg>
  );
}
