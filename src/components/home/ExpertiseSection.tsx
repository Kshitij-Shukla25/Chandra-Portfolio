const skills = [
  { name: 'Premiere Pro', level: 98 },
  { name: 'After Effects', level: 92 },
  { name: 'Photoshop', level: 95 },
  { name: 'Illustrator', level: 88 },
  { name: 'Figma (UI/UX)', level: 85 },
];

const services = [
  { title: 'Video Editing', desc: 'Reels, short-form, long-form, podcast — built for engagement.' },
  { title: 'Motion Graphics', desc: 'Animated type, logo stings, explainers — frame by frame in AE.' },
  { title: 'Graphic Design', desc: 'Brand identity, social media, print — visuals that hold up everywhere.' },
  { title: 'UI / UX Design', desc: 'Figma-first digital product and website design.' },
];

export default function ExpertiseSection() {
  return (
    <section className="py-20 border-t border-white/8" aria-labelledby="expertise-heading">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Skills */}
          <div>
            <p className="text-[11px] tracking-[0.2em] text-white/30 uppercase mb-3"
               style={{ fontFamily: 'var(--font-body)' }}>
              Tools
            </p>
            <h2
              id="expertise-heading"
              className="font-black uppercase leading-none text-white mb-10"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4.5vw,60px)' }}
            >
              Software
            </h2>
            <ul className="space-y-6" role="list">
              {skills.map((s) => (
                <li key={s.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-medium text-white/70 tracking-wide"
                          style={{ fontFamily: 'var(--font-body)' }}>
                      {s.name}
                    </span>
                    <span className="text-[11px] text-white/25 tabular-nums">{s.level}%</span>
                  </div>
                  <div className="h-px w-full bg-white/8">
                    <div
                      className="h-full bg-white/40"
                      style={{ width: `${s.level}%` }}
                      role="progressbar"
                      aria-valuenow={s.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={s.name}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-[11px] tracking-[0.2em] text-white/30 uppercase mb-3"
               style={{ fontFamily: 'var(--font-body)' }}>
              What I Do
            </p>
            <h2
              className="font-black uppercase leading-none text-white mb-10"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4.5vw,60px)' }}
            >
              Services
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              {services.map((s) => (
                <li key={s.title}
                    className="p-5 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12 transition-colors">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-2"
                      style={{ fontFamily: 'var(--font-body)' }}>
                    {s.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed"
                     style={{ fontFamily: 'var(--font-body)' }}>
                    {s.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
