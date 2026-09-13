export function ScrollIndicator() {
  return (
    <div
      className="flex flex-col items-center gap-2 text-[#111111]/50"
      aria-hidden="true"
    >
      <span className="text-[11px] font-medium tracking-[0.15em]">
        SCROLL
      </span>
      <span className="relative h-8 w-[1.5px] overflow-hidden rounded-full bg-[#111111]/15">
        <span className="absolute inset-x-0 top-0 h-3 w-full animate-[scroll-hint_1.8s_ease-in-out_infinite] rounded-full bg-[#111111]/60" />
      </span>
    </div>
  )
}
