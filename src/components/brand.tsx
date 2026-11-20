/** DEER brand marks. The deer is the shop's own line-art logo (public/brand/deer-mark.png), recoloured by a CSS mask. */

/** Logo: the round deer mark + «DEER» in art-deco capitals + «Mongolia» in script, as on the shop's logo. */
export function Logo({ light = false, small = false }: { light?: boolean; small?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 ${light ? "text-snow" : "text-ink"}`}>
      <span aria-hidden className={`deer shrink-0 ${small ? "h-9 w-9" : "h-10 w-10 md:h-12 md:w-12"}`} />
      <span className="relative leading-none">
        <span className={`display block tracking-[0.32em] ${small ? "text-[22px]" : "text-[24px] md:text-[28px]"}`}>DEER</span>
        <span className={`script absolute -bottom-3 left-8 ${small ? "text-[17px]" : "text-[19px] md:text-[21px]"} ${light ? "text-gold" : "text-berry"}`}>Mongolia</span>
      </span>
    </span>
  );
}

/** The deer drawing itself (once), then breathing gently. */
export function DeerDraw({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`breathe block ${className}`}>
      <span className="draw block aspect-square w-full bg-current" />
    </span>
  );
}

export function Snowflake({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" />
      <path d="m9.5 3.5 2.5 2 2.5-2M9.5 20.5l2.5-2 2.5 2M3.6 10.3l3.1-.6-.9-3M20.4 13.7l-3.1.6.9 3M3.6 13.7l3.1.6-.9 3M20.4 10.3l-3.1-.6.9-3" />
    </svg>
  );
}

/** A four-point twinkle star. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0c.6 6 2 9.4 12 12-10 2.6-11.4 6-12 12-.6-6-2-9.4-12-12C10 9.4 11.4 6 12 0Z" />
    </svg>
  );
}

/** The knitted band, moving slowly like a scarf coming off the needles. */
export function KnitBand({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`knit knit-move ${className}`} />;
}
