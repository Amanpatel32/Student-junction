import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FileQuestion, Eye, X } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchCourseTests, createTest, updateTest, deleteTest } from '../../api/tests';
import { fetchTestSubmissions } from '../../api/submissions';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

const blankQuestion = () => ({ text: '', options: ['', ''], correctOption: 0, marks: 1 });
const emptyForm = { title: '', description: '', durationMinutes: 30, isPublished: false, questions: [blankQuestion()] };

export default function TestBuilder() {
  const [courseId, setCourseId] = useState('');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewingSubmissions, setViewingSubmissions] = useState(null);
  const toast = useToast();

  const load = () => {
    if (!courseId) return;
    setLoading(true);
    fetchCourseTests(courseId).then(setTests).finally(() => setLoading(false));
  };

  useEffect(load, [courseId]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description || '',
      durationMinutes: t.durationMinutes,
      isPublished: t.isPublished,
      questions: t.questions.map((q) => ({ ...q })),
    });
    setError('');
    setModalOpen(true);
  };

  const updateQuestion = (i, patch) =>
    setForm((f) => ({ ...f, questions: f.questions.map((q, idx) => (idx === i ? { ...q, ...patch } : q)) }));

  const updateOption = (qi, oi, value) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q, idx) =>
        idx === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) } : q
      ),
    }));

  const addOption = (qi) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q, idx) => (idx === qi && q.options.length < 6 ? { ...q, options: [...q.options, ''] } : q)),
    }));

  const removeOption = (qi, oi) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q, idx) => {
        if (idx !== qi || q.options.length <= 2) return q;
        const options = q.options.filter((_, j) => j !== oi);
        const correctOption = q.correctOption >= options.length ? 0 : q.correctOption;
        return { ...q, options, correctOption };
      }),
    }));

  const addQuestion = () => setForm((f) => ({ ...f, questions: [...f.questions, blankQuestion()] }));
  const removeQuestion = (i) => setForm((f) => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, course: courseId };
      if (editing) {
        await updateTest(editing._id, payload);
        toast('Test updated');
      } else {
        await createTest(payload);
        toast('Test created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this test');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteTest(deleteTarget._id);
      toast('Test deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not delete test', 'error');
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
        <Button onClick={openAdd} disabled={!courseId}><Plus size={16} /> New Test</Button>
      </div>

      {loading ? (
        <div className="px-6 py-16 text-center text-sm text-campus-inkSoft">Loading…</div>
      ) : !courseId || tests.length === 0 ? (
        <EmptyState icon={FileQuestion} title="No tests yet" description="Create a quiz — it auto-grades the moment a student submits." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-campus-line bg-white/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-campus-line text-left text-xs uppercase tracking-wide text-campus-inkSoft">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Questions</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t._id} className="border-b border-campus-line/70 last:border-0 hover:bg-campus-paperDim/60">
                  <td className="px-4 py-3 font-medium text-campus-ink">{t.title}</td>
                  <td className="px-4 py-3 text-campus-inkSoft">{t.questions.length} ({t.totalMarks} marks)</td>
                  <td className="px-4 py-3 text-campus-inkSoft">{t.durationMinutes} min</td>
                  <td className="px-4 py-3"><Pill variant={t.isPublished ? 'green' : 'neutral'}>{t.isPublished ? 'Published' : 'Draft'}</Pill></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewingSubmissions(t)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-forest/10 hover:text-campus-forest" title="View submissions">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEdit(t)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-forest/10 hover:text-campus-forest">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(t)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red">
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
        <Modal title={editing ? 'Edit Test' : 'New Test'} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-md bg-campus-redSoft px-3 py-2 text-sm text-campus-red">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Title</label>
                <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Description</label>
                <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Duration (minutes)</label>
                <input type="number" min={1} required value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))} className={inputClass} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm text-campus-ink">
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
                  Publish (visible to students immediately)
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-campus-ink">Questions</h3>
                <Button type="button" variant="secondary" size="sm" onClick={addQuestion}><Plus size={14} /> Add question</Button>
              </div>

              {form.questions.map((q, qi) => (
                <div key={qi} className="rounded-md border border-campus-line bg-campus-paperDim/40 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-2 font-mono text-xs text-campus-inkSoft">Q{qi + 1}</span>
                    <div className="flex-1 space-y-3">
                      <input
                        required
                        placeholder="Question text"
                        value={q.text}
                        onChange={(e) => updateQuestion(qi, { text: e.target.value })}
                        className={inputClass}
                      />
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qi}`}
                              checked={q.correctOption === oi}
                              onChange={() => updateQuestion(qi, { correctOption: oi })}
                              title="Mark as correct answer"
                            />
                            <input
                              required
                              placeholder={`Option ${oi + 1}`}
                              value={opt}
                              onChange={(e) => updateOption(qi, oi, e.target.value)}
                              className={inputClass}
                            />
                            {q.options.length > 2 && (
                              <button type="button" onClick={() => removeOption(qi, oi)} className="text-campus-inkSoft hover:text-campus-red">
                                <X size={15} />
                              </button>
                            )}
                          </div>
                        ))}
                        {q.options.length < 6 && (
                          <button type="button" onClick={() => addOption(qi)} className="text-xs font-medium text-campus-forest hover:underline">
                            + Add option
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-campus-inkSoft">Marks</label>
                        <input
                          type="number"
                          min={1}
                          value={q.marks}
                          onChange={(e) => updateQuestion(qi, { marks: Number(e.target.value) })}
                          className="w-20 rounded-md border border-campus-line bg-white px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                    {form.questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(qi)} className="rounded p-1 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-campus-line pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create test'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {viewingSubmissions && (
        <SubmissionsModal test={viewingSubmissions} onClose={() => setViewingSubmissions(null)} />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this test?"
          message={`This removes "${deleteTarget.title}" and all student submissions for it. This cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          busy={deleting}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}

function SubmissionsModal({ test, onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestSubmissions(test._id).then(setSubmissions).finally(() => setLoading(false));
  }, [test._id]);

  return (
    <Modal title={`Submissions — ${test.title}`} onClose={onClose} wide>
      {loading ? (
        <p className="text-sm text-campus-inkSoft">Loading…</p>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-campus-inkSoft">No student has submitted this test yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-campus-line text-left text-xs uppercase tracking-wide text-campus-inkSoft">
              <th className="py-2 font-medium">Student</th>
              <th className="py-2 font-medium">Roll No.</th>
              <th className="py-2 font-medium">Score</th>
              <th className="py-2 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id} className="border-b border-campus-line/70 last:border-0">
                <td className="py-2 font-medium text-campus-ink">{s.student?.name}</td>
                <td className="py-2 font-mono text-xs text-campus-inkSoft">{s.student?.rollNumber}</td>
                <td className="py-2 text-campus-inkSoft">{s.score} / {s.totalMarks}</td>
                <td className="py-2 text-xs text-campus-inkSoft">{new Date(s.submittedAt).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  );
}
