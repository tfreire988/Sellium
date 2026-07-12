export function InvoiceThumb({
  accent,
  accentWidth,
  lineWidths,
}: {
  accent: string;
  accentWidth: string;
  lineWidths: [string, string, string];
}) {
  return (
    <div
      className="flex h-[90px] w-[72px] flex-col gap-1.5 rounded-[3px] bg-paper p-2"
      style={{ boxShadow: "0 8px 18px rgba(0,0,0,0.4)" }}
    >
      <div className="h-[3px]" style={{ background: accent, width: accentWidth }} />
      <div className="h-[2px] bg-[#C4BCA8]" style={{ width: lineWidths[0] }} />
      <div className="h-[2px] bg-[#C4BCA8]" style={{ width: lineWidths[1] }} />
      <div className="h-[2px] bg-[#C4BCA8]" style={{ width: lineWidths[2] }} />
    </div>
  );
}
