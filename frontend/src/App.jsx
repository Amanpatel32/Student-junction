import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminOverview from './pages/admin/AdminOverview';
import UserManager from './pages/admin/UserManager';
import CourseManager from './pages/admin/CourseManager';
import TimetableManager from './pages/admin/TimetableManager';
import AdminNotices from './pages/admin/AdminNotices';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminGallery from './pages/admin/AdminGallery';
import AdminVideoManager from './pages/admin/AdminVideoManager';
// Reuse teacher pages for admin (they use the same components)
import AttendanceMarker from './pages/teacher/AttendanceMarker';
import TestBuilder from './pages/teacher/TestBuilder';
import MarksEntry from './pages/teacher/MarksEntry';
import MaterialManager from './pages/teacher/MaterialManager';

import StudentOverview from './pages/student/StudentOverview';
import MyAttendance from './pages/student/MyAttendance';
import StudentTestList from './pages/student/TestList';
import TakeTest from './pages/student/TakeTest';
import MyMarks from './pages/student/MyMarks';
import MyMaterials from './pages/student/MyMaterials';
import MyTimetable from './pages/student/MyTimetable';
import StudentNotices from './pages/student/StudentNotices';
import MyVideos from './pages/student/MyVideos';

// Wraps a page with role-gating + the dashboard chrome, keeping the route table below concise
const page = (roles, title, Component) => {
  const roleArr = Array.isArray(roles) ? roles : [roles];
  return (
    <ProtectedRoute roles={roleArr}>
      <DashboardLayout role={roleArr[0]} title={title}>
        <Component />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin routes — admin manages everything */}
      <Route path="/admin" element={page('admin', 'Overview', AdminOverview)} />
      <Route path="/admin/users" element={page('admin', 'People', UserManager)} />
      <Route path="/admin/courses" element={page('admin', 'Courses', CourseManager)} />
      <Route path="/admin/attendance" element={page('admin', 'Attendance', AttendanceMarker)} />
      <Route path="/admin/tests" element={page('admin', 'Tests', TestBuilder)} />
      <Route path="/admin/marks" element={page('admin', 'Marks', MarksEntry)} />
      <Route path="/admin/materials" element={page('admin', 'Materials', MaterialManager)} />
      <Route path="/admin/videos" element={page('admin', 'Course Videos', AdminVideoManager)} />
      <Route path="/admin/timetable" element={page('admin', 'Timetable', TimetableManager)} />
      <Route path="/admin/notices" element={page('admin', 'Notices', AdminNotices)} />
      <Route path="/admin/gallery" element={page('admin', 'Gallery', AdminGallery)} />
      <Route path="/admin/enquiries" element={page('admin', 'Enquiries', AdminEnquiries)} />

      {/* Student routes */}
      <Route path="/student" element={page('student', 'My Courses', StudentOverview)} />
      <Route path="/student/attendance" element={page('student', 'My Attendance', MyAttendance)} />
      <Route path="/student/tests" element={page('student', 'Tests', StudentTestList)} />
      <Route path="/student/tests/:testId" element={page('student', 'Test', TakeTest)} />
      <Route path="/student/marks" element={page('student', 'Report Card', MyMarks)} />
      <Route path="/student/materials" element={page('student', 'Materials', MyMaterials)} />
      <Route path="/student/videos" element={page('student', 'Video Lectures', MyVideos)} />
      <Route path="/student/timetable" element={page('student', 'Timetable', MyTimetable)} />
      <Route path="/student/notices" element={page('student', 'Notices', StudentNotices)} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
