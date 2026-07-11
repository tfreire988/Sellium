// Sellium — demo "Cómo se hace un informe" (escena para animations.jsx)
// 40 s · 1920×1200 (16:10) · misma paleta que la landing
const { Stage, Sprite, useSprite, useTime, Easing, interpolate, animate } = window;

const INK = '#1C2620';
const PAPER = '#F2EEE0';
const PAPER_TEXT = '#241F16';
const PAPER_MUTED = '#7C7368';
const SELLO = '#B8763A';
const VERDE = '#4F6B4A';
const MUTED = '#8C9689';
const MONO = "'IBM Plex Mono', monospace";
const SANS = "'IBM Plex Sans', sans-serif";
const SERIF = "'Fraunces', serif";

function Kicker({ text }) {
  return (
    <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 26, letterSpacing: 6, color: MUTED, textTransform: 'uppercase' }}>{text}</div>
  );
}

function FadeUp({ t, delay = 0, dur = 0.6, children, style }) {
  const p = Math.max(0, Math.min(1, (t - delay) / dur));
  const e = Easing.easeOutCubic(p);
  return <div style={{ opacity: e, transform: `translateY(${(1 - e) * 26}px)`, ...style }}>{children}</div>;
}

function Invoice({ accent, t, delay }) {
  const p = Math.max(0, Math.min(1, (t - delay) / 0.5));
  const e = Easing.easeOutBack(p);
  return (
    <div style={{ opacity: Math.min(1, p * 2), transform: `translateY(${(1 - e) * -60}px)` }}>
      <div style={{ width: 150, height: 190, background: PAPER, borderRadius: 6, padding: '22px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 18px 40px rgba(0,0,0,0.45)' }}>
        <div style={{ height: 7, background: accent, width: '58%' }} />
        <div style={{ height: 5, background: '#C4BCA8' }} />
        <div style={{ height: 5, background: '#C4BCA8', width: '78%' }} />
        <div style={{ height: 5, background: '#C4BCA8', width: '62%' }} />
        <div style={{ height: 5, background: '#C4BCA8', width: '70%' }} />
      </div>
    </div>
  );
}

function Escena1() {
  const { localTime: t } = useSprite();
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: SANS, color: PAPER }}>
      <Kicker text="1/4 · Sube tus facturas" />
      <FadeUp t={t} delay={0.2} style={{ position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: SERIF, fontSize: 76, fontWeight: 600 }}>Arrastra tus facturas</div>
        <div style={{ fontFamily: SANS, fontSize: 32, color: '#C7CCC2', marginTop: 18 }}>Luz, gas o combustible. Foto o PDF, como las tengas.</div>
      </FadeUp>
      <FadeUp t={t} delay={0.8} style={{ position: 'absolute', top: 460, left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ border: '3px dashed rgba(242,238,224,0.35)', borderRadius: '22px 12px 20px 12px', padding: '70px 120px', fontFamily: MONO, fontSize: 28, letterSpacing: 4, color: MUTED }}>SUELTA AQUÍ TUS FACTURAS</div>
      </FadeUp>
      <div style={{ position: 'absolute', top: 800, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 44 }}>
        <Invoice accent={SELLO} t={t} delay={2.2} />
        <Invoice accent={PAPER_MUTED} t={t} delay={3.0} />
        <Invoice accent={VERDE} t={t} delay={3.8} />
      </div>
    </div>
  );
}

