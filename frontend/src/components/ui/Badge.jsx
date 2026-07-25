const roleStyles = {
  admin: { bg: 'bg-campus-adminSoft', text: 'text-campus-admin', stripe: 'bg-campus-admin' },
  teacher: { bg: 'bg-campus-teacherSoft', text: 'text-campus-teacher', stripe: 'bg-campus-teacher' },
  student: { bg: 'bg-campus-studentSoft', text: 'text-campus-student', stripe: 'bg-campus-student' },
};

const initials = (name = '') =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

// The signature element: an ID-card-style chip with a colored stripe, used for the
// logged-in user and anywhere a person's role needs to be legible at a glance.
export function IdCard({ name, role, subtitle, size = 'md' }) {
  const s = roleStyles[role] || roleStyles.student;
  const dims = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';
  return (
    <div className={`flex items-center gap-3 overflow-hidden rounded-md border border-campus-line bg-white/70 pr-3 shadow-card`}>
      <div className={`w-1.5 self-stretch ${s.stripe}`} />
      <div className={`flex ${dims} shrink-0 items-center justify-center rounded-full ${s.bg} font-mono font-semibold ${s.text}`}>
        {initials(name)}
      </div>
      <div className="py-1.5 leading-tight">
        <div className="text-sm font-medium text-campus-ink">{name}</div>
        <div className={`text-[11px] font-medium uppercase tracking-wide ${s.text}`}>
          {role}
          {subtitle ? <span className="text-campus-inkSoft"> · {subtitle}</span> : null}
        </div>
      </div>
    </div>
  );
}

// Small role tag for use inside tables/lists
export function RoleTag({ role }) {
  const s = roleStyles[role] || roleStyles.student;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${s.bg} ${s.text}`}>{role}</span>
  );
}

// Generic status pill (Paid/Pending, Active/Inactive, Present/Absent, etc.)
const pillVariants = {
  green: 'bg-campus-greenSoft text-campus-green',
  red: 'bg-campus-redSoft text-campus-red',
  gold: 'bg-campus-goldSoft text-[#8A6A1E]',
  neutral: 'bg-campus-paperDim text-campus-inkSoft',
};

export function Pill({ children, variant = 'neutral' }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${pillVariants[variant]}`}>{children}</span>;
}
