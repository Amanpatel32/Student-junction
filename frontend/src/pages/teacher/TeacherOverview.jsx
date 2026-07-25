import { useEffect, useState } from 'react';
import { BookOpen, Users, GraduationCap, Clock } from 'lucide-react';
import { fetchCourses } from '../../api/courses';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';

const subjectGradients = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-teal-500',
  'from-amber-500 to-yellow-500',
  'from-indigo-500 to-purple-500',
];

export default function TeacherOverview() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No courses assigned yet"
        description="Ask your institute administrator to assign you as the teacher for a course."
      />
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="font-display text-lg font-semibold text-campus-ink">My Courses</h2>
        <p className="text-sm text-campus-inkSoft">You are teaching {courses.length} course{courses.length === 1 ? '' : 's'}</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => (
          <div
            key={c._id}
            className="group relative overflow-hidden rounded-xl shadow-card card-lift bg-white"
          >
            <div className={`h-2 bg-gradient-to-r ${subjectGradients[i % subjectGradients.length]}`} />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block rounded-md bg-campus-forest/10 px-2.5 py-1 font-mono text-xs font-semibold text-campus-forest">
                    {c.code}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-campus-ink">{c.title}</h3>
                  <p className="mt-1 text-sm text-campus-inkSoft">{c.batch}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-campus-inkSoft">
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {c.students?.length || 0} students enrolled
                </span>
                {c.schedule && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {c.schedule}
                  </span>
                )}
              </div>
              {c.description && (
                <p className="mt-3 text-xs text-campus-inkSoft border-t border-campus-line pt-3">
                  {c.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

