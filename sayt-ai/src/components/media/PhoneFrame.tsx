import type { ReactNode } from 'react';

/**
 * Realistic smartphone shell. Everything is sized in container-query units
 * (cqw) so the bezel, corner radius, island and buttons stay proportional at
 * any width. The screen clips its content exactly like a real display.
 */
export function PhoneFrame({ children, className = '', glare = true }: { children: ReactNode; className?: string; glare?: boolean }) {
  return (
    <div className={`phone @container relative aspect-[9/19] ${className}`}>
      {/* side buttons (physical left/right, independent of text direction) */}
      <span aria-hidden className="absolute -left-[1.2cqw] top-[22%] h-[7%] w-[1.6cqw] rounded-s-[1cqw] bg-gradient-to-b from-[#4a4d57] to-[#24262c]" />
      <span aria-hidden className="absolute -left-[1.2cqw] top-[31%] h-[11%] w-[1.6cqw] rounded-s-[1cqw] bg-gradient-to-b from-[#4a4d57] to-[#24262c]" />
      <span aria-hidden className="absolute -right-[1.2cqw] top-[27%] h-[14%] w-[1.6cqw] rounded-e-[1cqw] bg-gradient-to-b from-[#4a4d57] to-[#24262c]" />
      {/* titanium edge */}
      <div className="phone-edge absolute inset-0 rounded-[15cqw] p-[1.4cqw]">
        {/* black bezel */}
        <div className="relative h-full w-full rounded-[13.8cqw] bg-black p-[3cqw]">
          {/* screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[11cqw] bg-ink-900 [transform:translateZ(0)]">
            {children}
            {/* dynamic island */}
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-[2.2%] h-[4.4%] w-[32%] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]" />
            {glare && <span aria-hidden className="phone-glare pointer-events-none absolute inset-0" />}
          </div>
        </div>
      </div>
    </div>
  );
}
