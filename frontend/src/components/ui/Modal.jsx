import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-campus-ink/40 px-4 py-8 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`max-h-full w-full ${
          wide ? 'max-w-2xl' : 'max-w-lg'
        } overflow-y-auto rounded-lg bg-campus-paper shadow-card animate-scale-in`}
      >
        <div className="flex items-center justify-between border-b border-campus-line px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-campus-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-campus-inkSoft transition hover:bg-campus-paperDim hover:text-campus-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

