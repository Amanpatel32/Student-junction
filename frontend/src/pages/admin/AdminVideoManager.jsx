import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Video, ExternalLink, Link2, UploadCloud, Film } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchCourseMaterials, createMaterial, uploadMaterial, deleteMaterial } from '../../api/materials';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

const emptyForm = { title: '', description: '', link: '' };

export default function AdminVideoManager() {
  const [courseId, setCourseId] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState('link');
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
        toast('Video material added');
      } else {
        if (!file) {
          setError('Choose a video file to upload');
          setSaving(false);
          return;
        }
        const data = new FormData();
        data.append('course', courseId);
        data.append('title', form.title);
        data.append('description', form.description);
        data.append('file', file);
        await uploadMaterial(data, setProgress);
        toast('Video uploaded successfully');
      }
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
      toast('Video material removed');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not remove material', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const videoMaterials = materials.filter((m) => m.type === 'Video');
  const linkMaterials = materials.filter((m) => m.type !== 'Video');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CourseSelect value={courseId} onChange={setCourseId} />
        <Button onClick={openAdd} disabled={!courseId}>
          <Plus size={16} /> Add Video / Link
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-campus-inkSoft">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading course materials…
          </div>
        </div>
      ) : !courseId ? (
        <EmptyState icon={Film} title="Select a course" description="Choose a course above to manage its video content." />
      ) : materials.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No videos yet"
          description="Upload lecture videos or add YouTube/Drive links for this course. Students will see them instantly."
          action={
            <Button size="sm" onClick={openAdd}>
              <Plus size={14} /> Add First Video
            </Button>
          }
        />
      ) : (
        <>
          {/* Video Section */}
          {videoMaterials.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-campus-ink">
                <Video size={20} className="text-campus-forest" />
                Video Lectures
                <span className="text-sm font-normal text-campus-inkSoft">({videoMaterials.length})</span>
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {videoMaterials.map((m) => (
                  <div
                    key={m._id}
                    className="group overflow-hidden rounded-xl border border-campus-line bg-white shadow-card card-lift"
                  >
                    <div className="relative aspect-video bg-black">
                      <video
                        src={m.link}
                        controls
                        preload="metadata"
                        className="h-full w-full object-cover"
                        playsInline
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="truncate font-semibold text-campus-ink">{m.title}</h4>
                            <Pill variant="gold">Video</Pill>
                          </div>
                          {m.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-campus-inkSoft">{m.description}</p>
                          )}
                          <p className="mt-2 text-xs text-campus-inkSoft">
                            Added {new Date(m.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <button
                          onClick={() => setDeleteTarget(m)}
                          className="shrink-0 rounded p-1.5 text-campus-inkSoft transition hover:bg-campus-red/10 hover:text-campus-red"
                          title="Remove"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link/PDF Section */}
          {linkMaterials.length > 0 && (
            <div>
              <h3 className="mt-8 mb-4 flex items-center gap-2 font-display text-xl font-semibold text-campus-ink">
                <Link2 size={20} className="text-campus-forest" />
                Study Materials & Links
                <span className="text-sm font-normal text-campus-inkSoft">({linkMaterials.length})</span>
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {linkMaterials.map((m) => (
                  <div
                    key={m._id}
                    className="card-lift flex items-start justify-between rounded-lg border border-campus-line bg-white/50 p-4 shadow-card"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-medium text-campus-ink">{m.title}</h4>
                        <Pill variant="neutral">{m.type}</Pill>
                      </div>
                      {m.description && <p className="mt-1 line-clamp-1 text-sm text-campus-inkSoft">{m.description}</p>}
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-campus-forest transition hover:text-campus-forestLight"
                      >
                        {m.type === 'Document' ? 'Download document' : 'Open link'}
                        <ExternalLink size={11} />
                      </a>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(m)}
                      className="ml-3 shrink-0 rounded p-1.5 text-campus-inkSoft transition hover:bg-campus-red/10 hover:text-campus-red"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <Modal title="Add Video or Material" onClose={() => setModalOpen(false)}>
          <div className="mb-4 flex gap-2 rounded-md bg-campus-paperDim p-1">
            <button
              type="button"
              onClick={() => setMode('link')}
              className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition ${
                mode === 'link' ? 'bg-white text-campus-ink shadow-sm' : 'text-campus-inkSoft'
              }`}
            >
              <Link2 size={14} className="mr-1 inline" /> YouTube / Drive Link
            </button>
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition ${
                mode === 'upload' ? 'bg-white text-campus-ink shadow-sm' : 'text-campus-inkSoft'
              }`}
            >
              <UploadCloud size={14} className="mr-1 inline" /> Upload Video
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-campus-redSoft px-3 py-2 text-sm text-campus-red">{error}</div>}
            <div>
              <label className={labelClass}>Title</label>
              <input
                required
                value={form.title}
                onChange={set('title')}
                className={inputClass}
                placeholder="e.g. Chapter 5 — Algebra (Lecture Video)"
              />
            </div>
            <div>
              <label className={labelClass}>Description (optional)</label>
              <input value={form.description} onChange={set('description')} className={inputClass} />
            </div>

            {mode === 'link' ? (
              <div>
                <label className={labelClass}>Video Link (YouTube, Google Drive, etc.)</label>
                <input
                  required
                  type="url"
                  value={form.link}
                  onChange={set('link')}
                  className={inputClass}
                  placeholder="https://youtube.com/watch?v=…"
                />
              </div>
            ) : (
              <div>
                <label className={labelClass}>Upload Video File (up to 300MB)</label>
                <input
                  ref={fileInputRef}
                  required
                  type="file"
                  accept="video/*"
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
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (mode === 'upload' ? `Uploading… ${progress}%` : 'Saving…') : 'Add to Course'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Remove this video/material?"
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
