import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../../api/courses';
import { fetchUsers } from '../../api/users';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';

const emptyForm = { title: '', code: '', description: '', batch: '', teacher: '', students: [], schedule: '' };

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([fetchCourses(), fetchUsers({ role: 'teacher' }), fetchUsers({ role: 'student' })])
      .then(([c, t, s]) => {
        setCourses(c);
        setTeachers(t);
        setStudents(s);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      title: c.title,
      code: c.code,
      description: c.description || '',
      batch: c.batch,
      teacher: c.teacher?._id || '',
      students: c.students?.map((s) => s._id) || [],
      schedule: c.schedule || '',
    });
    setError('');
    setModalOpen(true);
  };

  const toggleStudent = (id) => {
    setForm((f) => ({
      ...f,
      students: f.students.includes(id) ? f.students.filter((s) => s !== id) : [...f.students, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await updateCourse(editing._id, form);
        toast('Course updated');
      } else {
        await createCourse(form);
        toast('Course created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this course');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteCourse(deleteTarget._id);
      toast(`Removed ${deleteTarget.title}`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not remove this course', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const inputClass = 'w-full rounded-md border border-campus-line bg-white px-3 py-2 text-sm focus:border-campus-forest focus:outline-none';
  const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wide text-campus-inkSoft';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-campus-inkSoft">{courses.length} course{courses.length === 1 ? '' : 's'}</p>
        <Button onClick={openAdd}><Plus size={16} /> Add Course</Button>
      </div>

      {loading ? (
        <div className="px-6 py-16 text-center text-sm text-campus-inkSoft">Loading…</div>
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses yet" description="Create your first course and assign a teacher." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div key={c._id} className="rounded-lg border border-campus-line bg-white/50 p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded bg-campus-forest/5 px-2 py-0.5 font-mono text-xs font-semibold text-campus-forest">{c.code}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-campus-ink">{c.title}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-forest/10 hover:text-campus-forest">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(c)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-campus-inkSoft">{c.batch}</p>
              <p className="mt-1 text-xs text-campus-inkSoft">{c.teacher ? `Taught by ${c.teacher.name}` : 'No teacher assigned'}</p>
              <p className="mt-1 text-xs text-campus-inkSoft">{c.students?.length || 0} student(s) enrolled</p>
              {c.schedule && <p className="mt-2 text-xs italic text-campus-inkSoft">{c.schedule}</p>}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Course' : 'Add Course'} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-campus-redSoft px-3 py-2 text-sm text-campus-red">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Course title</label>
                <input required value={form.title} onChange={set('title')} className={inputClass} placeholder="e.g. Class VII — Mathematics" />
              </div>
              <div>
                <label className={labelClass}>Course code</label>
                <input required value={form.code} onChange={set('code')} className={inputClass} placeholder="e.g. CL7-MATH" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={set('description')} rows={2} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Batch / Section</label>
                <input required value={form.batch} onChange={set('batch')} className={inputClass} placeholder="e.g. Class VII" />
              </div>
              <div>
                <label className={labelClass}>Teacher</label>
                <select value={form.teacher} onChange={set('teacher')} className={inputClass}>
                  <option value="">Unassigned</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Schedule summary</label>
                <input value={form.schedule} onChange={set('schedule')} className={inputClass} placeholder="e.g. Mon/Wed/Fri, 6-8 PM" />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Enrolled students</label>
                <div className="max-h-40 overflow-y-auto rounded-md border border-campus-line bg-white p-2">
                  {students.length === 0 && <p className="px-2 py-1 text-sm text-campus-inkSoft">No students available yet.</p>}
                  {students.map((s) => (
                    <label key={s._id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-campus-paperDim">
                      <input type="checkbox" checked={form.students.includes(s._id)} onChange={() => toggleStudent(s._id)} />
                      {s.name} <span className="text-xs text-campus-inkSoft">({s.rollNumber})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-campus-line pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create course'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this course?"
          message={`This permanently removes "${deleteTarget.title}" and cannot be undone. Attendance, tests, and marks tied to it will remain orphaned.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          busy={deleting}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
