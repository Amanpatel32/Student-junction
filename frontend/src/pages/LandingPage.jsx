import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  FileQuestion,
  Video,
  FolderOpen,
  BarChart3,
  Phone,
  MapPin,
  CheckCircle2,
  Award,
  Star,
  ChevronRight,
  BookOpen,
  CalendarClock,
  TrendingUp,
  Sparkles,
  Image,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import { submitEnquiry } from '../api/enquiries';
import { fetchGallery } from '../api/gallery';
import AnimatedCounter from '../components/ui/AnimatedCounter';

// Scroll reveal hook
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const facilities = [
  { title: 'Special attention to weak students', hi: 'कमज़ोर छात्रों पर विशेष ध्यान', icon: Star },
  { title: 'Limited students per batch', hi: 'प्रत्येक बैच में बच्चों की सीमित संख्या', icon: Users },
  { title: 'Weekly test at the end of every week', hi: 'सप्ताह के अंत में साप्ताहिक जांच परीक्षा', icon: FileQuestion },
  { title: 'Teaching with TLM & TLE materials', hi: 'पठन पाठन में TLM और TLE का उपयोग', icon: BookOpen },
  { title: 'Entire syllabus covered systematically', hi: 'पूरे पाठ्यक्रम को क्रमिक रूप से कवर करना', icon: GraduationCap },
];

const platformFeatures = [
  { icon: ClipboardCheck, title: 'Daily Attendance', desc: 'Every class is marked, and students can check their own attendance % anytime.', color: 'from-blue-500 to-purple-600' },
  { icon: FileQuestion, title: 'Online Test Series', desc: 'Timed quizzes that grade themselves instantly, with a full answer review.', color: 'from-orange-500 to-red-500' },
  { icon: Video, title: 'Video Lectures', desc: 'Teachers upload recorded lessons students can watch anytime, from any device.', color: 'from-green-500 to-teal-600' },
  { icon: FolderOpen, title: 'Study Material', desc: 'Notes, slides, and practice sheets — all organized by course, in one place.', color: 'from-purple-500 to-pink-500' },
  { icon: BarChart3, title: 'Digital Report Card', desc: 'Test scores and assignment marks combined into one clear overall percentage.', color: 'from-amber-500 to-orange-600' },
  { icon: Users, title: 'Separate Logins', desc: 'Admin, teacher, and student each get their own dashboard built for their role.', color: 'from-cyan-500 to-blue-600' },
];

const testimonials = [
  { name: 'Priya Sharma', text: 'Student Junction has transformed my child\'s approach to learning. The weekly tests keep them on track!', role: 'Parent', rating: 5 },
  { name: 'Amit Kumar', text: 'The online portal makes it so easy to track attendance and marks. Very transparent system.', role: 'Parent', rating: 5 },
  { name: 'Rohit Singh', text: 'Teachers give individual attention and the study materials are excellent. Highly recommended!', role: 'Student', rating: 5 },
];

const emptyEnquiry = { name: '', phone: '', classInterested: '', message: '' };

