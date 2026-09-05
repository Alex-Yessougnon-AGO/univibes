export default function Loading() {
  return (
    <div
      className="min-h-[60dvh] flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
      aria-label="Chargement"
    >
      <div className="w-10 h-10 rounded-2xl bg-[var(--brand)] flex items-center justify-center shadow-[var(--shadow-brand)] animate-pulse-soft">
        <span className="text-white font-black text-sm">UV</span>
      </div>
      <div className="w-6 h-6 rounded-full border-2 border-[var(--brand)] border-t-transparent animate-spin" />
    </div>
  );
}
