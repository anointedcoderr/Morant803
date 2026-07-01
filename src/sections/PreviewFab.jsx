export default function PreviewFab() {
  return (
    <a
      href="#credit"
      className="fixed bottom-4 right-4 z-[65] inline-flex items-center gap-2.5 rounded-full border border-strong bg-surface-raised px-4 py-2.5 text-[13px] font-semibold text-default shadow-400 transition hover:border-brand hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
      </span>
      <span className="hidden sm:inline">Preview for Morant803 · request changes</span>
      <span className="sm:hidden">Preview</span>
    </a>
  )
}
