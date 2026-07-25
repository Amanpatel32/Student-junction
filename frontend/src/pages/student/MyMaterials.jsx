import { useEffect, useState } from 'react';
import { FolderOpen, ExternalLink, FileText, Link2, Video, Download, Eye } from 'lucide-react';
import CourseSelect from '../../components/shared/CourseSelect';
import { fetchCourseMaterials } from '../../api/materials';
import EmptyState from '../../components/ui/EmptyState';
import { Pill } from '../../components/ui/Badge';

const typeConfig = {
  Video: { icon: Video, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
  Document: { icon: FileText, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
  Link: { icon: Link2, color: 'from-green-500 to-teal-500', bg: 'bg-green-50' },
};

export default function MyMaterials() {
  const [courseId, setCourseId] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetchCourseMaterials(courseId).then(setMaterials).finally(() => setLoading(false));
  }, [courseId]);

  return (
    <div className="space-y-6">
      <CourseSelect value={courseId} onChange={setCourseId} />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-campus-inkSoft">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading materials…
          </div>
        </div>
      ) : materials.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No materials yet" description="Your teacher hasn't shared any materials for this course yet." />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {materials.map((m) => {
            const config = typeConfig[m.type] || typeConfig.Link;
            const Icon = config.icon;
            return (
              <div
                key={m._id}
                className="group relative overflow-hidden rounded-xl border border-campus-line bg-white shadow-card card-lift"
              >
                {/* Video thumbnail */}
                {m.type === 'Video' && (
                  <div className="relative aspect-video bg-black">
                    <video src={m.link} controls preload="metadata" className="h-full w-full object-cover" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${config.color} text-white`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-campus-ink truncate">{m.title}</h3>
                        <Pill variant={m.type === 'Video' ? 'gold' : 'neutral'}>{m.type}</Pill>
                      </div>
                      {m.description && (
                        <p className="mt-1 text-sm text-campus-inkSoft line-clamp-2">{m.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="mt-4 flex items-center gap-2 border-t border-campus-line pt-3">
                    {m.type === 'Video' ? (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-campus-forest hover:text-campus-forestLight transition"
                      >
                        <Eye size={13} />
                        Watch in full screen
                        <ExternalLink size={11} />
                      </a>
                    ) : (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-campus-forest hover:text-campus-forestLight transition"
                      >
                        {m.type === 'Document' ? <Download size={13} /> : <ExternalLink size={13} />}
                        {m.type === 'Document' ? 'Download document' : 'Open link'}
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