function Escena2() {
  const { localTime: t } = useSprite();
  const nameOp = animate({ from: 0, to: 1, start: 1.6, end: 2.1, ease: Easing.easeOutCubic })(t);
  const checkOp = animate({ from: 0, to: 1, start: 3.2, end: 3.7, ease: Easing.easeOutCubic })(t);
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: SANS, color: PAPER }}>
      <Kicker text="2/4 · Dinos para quién es" />
      <FadeUp t={t} delay={0.2} style={{ position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: SERIF, fontSize: 76, fontWeight: 600 }}>¿Para qué cliente es este informe?</div>
      </FadeUp>
      <FadeUp t={t} delay={0.8} style={{ position: 'absolute', top: 430, left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ background: PAPER, color: PAPER_TEXT, borderRadius: '18px 10px 16px 12px', transform: 'rotate(-0.6deg)', padding: '56px 68px', boxShadow: '0 24px 56px rgba(0,0,0,0.5)', width: 760, boxSizing: 'border-box' }}>
          <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 600, marginBottom: 32 }}>El informe irá a nombre de tu cliente</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `3px solid ${PAPER_TEXT}`, borderRadius: '12px 8px 14px 8px', padding: '24px 32px', fontSize: 31 }}>
            <span style={{ opacity: nameOp, fontWeight: 500 }}>Grupo Altavera Construcciones</span>
            <span style={{ color: PAPER_MUTED, fontSize: 24 }}>▾</span>
          </div>
          <div style={{ opacity: checkOp, marginTop: 28, fontSize: 27, color: '#4A443A' }}>
            <span style={{ color: VERDE, fontWeight: 600 }}>✓</span> Se ajusta a su información conforme trabajamos contigo
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

function LineaProceso({ t, delay, doneAt, children }) {
  const op = animate({ from: 0, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
  const done = t >= doneAt;
  return (
    <div style={{ opacity: op, fontFamily: MONO, fontSize: 34, color: done ? PAPER : MUTED, transition: 'color 0.3s' }}>
      {children} <span style={{ color: VERDE }}>{done ? '✓' : ''}</span>
    </div>
  );
}

function Escena3() {
  const { localTime: t } = useSprite();
  const rot = (t * 140) % 360;
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: SANS, color: PAPER }}>
      <Kicker text="3/4 · Calculamos con datos oficiales" />
      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <svg width="150" height="150" viewBox="0 0 64 64" style={{ transform: `rotate(${rot}deg)` }}>
          <circle cx="32" cy="32" r="27" fill="none" stroke={SELLO} strokeWidth="2.6" strokeDasharray="150 20" />
          <circle cx="32.8" cy="31.4" r="25.5" fill="none" stroke={SELLO} strokeWidth="1" opacity="0.45" />
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <LineaProceso t={t} delay={0.5} doneAt={2.6}>Leyendo tus facturas…</LineaProceso>
        <LineaProceso t={t} delay={2.8} doneAt={5.4}>Calculando con los factores oficiales del MITECO…</LineaProceso>
        <LineaProceso t={t} delay={5.6} doneAt={7.6}>Montando el informe para Grupo Altavera…</LineaProceso>
      </div>
    </div>
  );
}

