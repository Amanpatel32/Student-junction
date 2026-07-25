import { useEffect, useState } from 'react';
import { Megaphone, CalendarDays, User, Building2 } from 'lucide-react';
import { fetchNotices } from '../../api/notices';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices()
      .then((data) => setNotices(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-campus-inkSoft">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading notices…
        </div>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No notices yet"
        description="Announcements from your institute and teachers will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {notices.map((n, i) => (
        <div
          key={n._id}
          className="group relative overflow-hidden rounded-xl border border-campus-line bg-white shadow-card card-lift"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Priority indicator */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${
            n.course ? 'bg-campus-gold' : 'bg-campus-forest'
          }`} />

          <div className="p-5 pl-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-campus-ink">{n.title}</h3>
                  <Pill variant={n.course ? 'gold' : 'neutral'}>
                    {n.course ? n.course.title : 'Institute-wide'}
                  </Pill>
                </div>
                <p className="mt-2 text-sm text-campus-inkSoft leading-relaxed">{n.message}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-campus-inkSoft">
              <span className="flex items-center gap-1">
                <User size={12} />
                {n.postedBy?.name || 'Admin'}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={12} />
                {new Date(n.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {n.course && (
                <span className="flex items-center gap-1">
                  <Building2 size={12} />
                  {n.course.title}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

