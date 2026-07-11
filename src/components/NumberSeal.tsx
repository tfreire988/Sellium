export function NumberSeal({ size, number }: { size: number; number: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" aria-hidden="true">
      <circle
        cx="23"
        cy="23"
        r="20"
        fill="none"
        stroke="#B8763A"
        strokeWidth="2.4"
        strokeDasharray="118 5"
        transform="rotate(24 23 23)"
      />
      <circle
        cx="23.7"
        cy="22.4"
        r="18.8"
        fill="none"
        stroke="#B8763A"
        strokeWidth="1"
        opacity="0.5"
      />
      <text
        x="23"
        y="30"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="21"
        fontWeight="700"
        fill="#B8763A"
      >
        {number}
      </text>
    </svg>
  );
}
