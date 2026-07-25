import { useEffect, useState } from 'react';
import { GraduationCap, TrendingUp, Trophy, Award } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchReportCard } from '../../api/marks';
import Card from '../../components/ui/Card';
import { Pill } from '../../components/ui/Badge';

export default function MyMarks() {
  const [courseId, setCourseId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetchReportCard(courseId).then(setData).finally(() => setLoading(false));
  }, [courseId]);

  const getGradeColor = (pct) => {
    if (pct >= 80) return 'text-campus-green';
    if (pct >= 60) return 'text-campus-forest';
    if (pct >= 40) return 'text-campus-gold';
    return 'text-campus-red';
  };

  const getGradeBg = (pct) => {
    if (pct >= 80) return 'bg-campus-greenSoft';
    if (pct >= 60) return 'bg-campus-forest/5';
    if (pct >= 40) return 'bg-campus-goldSoft';
    return 'bg-campus-redSoft';
  };

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
            Loading report card…
          </div>
        </div>
      ) : !data ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <GraduationCap size={32} className="text-campus-inkSoft" />
          <p className="text-sm text-campus-inkSoft">Select a course to view your report card.</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Card className="p-0">
              <div className="p-6">
                <Trophy size={28} className="text-campus-gold mb-3" />
                <div className="font-mono text-3xl font-semibold text-campus-ink">{data.obtainedSum}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-campus-inkSoft">Marks obtained</div>
              </div>
            </Card>
            <Card className="p-0">
              <div className="p-6">
                <Award size={28} className="text-campus-forest mb-3" />
                <div className="font-mono text-3xl font-semibold text-campus-ink">{data.totalSum}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-campus-inkSoft">Total possible</div>
              </div>
            </Card>
            <Card className="p-0">
              <div className="p-6">
                <TrendingUp size={28} className="text-campus-forest mb-3" />
                <div className={`font-mono text-3xl font-semibold ${getGradeColor(data.overallPercentage)}`}>
                  {data.overallPercentage}%
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-campus-inkSoft">Overall</div>
              </div>
            </Card>
          </div>

          <Card title="Grade Breakdown">
            {data.entries.length === 0 ? (
              <p className="text-sm text-campus-inkSoft">No marks recorded yet for this course.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-campus-line text-left text-xs uppercase tracking-wide text-campus-inkSoft">
                      <th className="pb-3 pr-4 font-medium">Assessment</th>
                      <th className="pb-3 pr-4 font-medium">Score</th>
                      <th className="pb-3 pr-4 font-medium">%</th>
                      <th className="pb-3 font-medium">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.entries.map((e, i) => {
                      const pct = Math.round((e.marksObtained / e.totalMarks) * 100);
                      return (
                        <tr key={i} className="border-b border-campus-line/70 last:border-0">
                          <td className="py-3 pr-4 font-medium text-campus-ink">{e.examType}</td>
                          <td className="py-3 pr-4 font-mono text-campus-inkSoft">
                            {e.marksObtained} / {e.totalMarks}
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getGradeBg(pct)} ${getGradeColor(pct)}`}>
                              {pct}%
                            </span>
                          </td>
                          <td className="py-3">
                            <Pill variant={e.source === 'test' ? 'gold' : 'neutral'}>
                              {e.source === 'test' ? 'Quiz' : 'Manual'}
                            </Pill>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Visual progress bars */}
          <Card title="Performance Overview">
            <div className="space-y-4">
              {data.entries.slice(0, 8).map((e, i) => {
                const pct = Math.round((e.marksObtained / e.totalMarks) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-campus-ink font-medium">{e.examType}</span>
                      <span className={`font-mono text-xs ${getGradeColor(pct)}`}>{pct}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-campus-paperDim">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          pct >= 80 ? 'bg-campus-green' : pct >= 60 ? 'bg-campus-forest' : pct >= 40 ? 'bg-campus-gold' : 'bg-campus-red'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

