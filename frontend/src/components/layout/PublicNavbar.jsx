import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PublicNavbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/#classes', label: 'Classes' },
    { href: '/#facilities', label: 'Facilities' },
    { href: '/#platform', label: 'Online Portal' },
    { href: '/#enquiry', label: 'Admissions' },
    { href: 'tel:9708181437', label: '9708181437', icon: Phone, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-campus-forest/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-campus-gold font-display text-sm font-semibold text-campus-goldSoft transition group-hover:bg-campus-gold group-hover:text-campus-forest">
            SJ
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-white">Student Junction</div>
            <div className="text-[10px] uppercase tracking-wider text-white/60">A Coaching Center, Jagdishpur</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`transition hover:text-white ${
                  link.highlight
                    ? 'flex items-center gap-1.5 rounded-full border border-campus-gold/40 px-3 py-1 text-campus-goldSoft hover:bg-campus-gold/10 hover:text-campus-gold'
                    : ''
                }`}
              >
                {Icon && <Icon size={14} />}
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link
              to={`/${user.role}`}
              className="rounded-md bg-campus-gold px-4 py-2 text-sm font-medium text-campus-forest transition hover:bg-campus-goldLight shadow-lg shadow-campus-gold/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-campus-gold px-5 py-2 text-sm font-medium text-campus-forest transition hover:bg-campus-goldLight shadow-lg shadow-campus-gold/20"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-white/80 hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-white/10 bg-campus-forestDark/95 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                    link.highlight
                      ? 'text-campus-goldSoft hover:bg-campus-gold/10'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {Icon && <Icon size={15} />}
                  {link.label}
                </a>
              );
            })}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
              {user ? (
                <Link
                  to={`/${user.role}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md bg-campus-gold px-4 py-2.5 text-center text-sm font-medium text-campus-forest"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md border border-white/30 px-4 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md bg-campus-gold px-4 py-2.5 text-center text-sm font-medium text-campus-forest"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

