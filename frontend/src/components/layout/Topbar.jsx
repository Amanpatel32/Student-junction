import { LogOut, Menu } from 'lucide-react';
import { IdCard } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-campus-line bg-white/80 backdrop-blur-sm px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-campus-inkSoft hover:bg-campus-paperDim md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-xl font-semibold text-campus-ink sm:text-2xl">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {user && <IdCard name={user.name} role={user.role} subtitle={user.rollNumber || user.subject || user.email} />}
        <button
          onClick={logout}
          aria-label="Log out"
          className="rounded-lg border border-campus-line p-2.5 text-campus-inkSoft transition hover:bg-campus-redSoft hover:text-campus-red hover:border-campus-red/30"
          title="Log out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}

