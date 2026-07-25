import { useEffect, useState } from 'react';
import { CalendarClock, MapPin, Clock, User } from 'lucide-react';
import { fetchTimetable } from '../../api/timetable';
import EmptyState from '../../components/ui/EmptyState';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const dayColors = {
  Mon: 'from-blue-500 to-cyan-500',
  Tue: 'from-purple-500 to-pink-500',
  Wed: 'from-green-500 to-teal-500',
  Thu: 'from-orange-500 to-red-500',
  Fri: 'from-amber-500 to-yellow-500',
  Sat: 'from-indigo-500 to-purple-500',
};

export default function MyTimetable() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable().then(setSlots).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-campus-inkSoft">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading timetable…
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="No timetable yet"
        description="Your weekly class schedule will appear here once it's set up."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {DAYS.map((day) => {
        const daySlots = slots.filter((s) => s.day === day);
        if (daySlots.length === 0) return null;
        return (
          <div
            key={day}
            className="rounded-xl border border-campus-line bg-white shadow-card overflow-hidden card-lift"
          >
            <div className={`h-2 bg-gradient-to-r ${dayColors[day] || 'from-gray-500 to-gray-600'}`} />
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold text-campus-ink">{day}</h3>
              <div className="mt-4 space-y-3">
                {daySlots.map((s) => (
                  <div
                    key={s._id}
                    className="rounded-lg bg-gradient-to-br from-campus-paperDim/60 to-campus-paperDim/30 p-4 border border-campus-line/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-campus-ink">
                          {s.course?.title || 'Untitled'}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-campus-inkSoft">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {s.startTime} – {s.endTime}
                          </span>
                          {s.room && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {s.room}
                            </span>
                          )}
                        </div>
                        {s.course?.teacher?.name && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-campus-inkSoft">
                            <User size={12} />
                            {s.course.teacher.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

