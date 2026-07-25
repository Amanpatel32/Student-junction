# Student Junction — LMS

A full learning management system for **Student Junction**, a coaching center in Jagdishpur (Bhojpur), built on the MERN stack. It has two halves:

1. A **public marketing website** (no login required) — matches the institute's own banner branding, with class info, facilities, an "our online portal" showcase, and an admission enquiry form.
2. A **full LMS dashboard** behind login, with three roles — **Admin**, **Teacher**, **Student**.

## Public site

Visiting the site root shows the institute's landing page:
- Hero with the "Student Junction — a coaching center" branding and Admissions Open badge
- Classes offered (Class I–VIII all subjects; Class IX–X Maths, Science & English)
- Facilities list (from the institute's own banner)
- "Our Online Student Portal" section — showcases the LMS features to prospective parents
- Director bio (SDP Ranjan, D.El.Ed, M.Sc Chemistry)
- An **admission enquiry form** — no account needed. Submissions land in the Admin's **Enquiries** page as leads to follow up on.
- Login and Sign Up buttons in the navbar

## LMS dashboard (behind login)

| Module | Admin | Teacher | Student |
|---|---|---|---|
| **People** | Create/edit/deactivate accounts, approve self-registered students | — | — |
| **Courses** | Create courses, assign a teacher, enroll students | View own courses | View enrolled courses |
| **Attendance** | — | Mark Present/Absent/Late per class, see per-student % | See own attendance % and a full present/absent history |
| **Tests** | — | Build a test series (multi-question MCQ, timed, publish toggle), view auto-graded results | Take timed quizzes — graded instantly, with a locked answer review after submitting |
| **Marks** | — | Enter assignment/exam scores | Combined report card (manual marks + quiz scores → one overall %) |
| **Materials** | — | **Upload video lectures or documents directly**, or share an external link (YouTube/Drive) | Watch uploaded videos inline, or open linked/documents |
| **Timetable** | Set weekly class slots | View teaching schedule | View weekly class schedule |
| **Notices** | Post institute-wide or per-course announcements, delete any | Post to own courses, view institute-wide notices | Read-only feed of relevant notices |
| **Enquiries** | View/manage admission leads from the public site | — | — |

Sign-up: students can self-register from `/register`. New accounts start **Pending** and can't log in until an admin approves them from the People page (a banner shows up whenever someone's waiting, with one-click Approve/Reject).

## Project structure

```
student-junction/
├── backend/                 Express + MongoDB API
│   ├── config/db.js
│   ├── models/               User, Course, Attendance, Test, Submission, Mark,
│   │                         Material, TimetableSlot, Notice, Enquiry
│   ├── controllers/ routes/
│   ├── middleware/           auth.js (JWT + roles), upload.js (multer file uploads)
│   ├── uploads/               uploaded videos/documents land here, served at /uploads/...
│   └── seed/                 createAdmin.js, seedDemoData.js
└── frontend/                 React + Vite + Tailwind, React Router
    └── src/
        ├── api/               one module per resource
        ├── context/AuthContext.jsx
        ├── components/        ui kit, layout (incl. public navbar), shared
        └── pages/              LandingPage.jsx + login/register + admin/, teacher/, student/
```

## Prerequisites

- Node.js 18+
- MongoDB — local install or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/student_junction
# or your Atlas connection string, with the database name added before the ?
PORT=5000
JWT_SECRET=some_long_random_string
```

Start the server:
```bash
npm run dev
```

### Create your first admin account
```bash
npm run create-admin -- "Your Name" admin@studentjunction.com "yourPassword123"
```

### Optional: load demo data
```bash
npm run seed-demo
```
Adds a teacher, three Class VII students, a course with attendance/test/marks/timetable, a sample notice, and a sample admission enquiry — useful for exploring the whole app immediately. Prints demo login credentials when done.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173` — you'll land on the public Student Junction homepage. Use the Login button (top right) to reach the dashboard.

## Video / file uploads — how it works

Teachers can add course materials two ways from **Materials**:
- **External link** — paste a YouTube/Drive/PDF URL. No storage cost, works for any file size.
- **Upload video/file** — uses a real file upload (via `multer`) saved to `backend/uploads/` and served back at `http://localhost:5000/uploads/<filename>`. Students see uploaded videos played inline with an HTML5 player.

**Production note:** file uploads are saved to local disk. On hosts with an *ephemeral* filesystem (e.g. Render/Railway free tier), uploaded files are wiped on every redeploy/restart. For production you have two options:
1. Use a host with a **persistent disk** (e.g. Render's paid persistent disk add-on) pointed at `backend/uploads/`, or
2. Swap the storage engine in `backend/middleware/upload.js` for cloud storage (Cloudinary, AWS S3, etc.) — the rest of the app (Material model, routes, student player) doesn't need to change, only where the file physically gets written and what URL comes back.

For most small institutes, pasting a YouTube "unlisted" link for lecture videos is the simplest and cheapest option — it costs nothing to host and streams reliably. The upload feature is there for smaller files (notes, worksheets, short clips) where a real upload is more convenient than creating a YouTube video.

## Typical first-time flow (as Admin)

1. **People** → add a teacher directly. For students, either add them directly, or have them self-register at `/register` and approve them from the pending-approvals banner.
2. **Courses** → create a course (e.g. "Class VII — Mathematics"), assign the teacher, enroll students.
3. **Timetable** → add weekly class slots.
4. **Notices** → post a welcome announcement.
5. Log in as the teacher → mark attendance, build a test, enter marks, upload a video lecture or link some notes.
6. Log in as a student → see it all reflected, including watching the uploaded video and taking the quiz.
7. Visit the public homepage and submit a test enquiry → check **Admin → Enquiries** to see it land there.

## Deployment

- Host the backend (Render, Railway, etc.) with an Atlas `MONGO_URI`, a strong `JWT_SECRET`, and — if you want uploads to survive redeploys — a persistent disk mounted at `backend/uploads`.
- Point the frontend's `VITE_API_URL` at the deployed API, then `npm run build` and deploy the `dist/` folder (Vercel, Netlify, etc.).
- Update CORS in `backend/server.js` if you want to restrict allowed origins in production (currently open via `cors()`).
- This is built for **one institute's** data (multi-user, not multi-tenant) — everyone shares one course/user pool. That's the right fit for a single coaching center; it would need extra work (an `institute` field on every model) to host multiple separate institutes on one deployment.
