export default function ConfirmDialog({ title, message, onCancel, onConfirm, busy, confirmLabel = 'Confirm' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-campus-ink/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-campus-paper p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-campus-ink">{title}</h2>
        <p className="mt-2 text-sm text-campus-inkSoft">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-campus-line px-4 py-2 text-sm font-medium text-campus-ink hover:bg-campus-paperDim"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-campus-red px-4 py-2 text-sm font-medium text-white hover:bg-[#9c3f3f] disabled:opacity-60"
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
