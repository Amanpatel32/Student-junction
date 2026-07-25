import { useEffect, useState } from 'react';
import { Plus, Trash2, Megaphone } from 'lucide-react';
import { fetchNotices, createNotice, deleteNotice } from '../../api/notices';
import { fetchCourses } from '../../api/courses';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';

export default function TeacherNotices() {
  const [notices, setNotices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', course: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  const load = () => {
    setLoading(true);
    Promise.all([fetchNotices(), fetchCourses()])
      .then(([n, c]) => {
        setNotices(n);
        setCourses(c);
        setForm((f) => ({ ...f, course: f.course || c[0]?._id || '' }));
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
      await createNotice(form);
      toast('Notice posted');
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post this notice');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotice(id);
      toast('Notice removed');
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not remove notice', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-campus-inkSoft">Institute announcements + notices for your courses</p>
        <Button onClick={() => { setError(''); setModalOpen(true); }} disabled={courses.length === 0}><Plus size={16} /> Post Notice</Button>
      </div>

      {loading ? (
        <div className="px-6 py-16 text-center text-sm text-campus-inkSoft">Loading…</div>
      ) : notices.length === 0 ? (
        <EmptyState icon={Megaphone} title="No notices yet" description="Post something for your students — it'll show on their dashboard." />
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n._id} className="rounded-lg border border-campus-line bg-white/50 p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-campus-ink">{n.title}</h3>
                    <Pill variant={n.course ? 'gold' : 'neutral'}>{n.course ? `${n.course.title}` : 'Institute-wide'}</Pill>
                  </div>
                  <p className="mt-1 text-sm text-campus-inkSoft">{n.message}</p>
                  <p className="mt-2 text-xs text-campus-inkSoft">
                    {n.postedBy?.name} · {new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                {n.postedBy?._id === user?._id && (
                  <button onClick={() => handleDelete(n._id)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title="Post Notice" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-campus-redSoft px-3 py-2 text-sm text-campus-red">{error}</div>}
            <div>
              <label className={labelClass}>Title</label>
              <input required value={form.title} onChange={set('title')} className={inputClass} placeholder="e.g. Test on Monday" />
            </div>
            <div>
              <label className={labelClass}>Message</label>
              <textarea required value={form.message} onChange={set('message')} rows={3} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Course</label>
              <select value={form.course} onChange={set('course')} className={inputClass}>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.title} ({c.code})</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 border-t border-campus-line pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Posting…' : 'Post notice'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
