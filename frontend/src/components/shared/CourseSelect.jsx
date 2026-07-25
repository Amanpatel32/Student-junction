import { useEffect, useState } from 'react';
import { fetchCourses } from '../../api/courses';

export default function CourseSelect({ value, onChange }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then((data) => {
        setCourses(data);
        if (data.length && !value) onChange(data[0]._id);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-campus-inkSoft">Loading courses…</div>;

  if (courses.length === 0) {
    return <div className="text-sm text-campus-inkSoft">No courses assigned yet.</div>;
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-campus-line bg-white px-3 py-2 text-sm focus:border-campus-forest focus:outline-none"
    >
      {courses.map((c) => (
        <option key={c._id} value={c._id}>
          {c.title} ({c.code}) — {c.batch}
        </option>
      ))}
    </select>
  );
}
