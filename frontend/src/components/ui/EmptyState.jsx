export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center animate-fade-in">
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-campus-paperDim">
          <Icon size={32} className="text-campus-inkSoft" />
        </div>
      )}
      <p className="font-display text-lg font-medium text-campus-ink">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-campus-inkSoft leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

