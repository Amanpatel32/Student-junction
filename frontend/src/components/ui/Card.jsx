export default function Card({ title, action, children, className = '', hover = false, gradient = false }) {
  return (
    <div
      className={`rounded-lg border border-campus-line shadow-card ${
        gradient
          ? 'bg-gradient-to-br from-white to-campus-paperDim/50'
          : 'bg-white/50'
      } ${hover ? 'card-lift cursor-pointer' : ''} ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-campus-line px-5 py-4">
          {title && <h3 className="font-display text-base font-semibold text-campus-ink">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

