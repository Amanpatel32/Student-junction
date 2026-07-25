import { useEffect, useState } from 'react';
import { Plus, Trash2, CalendarClock } from 'lucide-react';
import { fetchTimetable, createSlot, deleteSlot } from '../../api/timetable';
import { fetchCourses } from '../../api/courses';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const emptyForm = { course: '', day: 'Mon', startTime: '09:00', endTime: '10:00', room: '' };

export default function TimetableManager() {
  const [slots, setSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([fetchTimetable(), fetchCourses()])
      .then(([s, c]) => {
        setSlots(s);
        setCourses(c);
        if (c.length) setForm((f) => ({ ...f, course: f.course || c[0]._id }));
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const inputClass = 'w-full rounded-md border border-campus-line bg-white px-3 py-2 text-sm focus:border-campus-forest focus:outline-none';
  const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wide text-campus-inkSoft';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createSlot(form);
      toast('Class slot added');
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add this slot');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSlot(id);
      toast('Slot removed');
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not remove slot', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-campus-inkSoft">Weekly class schedule across all courses</p>
        <Button onClick={() => setModalOpen(true)} disabled={courses.length === 0}>
          <Plus size={16} /> Add Slot
        </Button>
      </div>

      {loading ? (
        <div className="px-6 py-16 text-center text-sm text-campus-inkSoft">Loading…</div>
      ) : slots.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No class slots yet" description="Add weekly time slots for each course." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DAYS.map((day) => {
            const daySlots = slots.filter((s) => s.day === day);
            if (daySlots.length === 0) return null;
            return (
              <div key={day} className="rounded-lg border border-campus-line bg-white/50 p-4 shadow-card">
                <h3 className="font-display text-base font-semibold text-campus-ink">{day}</h3>
                <div className="mt-3 space-y-2">
                  {daySlots.map((s) => (
                    <div key={s._id} className="flex items-start justify-between rounded-md bg-campus-paperDim px-3 py-2">
                      <div>
                        <div className="text-sm font-medium text-campus-ink">{s.course?.title}</div>
                        <div className="font-mono text-xs text-campus-inkSoft">{s.startTime} – {s.endTime}</div>
                        {s.room && <div className="text-xs text-campus-inkSoft">Room: {s.room}</div>}
                        {s.course?.teacher?.name && <div className="text-xs text-campus-inkSoft">{s.course.teacher.name}</div>}
                      </div>
                      <button onClick={() => handleDelete(s._id)} className="rounded p-1 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <Modal title="Add Class Slot" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-campus-redSoft px-3 py-2 text-sm text-campus-red">{error}</div>}
            <div>
              <label className={labelClass}>Course</label>
              <select value={form.course} onChange={set('course')} className={inputClass}>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.title} ({c.code})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Day</label>
                <select value={form.day} onChange={set('day')} className={inputClass}>
                  {DAYS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Start</label>
                <input type="time" value={form.startTime} onChange={set('startTime')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>End</label>
                <input type="time" value={form.endTime} onChange={set('endTime')} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Room (optional)</label>
              <input value={form.room} onChange={set('room')} className={inputClass} placeholder="e.g. Room 1" />
            </div>
            <div className="flex justify-end gap-3 border-t border-campus-line pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add slot'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
