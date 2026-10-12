/**
 * The Sayt mark (from the original favicon): a stem, a dot and two arcs —
 * a voice that carries. `pulse` animates the arcs outward like a signal.
 */
export function SignalMark({ className = '', pulse = false, tone = 'currentColor' }: { className?: string; pulse?: boolean; tone?: string }) {
  return (
    <svg viewBox="0 0 96 104" fill="none" aria-hidden className={className}>
      <rect x="22" y="70" width="16" height="34" rx="8" fill={tone} />
      <circle cx="30" cy="46" r="13" fill={tone} />
      <path d="M30 20 A26 26 0 0 1 56 46" stroke={tone} strokeWidth="11" strokeLinecap="round" className={pulse ? 'signal-arc signal-arc-1' : ''} />
      <path d="M30 0 A46 46 0 0 1 76 46" stroke={tone} strokeWidth="11" strokeLinecap="round" opacity="0.55" className={pulse ? 'signal-arc signal-arc-2' : ''} />
    </svg>
  );
}
