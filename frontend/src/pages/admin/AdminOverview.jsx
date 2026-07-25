import { useEffect, useState } from 'react';
import { Users, BookOpen, GraduationCap, UserCog, TrendingUp, Activity } from 'lucide-react';
import { fetchUsers } from '../../api/users';
import { fetchCourses } from '../../api/courses';
import Card from '../../components/ui/Card';
import { StatsCardSkeleton } from '../../components/ui/Skeleton';
import AnimatedCounter from '../../components/ui/AnimatedCounter';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchUsers({ role: 'student' }), fetchUsers({ role: 'teacher' }), fetchCourses()]).then(
      ([students, teachers, courses]) => {
        setStats({
          students: students.length,
          activeStudents: students.filter((s) => s.status === 'Active').length,
          teachers: teachers.length,
          courses: courses.length,
        });
        setLoading(false);
      }
    );
  }, []);

  const cards = [
    { label: 'Total Students', value: stats?.students, icon: Users, color: 'text-campus-student', gradient: 'from-amber-500 to-orange-600' },
    { label: 'Active Students', value: stats?.activeStudents, icon: GraduationCap, color: 'text-campus-green', gradient: 'from-green-500 to-teal-600' },
    { label: 'Teachers', value: stats?.teachers, icon: UserCog, color: 'text-campus-teacher', gradient: 'from-teal-500 to-cyan-600' },
    { label: 'Courses', value: stats?.courses, icon: BookOpen, color: 'text-campus-admin', gradient: 'from-blue-500 to-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="group relative overflow-hidden rounded-xl bg-white shadow-card card-lift border border-campus-line"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-3xl font-bold text-campus-ink">
                      <AnimatedCounter end={c.value || 0} />
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-campus-inkSoft">{c.label}</div>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-sm`}>
                    <c.icon size={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card title="Getting Started Guide" className="border-l-4 border-l-campus-forest">
        <ol className="list-decimal space-y-3 pl-5 text-sm text-campus-inkSoft">
          <li>
            <span className="font-medium text-campus-ink">Add people</span> — Create teacher and student accounts under{' '}
            <span className="rounded bg-campus-forest/10 px-1.5 py-0.5 font-medium text-campus-forest">People</span>.
          </li>
          <li>
            <span className="font-medium text-campus-ink">Create courses</span> — Under{' '}
            <span className="rounded bg-campus-forest/10 px-1.5 py-0.5 font-medium text-campus-forest">Courses</span>,
            assign a teacher and enroll students.
          </li>
          <li>
            <span className="font-medium text-campus-ink">Set timetable</span> — Add weekly class slots under{' '}
            <span className="rounded bg-campus-forest/10 px-1.5 py-0.5 font-medium text-campus-forest">Timetable</span>.
          </li>
          <li>
            <span className="font-medium text-campus-ink">Teachers take over</span> — They can mark attendance,
            publish tests, enter marks, and share materials from their dashboard.
          </li>
        </ol>
      </Card>

      <Card title="Institute at a Glance">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {stats && (
            <>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-campus-inkSoft">Student Success</h4>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-campus-ink">Active enrollment rate</span>
                    <span className="font-mono text-campus-green font-semibold">
                      {stats.students > 0 ? Math.round((stats.activeStudents / stats.students) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-campus-paperDim">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-campus-green to-campus-teal transition-all duration-1000"
                      style={{ width: `${stats.students > 0 ? (stats.activeStudents / stats.students) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-campus-inkSoft">Course Distribution</h4>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-campus-ink">Students per course (avg)</span>
                    <span className="font-mono text-campus-forest font-semibold">
                      {stats.courses > 0 ? Math.round(stats.students / stats.courses) : 0}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-campus-paperDim">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-campus-forest to-campus-forestLight transition-all duration-1000"
                      style={{ width: `${stats.courses > 0 ? Math.min(100, (stats.students / stats.courses) * 10) : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

