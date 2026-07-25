import { useEffect, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchCourse } from '../../api/courses';
import { fetchCourseAttendance, markAttendance } from '../../api/attendance';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

const todayStr = () => new Date().toISOString().slice(0, 10);

const statusStyles = {
  Present: 'bg-campus-greenSoft text-campus-green border-campus-green',
  Absent: 'bg-campus-redSoft text-campus-red border-campus-red',
  Late: 'bg-campus-goldSoft text-[#8A6A1E] border-campus-gold',
};

export default function AttendanceMarker() {
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState(todayStr());
  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    Promise.all([fetchCourse(courseId), fetchCourseAttendance(courseId)])
      .then(([course, attendance]) => {
        setStudents(course.students || []);
        setSummary(attendance.summary || {});

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const existing = attendance.days.find((d) => new Date(d.date).toDateString() === dayStart.toDateString());

        const initial = {};
        (course.students || []).forEach((s) => {
          const rec = existing?.records.find((r) => (r.student._id || r.student) === s._id);
          initial[s._id] = rec ? rec.status : 'Present';
        });
        setStatuses(initial);
      })
      .finally(() => setLoading(false));
  }, [courseId, date]);

  const setStatus = (studentId, status) => setStatuses((s) => ({ ...s, [studentId]: status }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map((s) => ({ student: s._id, status: statuses[s._id] || 'Present' }));
      await markAttendance({ course: courseId, date, records });
      toast('Attendance saved');
      const attendance = await fetchCourseAttendance(courseId);
      setSummary(attendance.summary || {});
    } catch (err) {
      toast(err.response?.data?.message || 'Could not save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <CourseSelect value={courseId} onChange={setCourseId} />
        <input
          type="date"
          value={date}
          max={todayStr()}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-campus-line bg-white px-3 py-2 text-sm focus:border-campus-forest focus:outline-none"
        />
      </div>

      {courseId && (
        <Card
          title={`Mark attendance — ${new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
          action={<Button onClick={handleSave} disabled={saving || loading || students.length === 0}>{saving ? 'Saving…' : 'Save attendance'}</Button>}
        >
          {loading ? (
            <p className="text-sm text-campus-inkSoft">Loading students…</p>
          ) : students.length === 0 ? (
            <p className="text-sm text-campus-inkSoft">No students enrolled in this course yet.</p>
          ) : (
            <div className="divide-y divide-campus-line">
              {students.map((s) => (
                <div key={s._id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-campus-ink">{s.name}</div>
                    <div className="font-mono text-xs text-campus-inkSoft">
                      {s.rollNumber}
                      {summary[s._id] && (
                        <span> · {Math.round((summary[s._id].present / summary[s._id].total) * 100)}% overall</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['Present', 'Late', 'Absent'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setStatus(s._id, opt)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          statuses[s._id] === opt ? statusStyles[opt] : 'border-campus-line text-campus-inkSoft hover:bg-campus-paperDim'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {!courseId && (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <ClipboardCheck size={28} className="text-campus-inkSoft" />
          <p className="text-sm text-campus-inkSoft">Select a course to mark attendance.</p>
        </div>
      )}
    </div>
  );
}
