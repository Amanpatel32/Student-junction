import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Clock, Award, Brain, ArrowRight } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchCourseTests } from '../../api/tests';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';

const difficultyGradients = {
  easy: 'from-green-500 to-teal-500',
  medium: 'from-orange-500 to-red-500',
  hard: 'from-red-500 to-pink-500',
};

export default function TestList() {
  const [courseId, setCourseId] = useState('');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetchCourseTests(courseId).then(setTests).finally(() => setLoading(false));
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
            Loading tests…
          </div>
        </div>
      ) : !courseId || tests.length === 0 ? (
        <EmptyState
          icon={FileQuestion}
          title="No tests available"
          description="Your teacher hasn't published any tests for this course yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {tests.map((t) => {
            const gradient = t.questions.length <= 5 ? 'easy' : t.questions.length <= 10 ? 'medium' : 'hard';
            return (
              <div
                key={t._id}
                className="group relative overflow-hidden rounded-xl border border-campus-line bg-white shadow-card card-lift"
              >
                <div className={`h-2 bg-gradient-to-r ${difficultyGradients[gradient]}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-campus-ink">{t.title}</h3>
                      {t.description && (
                        <p className="mt-1 text-sm text-campus-inkSoft">{t.description}</p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-campus-inkSoft">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {t.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Brain size={14} />
                          {t.questions.length} question{t.questions.length === 1 ? '' : 's'}
                        </span>
                        {t.totalMarks && (
                          <span className="flex items-center gap-1.5">
                            <Award size={14} />
                            {t.totalMarks} marks
                          </span>
                        )}
                      </div>
                    </div>
                    {t.attempted && <Pill variant="green">Completed</Pill>}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-campus-line pt-4">
                    <span className={`text-xs font-medium capitalize ${gradient === 'easy' ? 'text-campus-green' : gradient === 'medium' ? 'text-campus-orange' : 'text-campus-red'}`}>
                      {gradient} difficulty
                    </span>
                    <Button
                      size="sm"
                      variant={t.attempted ? 'secondary' : 'primary'}
                      onClick={() => navigate(`/student/tests/${t._id}`)}
                      className="group"
                    >
                      {t.attempted ? 'Review submission' : 'Start test'}
                      <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