function Escena4() {
  const { localTime: t } = useSprite();
  const stampP = animate({ from: 0, to: 1, start: 2.4, end: 2.8, ease: Easing.easeOutCubic })(t);
  const stampScale = animate({ from: 2.1, to: 1, start: 2.4, end: 2.85, ease: Easing.easeOutBack })(t);
  const row = (label, val, muted) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #D8D0BC', fontSize: 29, color: muted ? PAPER_MUTED : PAPER_TEXT }}>
      <span>{label}</span>
      <span style={{ fontFamily: MONO, fontWeight: 500 }}>{val}</span>
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: SANS, color: PAPER }}>
      <Kicker text="4/4 · Informe listo para tu cliente" />
      <FadeUp t={t} delay={0.2} style={{ position: 'absolute', top: 220, left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ position: 'relative', background: PAPER, color: PAPER_TEXT, borderRadius: '20px 10px 18px 12px', transform: 'rotate(-0.8deg)', padding: '64px 76px 56px', boxShadow: '0 30px 70px rgba(0,0,0,0.55)', width: 880, boxSizing: 'border-box' }}>
          <div style={{ fontFamily: MONO, fontSize: 21, letterSpacing: 4, color: PAPER_MUTED, textTransform: 'uppercase', marginBottom: 10 }}>Informe de huella de carbono · Ejercicio 2026</div>
          <div style={{ fontFamily: SERIF, fontSize: 46, fontWeight: 600, marginBottom: 34 }}>Talleres Mecánicos Rovira, S.L.</div>
          {row('Alcance 1 · Combustión directa', '4,2 t CO₂e')}
          {row('Alcance 2 · Electricidad', '1,8 t CO₂e')}
          {row('Alcance 3 · Estimación', '12,6 t CO₂e', true)}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: `4px solid ${PAPER_TEXT}`, marginTop: 26, paddingTop: 22 }}>
            <span style={{ fontWeight: 600, fontSize: 30 }}>Total</span>
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 46 }}>18,6 t CO₂e</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 20, color: PAPER_MUTED, marginTop: 34 }}>Factores de emisión MITECO 2026 · Metodología GHG Protocol</div>
          <div style={{ position: 'absolute', top: -60, right: -50, opacity: stampP * 0.93, transform: `scale(${stampScale}) rotate(-10deg)` }}>
            <svg width="260" height="260" viewBox="0 0 172 172">
              <defs>
                <path id="anim-ring" d="M 86,86 m -63,0 a 63,63 0 1,1 126,0 a 63,63 0 1,1 -126,0" />
              </defs>
              <circle cx="86" cy="86" r="77" fill="none" stroke={VERDE} strokeWidth="3" strokeDasharray="468 8" transform="rotate(16 86 86)" />
              <circle cx="87" cy="85" r="75" fill="none" stroke={VERDE} strokeWidth="1.1" opacity="0.5" />
              <circle cx="86" cy="86" r="49" fill="none" stroke={VERDE} strokeWidth="1.6" />
              <text fill={VERDE} fontFamily={MONO} fontSize="12" letterSpacing="3.2" fontWeight="500">
                <textPath href="#anim-ring" startOffset="2">LISTO PARA TU CLIENTE · SELLIUM ·</textPath>
              </text>
              <text x="86" y="81" textAnchor="middle" fontFamily={SERIF} fontSize="16" fontWeight="600" fill={VERDE}>GRUPO</text>
              <text x="86" y="100" textAnchor="middle" fontFamily={SERIF} fontSize="16" fontWeight="600" fill={VERDE}>ALTAVERA</text>
            </svg>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

function Cierre() {
  const { localTime: t } = useSprite();
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: SANS, color: PAPER }}>
      <FadeUp t={t} delay={0.2} style={{ position: 'absolute', top: 420, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 22 }}>
          <svg width="80" height="80" viewBox="0 0 34 34">
            <circle cx="17" cy="17" r="14.5" fill="none" stroke={SELLO} strokeWidth="2" strokeDasharray="86 4" transform="rotate(20 17 17)" />
            <circle cx="17.6" cy="16.5" r="13.6" fill="none" stroke={SELLO} strokeWidth="0.9" opacity="0.5" />
            <text x="17" y="22.5" textAnchor="middle" fontFamily={SERIF} fontSize="16" fontWeight="700" fill={SELLO}>S</text>
          </svg>
          <span style={{ fontFamily: SERIF, fontSize: 88, fontWeight: 600 }}>Sellium</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 34, color: '#C7CCC2', marginTop: 26 }}>Tu huella de carbono, lista en un día.</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: MUTED, marginTop: 20 }}>sellium.es · 149 € · sin permanencia</div>
      </FadeUp>
    </div>
  );
}

function SelliumDemo() {
  return (
    <Stage width={1920} height={1200} duration={40} background={INK} fps={30} loop autoplay>
      <Sprite start={0} end={9}><Escena1 /></Sprite>
      <Sprite start={9} end={16}><Escena2 /></Sprite>
      <Sprite start={16} end={25}><Escena3 /></Sprite>
      <Sprite start={25} end={34}><Escena4 /></Sprite>
      <Sprite start={34} end={40}><Cierre /></Sprite>
    </Stage>
  );
}

window.SelliumDemo = SelliumDemo;
