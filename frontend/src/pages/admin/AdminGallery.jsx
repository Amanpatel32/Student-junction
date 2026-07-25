import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Eye, EyeOff, Image, Upload, X } from 'lucide-react';
import { fetchAllGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem, toggleGalleryItem } from '../../api/gallery';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { Skeleton } from '../../components/ui/Skeleton';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ caption: '', eventName: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    fetchAllGallery().then(setItems).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const imgUrl = (path) => `${BASE_URL}${path || ''}`;

  const openAdd = () => {
    setEditing(null);
    setForm({ caption: '', eventName: '' });
    setFile(null);
    setPreview(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ caption: item.caption || '', eventName: item.eventName || '' });
    setFile(null);
    setPreview(null);
    setError('');
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('caption', form.caption);
      formData.append('eventName', form.eventName);
      if (file) formData.append('image', file);

      if (editing) {
        await updateGalleryItem(editing._id, formData);
        toast('Gallery item updated');
      } else {
        if (!file) {
          setError('Please select an image');
          setSaving(false);
          return;
        }
        await createGalleryItem(formData);
        toast('Gallery item added');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save gallery item');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteGalleryItem(deleteTarget._id);
      toast('Gallery item removed');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not delete item', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleGalleryItem(id);
      toast('Visibility toggled');
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not toggle', 'error');
    }
  };

  const inputClass = 'w-full rounded-lg border border-campus-line bg-white px-4 py-3 text-sm transition focus:border-campus-forest focus:ring-2 focus:ring-campus-forest/20 focus:outline-none';
  const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-campus-inkSoft';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-campus-inkSoft">
          {items.length} photo{items.length === 1 ? '' : 's'} in gallery
        </p>
        <Button onClick={openAdd}><Plus size={16} /> Add Photo</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-campus-line overflow-hidden">
              <Skeleton height={200} />
              <div className="p-3 space-y-2">
                <Skeleton height={14} width="80%" />
                <Skeleton height={12} width="60%" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Image}
          title="No gallery photos yet"
          description="Upload photos of your students, events, and campus to showcase on the website."
          action={<Button onClick={openAdd}><Plus size={16} /> Upload First Photo</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-xl border border-campus-line bg-white shadow-card card-lift"
            >
              <div
                className="aspect-[4/3] cursor-pointer overflow-hidden bg-campus-paperDim"
                onClick={() => setViewImage(item)}
              >
                <img
                  src={imgUrl(item.image)}
                  alt={item.caption || 'Gallery photo'}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {item.eventName && (
                      <p className="text-xs font-semibold text-campus-forest truncate">{item.eventName}</p>
                    )}
                    {item.caption && (
                      <p className="text-xs text-campus-inkSoft mt-0.5 line-clamp-2">{item.caption}</p>
                    )}
                    <p className="text-[10px] text-campus-inkSoft/60 mt-1">
                      {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <Pill variant={item.isActive ? 'green' : 'neutral'}>
                    {item.isActive ? 'Visible' : 'Hidden'}
                  </Pill>
                </div>
                <div className="mt-2 flex items-center justify-end gap-1 border-t border-campus-line pt-2">
                  <button
                    onClick={() => handleToggle(item._id)}
                    className="rounded p-1 text-campus-inkSoft hover:bg-campus-paperDim hover:text-campus-forest"
                    title={item.isActive ? 'Hide from website' : 'Show on website'}
                  >
                    {item.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded p-1 text-campus-inkSoft hover:bg-campus-paperDim hover:text-campus-forest"
                    title="Edit"
                  >
                    <Upload size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="rounded p-1 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
            </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Photo' : 'Add Photo to Gallery'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-lg bg-campus-redSoft px-4 py-3 text-sm text-campus-red border border-campus-red/20">{error}</div>}
            <div>
              <label className={labelClass}>Photo</label>
              {(preview || (editing && !file)) && (
                <div className="relative mb-3 rounded-lg overflow-hidden">
                  <img
                    src={preview || imgUrl(editing.image)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-dashed border-campus-line bg-white px-4 py-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-campus-forest file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-campus-forestLight"
              />
            </div>
            <div>
              <label className={labelClass}>Event / Activity name</label>
              <input
                value={form.eventName}
                onChange={(e) => setForm((f) => ({ ...f, eventName: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Annual Day 2025, Science Exhibition"
              />
            </div>
            <div>
              <label className={labelClass}>Caption (optional)</label>
              <textarea
                value={form.caption}
                onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                rows={2}
                className={inputClass}
                placeholder="A brief description of this photo"
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-campus-line pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add to gallery'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {viewImage && (
        <Modal title={viewImage.eventName || 'Gallery Photo'} onClose={() => setViewImage(null)} wide>
          <div className="flex flex-col items-center">
            <img
              src={imgUrl(viewImage.image)}
              alt={viewImage.caption || 'Gallery photo'}
              className="max-h-[60vh] w-full rounded-lg object-contain bg-campus-paperDim"
            />
            {viewImage.caption && (
              <p className="mt-4 text-sm text-campus-inkSoft text-center max-w-lg">{viewImage.caption}</p>
            )}
            {viewImage.uploadedBy?.name && (
              <p className="mt-2 text-xs text-campus-inkSoft/60">
                Uploaded by {viewImage.uploadedBy.name} · {new Date(viewImage.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this photo?"
          message={`This permanently removes "${deleteTarget.eventName || deleteTarget.caption || 'this photo'}" from the gallery.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          busy={deleting}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
