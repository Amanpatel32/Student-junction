import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, FolderOpen, ExternalLink, Video, FileText, Link2, UploadCloud } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchCourseMaterials, createMaterial, uploadMaterial, deleteMaterial } from '../../api/materials';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

const emptyForm = { title: '', description: '', link: '' };

const typeIcon = { Video, Document: FileText, Link: Link2 };

export default function MaterialManager() {
  const [courseId, setCourseId] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState('link'); // 'link' | 'upload'
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const load = () => {
    if (!courseId) return;
    setLoading(true);
    fetchCourseMaterials(courseId).then(setMaterials).finally(() => setLoading(false));
  };

  useEffect(load, [courseId]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const inputClass = 'w-full rounded-md border border-campus-line bg-white px-3 py-2 text-sm focus:border-campus-forest focus:outline-none';
  const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wide text-campus-inkSoft';

  const openAdd = () => {
    setForm(emptyForm);
    setFile(null);
    setProgress(0);
    setMode('link');
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (mode === 'link') {
        await createMaterial({ ...form, course: courseId });
      } else {
        if (!file) {
          setError('Choose a file to upload');
          setSaving(false);
          return;
        }
        const data = new FormData();
        data.append('course', courseId);
        data.append('title', form.title);
        data.append('description', form.description);
        data.append('file', file);
        await uploadMaterial(data, setProgress);
      }
      toast(mode === 'link' ? 'Material added' : 'Upload complete');
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this material');
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteMaterial(deleteTarget._id);
      toast('Material removed');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not remove material', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CourseSelect value={courseId} onChange={setCourseId} />
        <Button onClick={openAdd} disabled={!courseId}><Plus size={16} /> Add Material</Button>
      </div>

      {loading ? (
        <div className="px-6 py-16 text-center text-sm text-campus-inkSoft">Loading…</div>
      ) : !courseId || materials.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No materials yet" description="Upload a video lecture, a document, or link to notes — students will see it instantly." />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {materials.map((m) => {
            const Icon = typeIcon[m.type] || Link2;
            return (
              <div key={m._id} className="flex items-start justify-between rounded-lg border border-campus-line bg-white/50 p-4 shadow-card">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-campus-ink">{m.title}</h3>
                    <Pill variant={m.type === 'Video' ? 'gold' : 'neutral'}>{m.type}</Pill>
                  </div>
                  {m.description && <p className="mt-1 text-sm text-campus-inkSoft">{m.description}</p>}
                  <a href={m.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-campus-forest hover:underline">
                    <Icon size={12} /> {m.type === 'Link' ? 'Open link' : m.type === 'Video' ? 'Watch video' : 'Open document'} <ExternalLink size={11} />
                  </a>
                </div>
                <button onClick={() => setDeleteTarget(m)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <Modal title="Add Material" onClose={() => setModalOpen(false)}>
          <div className="mb-4 flex gap-2 rounded-md bg-campus-paperDim p-1">
            <button
              type="button"
              onClick={() => setMode('link')}
              className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition ${mode === 'link' ? 'bg-white shadow-sm text-campus-ink' : 'text-campus-inkSoft'}`}
            >
              <Link2 size={14} className="mr-1 inline" /> External link
            </button>
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition ${mode === 'upload' ? 'bg-white shadow-sm text-campus-ink' : 'text-campus-inkSoft'}`}
            >
              <UploadCloud size={14} className="mr-1 inline" /> Upload video / file
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-campus-redSoft px-3 py-2 text-sm text-campus-red">{error}</div>}
            <div>
              <label className={labelClass}>Title</label>
              <input required value={form.title} onChange={set('title')} className={inputClass} placeholder="e.g. Chapter 4 — Fractions (Video Lecture)" />
            </div>
            <div>
              <label className={labelClass}>Description (optional)</label>
              <input value={form.description} onChange={set('description')} className={inputClass} />
            </div>

            {mode === 'link' ? (
              <div>
                <label className={labelClass}>Link (YouTube, Drive, PDF, etc.)</label>
                <input required type="url" value={form.link} onChange={set('link')} className={inputClass} placeholder="https://…" />
              </div>
            ) : (
              <div>
                <label className={labelClass}>File (video, PDF, image, or document — up to 300MB)</label>
                <input
                  ref={fileInputRef}
                  required
                  type="file"
                  accept="video/*,application/pdf,image/*,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  className="w-full rounded-md border border-dashed border-campus-line bg-white px-3 py-2.5 text-sm"
                />
                {saving && progress > 0 && (
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-campus-paperDim">
                    <div className="h-full bg-campus-forest transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-campus-line pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? (mode === 'upload' ? `Uploading… ${progress}%` : 'Saving…') : 'Add material'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Remove this material?"
          message={`This removes "${deleteTarget.title}" for all enrolled students.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          busy={deleting}
          confirmLabel="Remove"
        />
      )}
    </div>
  );
}
