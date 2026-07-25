import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Users as UsersIcon, UserCheck, UserX, Clock } from 'lucide-react';
import { fetchUsers, updateUser, deleteUser } from '../../api/users';
import { registerUser } from '../../api/auth';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { RoleTag, Pill } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  phone: '',
  rollNumber: '',
  batch: '',
  guardianName: '',
  guardianPhone: '',
  employeeId: '',
  subject: '',
  status: 'Active',
  approvalStatus: 'Approved',
};

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [actioningId, setActioningId] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    fetchUsers({ role: roleFilter || undefined, approvalStatus: approvalFilter || undefined, search: search || undefined })
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  const loadPendingCount = () => {
    fetchUsers({ role: 'student', approvalStatus: 'Pending' }).then((data) => setPendingCount(data.length));
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [roleFilter, approvalFilter, search]);

  useEffect(loadPendingCount, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ ...emptyForm, ...u, password: '' });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await updateUser(editing._id, form);
        toast('Account updated');
      } else {
        await registerUser(form);
        toast('Account created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this account');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(deleteTarget._id);
      toast(`Removed ${deleteTarget.name}`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not remove this account', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleApprove = async (u) => {
    setActioningId(u._id);
    try {
      await updateUser(u._id, { approvalStatus: 'Approved' });
      toast(`${u.name} approved — they can now log in`);
      load();
      loadPendingCount();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not approve this account', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (u) => {
    setActioningId(u._id);
    try {
      await updateUser(u._id, { approvalStatus: 'Rejected' });
      toast(`${u.name} rejected`);
      load();
      loadPendingCount();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not reject this account', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const inputClass = 'w-full rounded-md border border-campus-line bg-white px-3 py-2 text-sm focus:border-campus-forest focus:outline-none';
  const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wide text-campus-inkSoft';

  return (
    <div className="space-y-5">
      {pendingCount > 0 && (
        <div className="flex items-center justify-between rounded-md bg-campus-goldSoft px-4 py-3 text-sm text-[#8A6A1E]">
          <span className="flex items-center gap-2 font-medium">
            <Clock size={16} /> {pendingCount} student{pendingCount === 1 ? '' : 's'} awaiting approval
          </span>
          <button
            onClick={() => { setRoleFilter('student'); setApprovalFilter('Pending'); }}
            className="rounded-md border border-[#8A6A1E]/30 px-3 py-1 text-xs font-medium hover:bg-white/40"
          >
            Review now
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-campus-inkSoft" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, roll no…"
              className="w-72 rounded-md border border-campus-line bg-white py-2 pl-9 pr-3 text-sm focus:border-campus-forest focus:outline-none"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={inputClass}>
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <select value={approvalFilter} onChange={(e) => setApprovalFilter(e.target.value)} className={inputClass}>
            <option value="">All approval states</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} /> Add Person
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-campus-line bg-white/40">
        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-campus-inkSoft">Loading…</div>
        ) : users.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No people found" description="Add a teacher or student to get started." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-campus-line text-left text-xs uppercase tracking-wide text-campus-inkSoft">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">ID / Batch</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Approval</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-campus-line/70 last:border-0 hover:bg-campus-paperDim/60">
                  <td className="px-4 py-3 font-medium text-campus-ink">{u.name}</td>
                  <td className="px-4 py-3"><RoleTag role={u.role} /></td>
                  <td className="px-4 py-3 text-campus-inkSoft">
                    {u.role === 'student' && (
                      <>
                        <span className="font-mono text-xs">{u.rollNumber}</span>
                        {u.batch && <span> · {u.batch}</span>}
                      </>
                    )}
                    {u.role === 'teacher' && (
                      <>
                        <span className="font-mono text-xs">{u.employeeId}</span>
                        {u.subject && <span> · {u.subject}</span>}
                      </>
                    )}
                    {u.role === 'admin' && '—'}
                  </td>
                  <td className="px-4 py-3 text-campus-inkSoft">{u.email}</td>
                  <td className="px-4 py-3">
                    <Pill variant={u.status === 'Active' ? 'green' : 'neutral'}>{u.status}</Pill>
                  </td>
                  <td className="px-4 py-3">
                    <Pill variant={u.approvalStatus === 'Approved' ? 'green' : u.approvalStatus === 'Rejected' ? 'red' : 'gold'}>
                      {u.approvalStatus}
                    </Pill>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {u.approvalStatus === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(u)}
                            disabled={actioningId === u._id}
                            className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-green/10 hover:text-campus-green disabled:opacity-50"
                            title="Approve"
                          >
                            <UserCheck size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(u)}
                            disabled={actioningId === u._id}
                            className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red disabled:opacity-50"
                            title="Reject"
                          >
                            <UserX size={16} />
                          </button>
                        </>
                      )}
                      <button onClick={() => openEdit(u)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-forest/10 hover:text-campus-forest">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(u)} className="rounded p-1.5 text-campus-inkSoft hover:bg-campus-red/10 hover:text-campus-red">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Person' : 'Add Person'} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-campus-redSoft px-3 py-2 text-sm text-campus-red">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Role</label>
                <select value={form.role} onChange={set('role')} className={inputClass} disabled={Boolean(editing)}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Full name</label>
                <input required value={form.name} onChange={set('name')} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input required type="email" value={form.email} onChange={set('email')} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <input value={form.phone} onChange={set('phone')} className={inputClass} />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>{editing ? 'New password (leave blank to keep current)' : 'Password'}</label>
                <input
                  type="password"
                  required={!editing}
                  minLength={6}
                  value={form.password}
                  onChange={set('password')}
                  className={inputClass}
                  placeholder={editing ? '••••••••' : 'At least 6 characters'}
                />
              </div>

              {form.role === 'student' && (
                <>
                  <div>
                    <label className={labelClass}>Roll number</label>
                    <input required value={form.rollNumber} onChange={set('rollNumber')} className={inputClass} placeholder="e.g. BCA-2026-041" />
                  </div>
                  <div>
                    <label className={labelClass}>Batch / Section</label>
                    <input required value={form.batch} onChange={set('batch')} className={inputClass} placeholder="e.g. Class VII" />
                  </div>
                  <div>
                    <label className={labelClass}>Guardian name</label>
                    <input value={form.guardianName} onChange={set('guardianName')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Guardian phone</label>
                    <input value={form.guardianPhone} onChange={set('guardianPhone')} className={inputClass} />
                  </div>
                </>
              )}

              {form.role === 'teacher' && (
                <>
                  <div>
                    <label className={labelClass}>Employee ID</label>
                    <input required value={form.employeeId} onChange={set('employeeId')} className={inputClass} placeholder="e.g. EMP-004" />
                  </div>
                  <div>
                    <label className={labelClass}>Subject</label>
                    <input value={form.subject} onChange={set('subject')} className={inputClass} placeholder="e.g. Mathematics" />
                  </div>
                </>
              )}

              {editing && (
                <>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select value={form.status} onChange={set('status')} className={inputClass}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Approval</label>
                    <select value={form.approvalStatus} onChange={set('approvalStatus')} className={inputClass}>
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-campus-line pt-4">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create account'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Remove this account?"
          message={`This permanently removes ${deleteTarget.name} (${deleteTarget.role}). This cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          busy={deleting}
          confirmLabel="Remove"
        />
      )}
    </div>
  );
}
