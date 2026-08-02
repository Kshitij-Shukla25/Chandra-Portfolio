const items = [
  'REELS',
  'AI REELS',
  'MOTION GRAPHICS',
  'PODCASTS',
  'LOGOS',
  'SOCIAL MEDIA',
  'PRINT',
  'THUMBNAILS',
  'BRANDING',
  'UI / UX',
];

export default function Ticker() {
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-y border-white/8 py-3 bg-white/[0.02]"
      aria-hidden="true"
    >
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 mx-5 text-[11px] font-semibold tracking-[0.25em] text-white/20 uppercase"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-white/15 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
