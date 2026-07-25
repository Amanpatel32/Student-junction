import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(`/${user.role}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-campus-forest via-campus-forestDark to-campus-forestLight px-4 py-10">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-campus-forestLight/20 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-campus-gold/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={15} />
          Back to home
        </Link>

        <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-xl shadow-black/10 border border-white/20">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-campus-forest to-campus-forestLight shadow-lg">
              <GraduationCap size={30} className="text-campus-goldSoft" />
            </div>
            <h1 className="font-display text-2xl font-bold text-campus-ink">Welcome Back</h1>
            <p className="mt-1.5 text-sm text-campus-inkSoft">Sign in to your institute portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-campus-redSoft px-4 py-3 text-sm text-campus-red border border-campus-red/20 animate-scale-in">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-campus-inkSoft">
                <Mail size={13} className="inline mr-1" />
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-campus-inkSoft" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-campus-line bg-white py-3 pl-10 pr-4 text-sm transition focus:border-campus-forest focus:ring-2 focus:ring-campus-forest/20 focus:outline-none"
                  placeholder="you@institute.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-campus-inkSoft">
                <Lock size={13} className="inline mr-1" />
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-campus-inkSoft" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-campus-line bg-white py-3 pl-10 pr-10 text-sm transition focus:border-campus-forest focus:ring-2 focus:ring-campus-forest/20 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-campus-inkSoft hover:text-campus-ink"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 space-y-2 border-t border-campus-line pt-6">
            <p className="text-center text-xs text-campus-inkSoft">
              New student?{' '}
              <Link to="/register" className="font-medium text-campus-forest hover:text-campus-forestLight transition-colors">
                Create an account
              </Link>
            </p>
            <p className="text-center text-xs text-campus-inkSoft">
              Teacher or admin accounts are created by your institute administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

