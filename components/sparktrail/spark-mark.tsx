/** Distinctive logomark: a dark squircle badge with the spark glyph and a violet accent dot. */
export function SparkMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center rounded-[9px] bg-[#111111] ${className ?? ''}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[58%] w-[58%]">
        <path
          d="M12 2L13.8 9.4 21 12l-7.2 2.6L12 22l-1.8-7.4L3 12l7.2-2.6L12 2Z"
          fill="#C7FF3D"
        />
      </svg>
      <span className="absolute -right-[3px] -top-[3px] h-[7px] w-[7px] rounded-full bg-[#7857FF] ring-2 ring-[#F6F5EF]" />
    </span>
  )
}
