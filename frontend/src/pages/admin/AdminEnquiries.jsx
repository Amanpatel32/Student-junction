import { useEffect, useState } from 'react';
import { Inbox, Phone, Trash2 } from 'lucide-react';
import { fetchEnquiries, updateEnquiry, deleteEnquiry } from '../../api/enquiries';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

const statusVariant = { New: 'gold', Contacted: 'neutral', Enrolled: 'green', Closed: 'neutral' };

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    fetchEnquiries().then(setEnquiries).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnquiry(id, { status });
      toast('Status updated');
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEnquiry(id);
      toast('Enquiry removed');
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not remove enquiry', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-campus-inkSoft">Admission enquiries submitted from the public website</p>

      {loading ? (
        <div className="px-6 py-16 text-center text-sm text-campus-inkSoft">Loading…</div>
      ) : enquiries.length === 0 ? (
        <EmptyState icon={Inbox} title="No enquiries yet" description="Enquiries submitted from the landing page will show up here." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-campus-line bg-white/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-campus-line text-left text-xs uppercase tracking-wide text-campus-inkSoft">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e._id} className="border-b border-campus-line/70 last:border-0 hover:bg-campus-paperDim/60">
                  <td className="px-4 py-3 font-medium text-campus-ink">{e.name}</td>
                  <td className="px-4 py-3 text-campus-inkSoft">
                    <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 hover:text-campus-forest">
                      <Phone size={13} /> {e.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-campus-inkSoft">{e.classInterested || '—'}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-campus-inkSoft" title={e.message}>{e.message || '—'}</td>
                  <td className="px-4 py-3 text-xs text-campus-inkSoft">{new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  <td className="px-4 py-3">
                    <select
                      value={e.status}
                      onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                      className="rounded-md border border-campus-line bg-white px-2 py-1 text-xs focus:border-campus-forest focus:outline-none"
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Enrolled</option>
                      <option>Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Pill variant={statusVariant[e.status]}>{e.status}</Pill>
                      <button onClick={() => handleDelete(e._id)} className="ml-2 rounded p-1.5 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