export default function LandingPage() {
  const [form, setForm] = useState(emptyEnquiry);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useReveal();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchGallery()
      .then((data) => {
        setGalleryItems(data || []);
        setGalleryLoading(false);
      })
      .catch(() => {
        setGalleryError(true);
        setGalleryLoading(false);
      });
  }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitEnquiry(form);
      setSubmitted(true);
      setForm(emptyEnquiry);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your enquiry. Please call us instead.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-cycle testimonials
  useEffect(() => {
    const t = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () => setLightboxIndex((i) => (i === 0 ? galleryItems.length - 1 : i - 1));
  const nextLightbox = () => setLightboxIndex((i) => (i === galleryItems.length - 1 ? 0 : i + 1));

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  return (
    <div className="min-h-screen bg-campus-paper">
      <PublicNavbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-campus-forest text-white">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-campus-forestLight/30 blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-campus-gold/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/4 left-1/4 h-40 w-40 rounded-full bg-campus-gold/10 blur-2xl animate-pulse-soft" />
          <div className="absolute bottom-1/3 right-1/3 h-24 w-24 rounded-full bg-white/5 blur-xl animate-float" style={{ animationDelay: '0.8s' }} />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-campus-gold/20 px-4 py-1.5 text-xs font-semibold text-campus-goldLight animate-fade-in-down mb-6">
            <Award size={14} />
            Admissions Open for 2025-26
          </div>

          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl animate-fade-in-up">
            Student Junction
          </h1>
          <p className="mt-2 text-lg italic text-campus-goldSoft/80 font-display animate-fade-in-up animate-delay-100">
            …a coaching center…
          </p>
          <p className="mx-auto mt-5 max-w-xl text-white/80 leading-relaxed animate-fade-in-up animate-delay-200">
            Give your child's bright future one more chance with us — quality coaching backed by a modern
            online portal for attendance, tests, and study material.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
            <a
              href="#enquiry"
              className="group inline-flex items-center gap-2 rounded-md bg-campus-gold px-7 py-3.5 text-sm font-semibold text-campus-forest transition hover:bg-campus-goldLight shadow-lg shadow-campus-gold/30"
            >
              Enquire About Admission
              <ChevronRight size={16} className="transition group-hover:translate-x-1" />
            </a>
            <a
              href="tel:9708181437"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Phone size={16} />
              9708181437
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-10 animate-fade-in-up animate-delay-500">
            <div className="text-center">
              <div className="font-mono text-3xl font-bold text-campus-goldLight">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Students Taught</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-3xl font-bold text-campus-goldLight">
                <AnimatedCounter end={10} suffix="+" />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-3xl font-bold text-campus-goldLight">
                <AnimatedCounter end={100} suffix="%" />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Syllabus Coverage</div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#FAF7F0" />
          </svg>
        </div>
      </section>

      {/* ===== CLASSES OFFERED ===== */}
      <section id="classes" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center reveal">
          <h2 className="font-display text-3xl font-semibold text-campus-ink sm:text-4xl">Classes We Teach</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-campus-inkSoft">
            Structured batches with a full syllabus, taught step by step.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[
            { title: 'Class I to VIII', desc: 'All subjects covered, with a strong foundation focus.', gradient: 'from-purple-500 to-indigo-600' },
            { title: 'Class IX to X', desc: 'Focused coaching in Maths, Science & English.', gradient: 'from-orange-500 to-red-600' },
          ].map((cls, i) => (
            <div
              key={cls.title}
              className={`group relative overflow-hidden rounded-xl p-6 shadow-card card-lift reveal animate-delay-${i * 200}`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cls.gradient} opacity-90`} />
              <div className="relative">
                <GraduationCap size={32} className="text-white/90" />
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{cls.title}</h3>
                <p className="mt-1 text-sm text-white/80">{cls.desc}</p>
              </div>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10 transition group-hover:scale-150" />
            </div>
          ))}
        </div>
      </section>

      {/* ===== FACILITIES ===== */}
      <section id="facilities" className="bg-gradient-to-b from-campus-paperDim to-campus-paper py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center reveal">
            <h2 className="font-display text-3xl font-semibold text-campus-ink sm:text-4xl">Why Parents Choose Us</h2>
            <p className="mx-auto mt-2 text-sm text-campus-inkSoft font-display italic">सुविधाएं / Our Facilities</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="reveal group rounded-xl border border-campus-line bg-white/70 p-5 shadow-card card-lift"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-campus-greenSoft group-hover:bg-campus-green transition-colors">
                      <Icon size={20} className="text-campus-green group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-campus-ink">{f.title}</p>
                      <p className="mt-0.5 text-xs text-campus-inkSoft">{f.hi}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ONLINE PLATFORM ===== */}
      <section id="platform" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center reveal">
          <h2 className="font-display text-3xl font-semibold text-campus-ink sm:text-4xl">Our Online Student Portal</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-campus-inkSoft">
            Beyond the classroom — every enrolled student and parent gets access to a full learning dashboard.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="reveal group relative overflow-hidden rounded-xl border border-campus-line bg-white/60 p-6 shadow-card card-lift"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-campus-ink">{f.title}</h3>
                  <p className="mt-2 text-sm text-campus-inkSoft leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-gradient-to-b from-campus-paper to-campus-paperDim py-20">
        <div className="mx-auto max-w-3xl px-6 text-center reveal">
          <h2 className="font-display text-3xl font-semibold text-campus-ink sm:text-4xl">What Parents &amp; Students Say</h2>
          <div className="mt-10 relative">
            <div className="animate-fade-in" key={testimonialIndex}>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: testimonials[testimonialIndex].rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-campus-gold text-campus-gold" />
                ))}
              </div>
              <p className="text-lg text-campus-inkSoft italic leading-relaxed">
                "{testimonials[testimonialIndex].text}"
              </p>
              <div className="mt-6">
                <div className="font-medium text-campus-ink">{testimonials[testimonialIndex].name}</div>
                <div className="text-sm text-campus-inkSoft">{testimonials[testimonialIndex].role}</div>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === testimonialIndex ? 'bg-campus-forest w-6' : 'bg-campus-line'
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      {!galleryLoading && galleryItems.length > 0 && (
        <section id="gallery" className="bg-gradient-to-b from-campus-paperDim to-campus-paper py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center reveal">
              <h2 className="font-display text-3xl font-semibold text-campus-ink sm:text-4xl">Our Gallery</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-campus-inkSoft">
                Moments from our classrooms, events, and student activities
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {galleryItems.slice(0, 8).map((item, i) => (
                <div
                  key={item._id}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-card card-lift animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                  onClick={() => openLightbox(i)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={`${API_URL}${item.image}`}
                      alt={item.caption || 'Gallery photo'}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="text-white">
                      {item.eventName && (
                        <p className="text-sm font-semibold">{item.eventName}</p>
                      )}
                      {item.caption && (
                        <p className="text-xs text-white/80 mt-0.5 line-clamp-2">{item.caption}</p>
                      )}
                    </div>
                  </div>
                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity shadow">
                    <Image size={14} className="text-campus-ink" />
                  </div>
                </div>
              ))}
            </div>
            {galleryItems.length > 8 && (
              <div className="mt-8 text-center reveal">
                <a
                  href="#gallery"
                  onClick={(e) => { e.preventDefault(); openLightbox(0); }}
                  className="inline-flex items-center gap-2 rounded-lg border border-campus-forest px-5 py-2.5 text-sm font-medium text-campus-forest hover:bg-campus-forest hover:text-white transition"
                >
                  View all {galleryItems.length} photos
                  <ChevronRight size={16} />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== LIGHTBOX ===== */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div className="flex flex-col items-center max-w-5xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${API_URL}${galleryItems[lightboxIndex].image}`}
              alt={galleryItems[lightboxIndex].caption || 'Gallery photo'}
              className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-2xl animate-scale-in"
            />
            <div className="mt-4 text-center text-white">
              {galleryItems[lightboxIndex].eventName && (
                <p className="text-lg font-semibold">{galleryItems[lightboxIndex].eventName}</p>
              )}
              {galleryItems[lightboxIndex].caption && (
                <p className="text-sm text-white/70 mt-1">{galleryItems[lightboxIndex].caption}</p>
              )}
              <p className="text-xs text-white/50 mt-1">
                {lightboxIndex + 1} / {galleryItems.length}
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
            aria-label="Next photo"
          >
            <ChevronRightIcon size={24} />
          </button>
        </div>
      )}

      {/* ===== DIRECTOR SECTION ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20 reveal">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-campus-forest to-campus-gold rounded-full blur-xl opacity-30 animate-pulse-soft" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-campus-forest to-campus-forestLight font-display text-2xl font-bold text-campus-goldSoft shadow-lg">
              SDP
            </div>
          </div>
          <h3 className="font-display text-2xl font-semibold text-campus-ink">SDP Ranjan</h3>
          <p className="text-sm text-campus-inkSoft">Director — D.El.Ed, M.Sc (Chemistry)</p>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-campus-forest to-campus-gold" />
          <p className="max-w-lg text-sm text-campus-inkSoft leading-relaxed">
            Leading Student Junction with a focus on individual attention, disciplined weekly assessment, and
            complete syllabus coverage for every batch.
          </p>
        </div>
      </section>

      {/* ===== ENQUIRY FORM ===== */}
      <section id="enquiry" className="mx-auto max-w-2xl px-6 py-20 reveal">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-campus-ink sm:text-4xl">Admission Enquiry</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-campus-inkSoft">
            Share a few details and we'll call you back — no account needed.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-campus-line bg-gradient-to-br from-white to-campus-paperDim/30 p-6 shadow-card card-lift">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center animate-scale-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-campus-greenSoft">
                <CheckCircle2 size={36} className="text-campus-green" />
              </div>
              <p className="font-display text-xl font-semibold text-campus-ink">Thank You!</p>
              <p className="text-sm text-campus-inkSoft max-w-sm">
                We've received your enquiry. Our team will call you back shortly. You can also reach us directly at <strong className="text-campus-forest">9708181437</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 rounded-md bg-campus-forest px-5 py-2 text-sm font-medium text-white hover:bg-campus-forestLight transition"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-campus-redSoft px-4 py-3 text-sm text-campus-red border border-campus-red/20">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-campus-inkSoft">
                    <Users size={14} className="inline mr-1" />
                    Parent / Student name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={set('name')}
                    className="w-full rounded-lg border border-campus-line bg-white px-4 py-3 text-sm transition focus:border-campus-forest focus:ring-2 focus:ring-campus-forest/20 focus:outline-none"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-campus-inkSoft">
                    <Phone size={14} className="inline mr-1" />
                    Phone number
                  </label>
                  <input
                    required
                    value={form.phone}
                    onChange={set('phone')}
                    className="w-full rounded-lg border border-campus-line bg-white px-4 py-3 text-sm transition focus:border-campus-forest focus:ring-2 focus:ring-campus-forest/20 focus:outline-none"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-campus-inkSoft">
                    <GraduationCap size={14} className="inline mr-1" />
                    Class interested in
                  </label>
                  <input
                    value={form.classInterested}
                    onChange={set('classInterested')}
                    className="w-full rounded-lg border border-campus-line bg-white px-4 py-3 text-sm transition focus:border-campus-forest focus:ring-2 focus:ring-campus-forest/20 focus:outline-none"
                    placeholder="e.g. Class VII"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-campus-inkSoft">
                    Message (optional)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    rows={3}
                    className="w-full rounded-lg border border-campus-line bg-white px-4 py-3 text-sm transition focus:border-campus-forest focus:ring-2 focus:ring-campus-forest/20 focus:outline-none resize-none"
                    placeholder="Any specific questions?"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-gradient-to-r from-campus-forest to-campus-forestLight py-3.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-campus-forest/30 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  'Submit Enquiry'
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gradient-to-br from-campus-forestDark via-campus-forest to-campus-forestLight py-12 text-white/80">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-campus-gold font-display text-base font-bold text-campus-goldSoft">
                  SJ
                </div>
                <div>
                  <div className="font-display text-xl font-semibold text-white">Student Junction</div>
                  <div className="text-xs uppercase tracking-wider text-white/50">A Coaching Center, Jagdishpur</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-white/60 max-w-xs">
                Quality coaching with a modern online portal for attendance tracking, online tests, study materials &amp; digital report cards.
              </p>
            </div>
            <div className="text-left space-y-2">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Contact</h4>
              <p className="flex items-center gap-2 text-sm">
                <Phone size={14} /> 9708181437
              </p>
              <p className="flex items-start gap-2 text-sm">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>K. K. Mandal College Road, near Annu Ice Cream Factory, Jagdishpur (Bhojpur)</span>
              </p>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Student Junction. All rights reserved. Built with ❤️ for education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

