import { useEffect, useState } from 'react';
import { ClipboardCheck, TrendingUp, CalendarDays } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchMyAttendance } from '../../api/attendance';
import Card from '../../components/ui/Card';
import { Pill } from '../../components/ui/Badge';

const statusVariant = { Present: 'green', Late: 'gold', Absent: 'red' };

function CircularProgress({ percentage, size = 120 }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 75 ? '#3B7A57' : percentage >= 50 ? '#D9A521' : '#B84C4C';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#F1ECDF"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

export default function MyAttendance() {
  const [courseId, setCourseId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetchMyAttendance(courseId).then(setData).finally(() => setLoading(false));
  }, [courseId]);

  return (
    <div className="space-y-6">
      <CourseSelect value={courseId} onChange={setCourseId} />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-campus-inkSoft">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading attendance…
          </div>
        </div>
      ) : !data ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <ClipboardCheck size={32} className="text-campus-inkSoft" />
          <p className="text-sm text-campus-inkSoft">Select a course to view your attendance.</p>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Card className="p-0">
              <div className="flex flex-col items-center p-6">
                <CircularProgress percentage={data.percentage} />
                <div className="mt-3 text-center">
                  <div className={`font-mono text-2xl font-bold ${data.percentage >= 75 ? 'text-campus-green' : data.percentage >= 50 ? 'text-campus-gold' : 'text-campus-red'}`}>
                    {data.percentage}%
                  </div>
                  <div className="text-xs uppercase tracking-wide text-campus-inkSoft">Attendance</div>
                </div>
              </div>
            </Card>
            <Card className="p-0">
              <div className="p-6">
                <TrendingUp size={28} className="text-campus-forest mb-3" />
                <div className="font-mono text-3xl font-semibold text-campus-ink">{data.totalDays}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-campus-inkSoft">Classes recorded</div>
              </div>
            </Card>
            <Card className="p-0">
              <div className="p-6">
                <CalendarDays size={28} className="text-campus-forest mb-3" />
                <div className={`font-mono text-3xl font-semibold ${data.percentage >= 75 ? 'text-campus-green' : 'text-campus-red'}`}>
                  {data.percentage >= 75 ? 'On track' : 'Low'}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-campus-inkSoft">75% required</div>
              </div>
            </Card>
          </div>

          <Card title="Attendance History">
            {data.rows.length === 0 ? (
              <p className="text-sm text-campus-inkSoft">No attendance recorded yet.</p>
            ) : (
              <div className="divide-y divide-campus-line">
                {[...data.rows].reverse().map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-3 text-sm">
                    <span className="flex items-center gap-2 text-campus-inkSoft">
                      <CalendarDays size={14} />
                      {new Date(r.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <Pill variant={statusVariant[r.status]}>{r.status}</Pill>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

