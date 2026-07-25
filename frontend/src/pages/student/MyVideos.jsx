import { useEffect, useState } from 'react';
import { Video, ExternalLink, Film, Clock, Eye, BookOpen } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchCourseMaterials } from '../../api/materials';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';

export default function MyVideos() {
  const [courseId, setCourseId] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetchCourseMaterials(courseId).then(setMaterials).finally(() => setLoading(false));
  }, [courseId]);

  const videoMaterials = materials.filter(
    (m) => m.type === 'Video' || (m.type === 'Link' && (m.link?.includes('youtube') || m.link?.includes('youtu.be') || m.link?.includes('drive.google')))
  );

  return (
    <div className="space-y-6">
      <CourseSelect value={courseId} onChange={setCourseId} />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-campus-inkSoft">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading videos…
          </div>
        </div>
      ) : !courseId ? (
        <EmptyState
          icon={Film}
          title="Select a course"
          description="Choose a course above to watch video lectures."
        />
      ) : videoMaterials.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No video lectures yet"
          description="Your teacher hasn't uploaded any video content for this course yet."
        />
      ) : (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Video size={20} className="text-campus-forest" />
            <h2 className="font-display text-xl font-semibold text-campus-ink">
              Video Lectures
            </h2>
            <span className="text-sm text-campus-inkSoft">({videoMaterials.length})</span>
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {videoMaterials.map((m, i) => (
              <div
                key={m._id}
                className="group overflow-hidden rounded-xl border border-campus-line bg-white shadow-card card-lift animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Video Player */}
                <div className="relative aspect-video bg-black">
                  {playingVideo === m._id ? (
                    <video
                      src={m.link}
                      controls
                      autoPlay
                      className="h-full w-full"
                      playsInline
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <>
                      {m.type === 'Video' ? (
                        <video
                          src={m.link}
                          preload="metadata"
                          className="h-full w-full object-cover"
                          playsInline
                        />
                      ) : (
                        <img
                          src={`https://img.youtube.com/vi/${extractYoutubeId(m.link)}/maxresdefault.jpg`}
                          alt={m.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/640x360/5B2A86/white?text=Video+Lecture';
                          }}
                        />
                      )}
                      {/* Play button overlay */}
                      <button
                        onClick={() => setPlayingVideo(m._id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-campus-forest/90 text-white shadow-lg transition group-hover:scale-110">
                          <svg className="ml-1 h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </button>
                    </>
                  )}
                </div>

                {/* Video info */}
                <div className="p-4">
                  <h3 className="font-semibold text-campus-ink line-clamp-1">{m.title}</h3>
                  {m.description && (
                    <p className="mt-1 text-sm text-campus-inkSoft line-clamp-2">{m.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-campus-inkSoft">
                      Added {new Date(m.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    {m.type === 'Link' && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-campus-forest hover:text-campus-forestLight transition"
                      >
                        <ExternalLink size={12} />
                        Open on YouTube
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function extractYoutubeId(url = '') {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : '';
}
