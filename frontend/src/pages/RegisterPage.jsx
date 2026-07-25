import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, CheckCircle2, ArrowLeft, User, Mail, Lock, Phone, BookOpen } from 'lucide-react';
import * as authApi from '../api/auth';
import Button from '../components/ui/Button';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  rollNumber: '',
  batch: '',
  guardianName: '',
  guardianPhone: '',
};

const inputClass = 'w-full rounded-lg border border-campus-line bg-white px-4 py-3 text-sm transition focus:border-campus-forest focus:ring-2 focus:ring-campus-forest/20 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-campus-inkSoft';

export default function RegisterPage() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.registerStudent(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-campus-forest via-campus-forestDark to-campus-forestLight px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-campus-forestLight/20 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-campus-gold/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-white/20 text-center animate-scale-in">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-campus-greenSoft to-campus-green">
            <CheckCircle2 size={32} className="text-campus-green" />
          </div>
          <h1 className="font-display text-2xl font-bold text-campus-ink">Registration received</h1>
          <p className="mt-3 text-sm text-campus-inkSoft leading-relaxed">
            An administrator will review your details and approve your account. You'll be able to log in once that's done.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-campus-forest to-campus-forestLight px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-campus-forest via-campus-forestDark to-campus-forestLight px-4 py-10">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-40 w-40 rounded-full bg-campus-forestLight/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-campus-gold/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative w-full max-w-lg animate-fade-in-up">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={15} />
          Back to home
        </Link>

        <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-campus-forest to-campus-forestLight shadow-lg">
              <GraduationCap size={30} className="text-campus-goldSoft" />
            </div>
            <h1 className="font-display text-2xl font-bold text-campus-ink">Student Registration</h1>
            <p className="mt-1.5 text-sm text-campus-inkSoft">
              Create an account — an admin will approve it before you can sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-campus-redSoft px-4 py-3 text-sm text-campus-red border border-campus-red/20 animate-scale-in">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>
                  <User size={13} className="inline mr-1" />
                  Full name
                </label>
                <input required value={form.name} onChange={set('name')} className={inputClass} placeholder="Enter your full name" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>
                  <Mail size={13} className="inline mr-1" />
                  Email
                </label>
                <input required type="email" value={form.email} onChange={set('email')} className={inputClass} placeholder="you@example.com" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>
                  <Lock size={13} className="inline mr-1" />
                  Password
                </label>
                <input required type="password" minLength={6} value={form.password} onChange={set('password')} className={inputClass} placeholder="At least 6 characters" />
              </div>
              <div>
                <label className={labelClass}>
                  <Phone size={13} className="inline mr-1" />
                  Phone
                </label>
                <input value={form.phone} onChange={set('phone')} className={inputClass} placeholder="Mobile number" />
              </div>
              <div>
                <label className={labelClass}>Roll number</label>
                <input value={form.rollNumber} onChange={set('rollNumber')} className={inputClass} placeholder="If known" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>
                  <BookOpen size={13} className="inline mr-1" />
                  Class you're joining
                </label>
                <input value={form.batch} onChange={set('batch')} className={inputClass} placeholder="e.g. Class VII" />
              </div>
              <div>
                <label className={labelClass}>Guardian name</label>
                <input value={form.guardianName} onChange={set('guardianName')} className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Guardian phone</label>
                <input value={form.guardianPhone} onChange={set('guardianPhone')} className={inputClass} placeholder="Optional" />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Submitting…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-campus-inkSoft">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-campus-forest hover:text-campus-forestLight transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

