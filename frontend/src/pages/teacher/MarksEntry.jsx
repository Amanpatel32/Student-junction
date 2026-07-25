import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchCourse } from '../../api/courses';
import { fetchCourseMarks, createMark, updateMark, deleteMark } from '../../api/marks';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';

const emptyForm = { student: '', examType: '', marksObtained: '', totalMarks: '', remarks: '' };

export default function MarksEntry() {
  const [courseId, setCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = () => {
    if (!courseId) return;
    setLoading(true);
    Promise.all([fetchCourse(courseId), fetchCourseMarks(courseId)])
      .then(([course, m]) => {
        setStudents(course.students || []);
        setMarks(m);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [courseId]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, student: students[0]?._id || '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({
      student: m.student._id,
      examType: m.examType,
      marksObtained: m.marksObtained,
      totalMarks: m.totalMarks,
      remarks: m.remarks || '',
    });
    setError('');
    setModalOpen(true);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        course: courseId,
        marksObtained: Number(form.marksObtained),
        totalMarks: Number(form.totalMarks),
      };
      if (editing) {
        await updateMark(editing._id, payload);
        toast('Mark entry updated');
      } else {
        await createMark(payload);
        toast('Mark entry added');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this entry');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteMark(deleteTarget._id);
      toast('Mark entry removed');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not remove entry', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const inputClass = 'w-full rounded-md border border-campus-line bg-white px-3 py-2 text-sm focus:border-campus-forest focus:outline-none';
  const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wide text-campus-inkSoft';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CourseSelect value={courseId} onChange={setCourseId} />
        <Button onClick={openAdd} disabled={!courseId || students.length === 0}><Plus size={16} /> Add Mark Entry</Button>
      </div>

      {loading ? (
        <div className="px-6 py-16 text-center text-sm text-campus-inkSoft">Loading…</div>
      ) : !courseId || marks.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No manual marks yet"
          description="Add assignment, midterm, or exam scores here. Quiz scores are added automatically when students submit a test."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-campus-line bg-white/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-campus-line text-left text-xs uppercase tracking-wide text-campus-inkSoft">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Assessment</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Remarks</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m) => (
                <tr key={m._id} className="border-b border-campus-line/70 last:border-0 hover:bg-campus-paperDim/60">
                  <td className="px-4 py-3 font-medium text-campus-ink">{m.student?.name}</td>
                  <td className="px-4 py-3 text-campus-inkSoft">{m.examType}</td>
                  <td className="px-4 py-3 font-mono text-campus-inkSoft">{m.marksObtained} / {m.totalMarks}</td>
                  <td className="px-4 py-3 text-campus-inkSoft">{m.remarks || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(m)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-forest/10 hover:text-campus-forest">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(m)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Mark Entry' : 'Add Mark Entry'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-campus-redSoft px-3 py-2 text-sm text-campus-red">{error}</div>}
            <div>
              <label className={labelClass}>Student</label>
              <select required value={form.student} onChange={set('student')} className={inputClass} disabled={Boolean(editing)}>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Assessment type</label>
              <input required value={form.examType} onChange={set('examType')} className={inputClass} placeholder="e.g. Midterm, Assignment 2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Marks obtained</label>
                <input required type="number" min={0} value={form.marksObtained} onChange={set('marksObtained')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Total marks</label>
                <input required type="number" min={1} value={form.totalMarks} onChange={set('totalMarks')} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Remarks (optional)</label>
              <input value={form.remarks} onChange={set('remarks')} className={inputClass} />
            </div>
            <div className="flex justify-end gap-3 border-t border-campus-line pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add entry'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Remove this mark entry?"
          message={`This removes the "${deleteTarget.examType}" entry for ${deleteTarget.student?.name}.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          busy={deleting}
          confirmLabel="Remove"
        />
      )}
    </div>
  );
}
