import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  FolderOpen,
  CalendarClock,
  Megaphone,
  Inbox,
  Video,
  Image,
  X,
} from 'lucide-react';

const navByRole = {
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'People', icon: Users },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    // Teacher tools — admin managed
    { to: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
    { to: '/admin/tests', label: 'Tests', icon: FileQuestion },
    { to: '/admin/marks', label: 'Marks', icon: GraduationCap },
    { to: '/admin/materials', label: 'Materials', icon: FolderOpen },
    { to: '/admin/videos', label: 'Course Videos', icon: Video },
    { to: '/admin/timetable', label: 'Timetable', icon: CalendarClock },
    { to: '/admin/gallery', label: 'Gallery', icon: Image },
    { to: '/admin/notices', label: 'Notices', icon: Megaphone },
    { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  ],
  student: [
    { to: '/student', label: 'My Courses', icon: LayoutDashboard, end: true },
    { to: '/student/videos', label: 'Video Lectures', icon: Video },
    { to: '/student/attendance', label: 'Attendance', icon: ClipboardCheck },
    { to: '/student/tests', label: 'Tests', icon: FileQuestion },
    { to: '/student/marks', label: 'Report Card', icon: GraduationCap },
    { to: '/student/materials', label: 'Materials', icon: FolderOpen },
    { to: '/student/timetable', label: 'Timetable', icon: CalendarClock },
    { to: '/student/notices', label: 'Notices', icon: Megaphone },
  ],
};

export default function Sidebar({ role, mobileOpen, onMobileClose }) {
  const items = navByRole[role] || [];

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-campus-gold font-display text-sm font-semibold text-campus-goldSoft">
          SJ
        </div>
        <div className="leading-tight">
          <div className="font-display text-lg font-semibold leading-tight text-white">Student Junction</div>
          <div className="text-[11px] uppercase tracking-wider text-campus-paper/50">Institute Portal</div>
        </div>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-campus-gold to-campus-goldLight text-campus-forest shadow-sm'
                  : 'text-campus-paper/70 hover:bg-white/10 hover:text-campus-paper'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-[11px] text-campus-paper/40">
        Student Junction v1.0
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:h-full md:w-60 md:shrink-0 bg-gradient-to-b from-campus-forest to-campus-forestDark text-campus-paper">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in" onClick={onMobileClose}>
          <div className="absolute inset-0 bg-campus-ink/50" />
          <aside
            className="relative flex h-full w-64 flex-col bg-gradient-to-b from-campus-forest to-campus-forestDark text-campus-paper animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end px-4 pt-4">
              <button
                onClick={onMobileClose}
                className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

