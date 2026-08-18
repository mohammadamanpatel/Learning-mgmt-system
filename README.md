```markdown
# Learning Management System (LMS)

---

## Live Deployment

**URL:** https://learning-mgmt-system.onrender.com

---

## Tech Stack

**Frontend:** React 18, Vite 5 (SWC), Redux Toolkit, React Router v6, Tailwind CSS + DaisyUI, Chart.js, Axios

**Backend:** Node.js, Express 4, MongoDB (Mongoose 7), Cloudinary, Razorpay, Nodemailer, JWT cookies, express-fileupload

**AI (Ask AI):** Google Gemini API (`@google/generative-ai`)
- Embeddings: `gemini-embedding-001` (768 dimensions, free tier)
- LLM chat: `gemini-3.6-flash` (free tier)

---

## Features

- **Auth** — Signup, Login, JWT cookies, role-based access (ADMIN/USER)
- **Courses** — Create, list, view details with thumbnails (Cloudinary)
- **Lectures** — Add, view, delete lectures with video upload (chunked)
- **Payments** — Razorpay subscription integration
- **Admin Dashboard** — Chart.js analytics
- **Ask AI** — Floating chat widget, natural language course recommendations via Gemini AI
- **Contact Form** — Nodemailer (currently broken — invalid app password)

---

## Directory Structure

```
Learning-mgmt-system/
├── .env                          # ALL secrets (gitignored)
├── package.json
├── client/
│   ├── package.json
│   └── src/
│       ├── components/
│       │   ├── Auth/requiredAuth.jsx
│       │   ├── AskAiWidget.jsx
│       │   ├── courseCard.jsx
│       │   └── Footer.jsx
│       ├── config/axiosInstance.jsx
│       ├── layouts/HomeLayout.jsx
│       ├── pages/
│       │   ├── Courses/
│       │   │   ├── CourseCreate.jsx
│       │   │   ├── CourseDescription.jsx
│       │   │   └── CourseList.jsx
│       │   ├── Dashboard/
│       │   │   ├── Addlectures.jsx
│       │   │   ├── AdminDashboard.jsx
│       │   │   └── showAllLectures.jsx
│       │   ├── payment/
│       │   │   ├── checkout.jsx
│       │   │   ├── CheckoutSuccess.jsx
│       │   │   └── CheckoutFailure.jsx
│       │   ├── AboutUs.jsx
│       │   ├── contactus.jsx
│       │   ├── Denied.jsx
│       │   ├── EditProfile.jsx
│       │   ├── Home.jsx
│       │   ├── LoginPage.jsx
│       │   ├── NotFoundPage.jsx
│       │   ├── profilePage.jsx
│       │   └── signupPage.jsx
│       ├── redux/slices/
│       │   ├── Store.js
│       │   ├── authSlice.js
│       │   ├── courseSlice.js
│       │   ├── LectureSlice.js
│       │   ├── razorpaySlice.js
│       │   └── statsSlice.js
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── app.js
│   ├── server.js
│   ├── config/DbConnect.js
│   ├── controllers/
│   │   ├── Course.Controller.js
│   │   ├── askAiController.js
│   │   ├── misellaneousPage.js
│   │   ├── paymentController.js
│   │   ├── syncEmbeddingsController.js
│   │   └── UserControllers.js
│   ├── middleWares/userMiddleWare.js
│   ├── routes/
│   │   ├── askAiRoutes.js
│   │   ├── CourseRoute.js
│   │   ├── miselleneousRoute.js
│   │   ├── paymentRoutes.js
│   │   └── UserRoutes.js
│   ├── Schemas/
│   │   ├── course.schema.js
│   │   ├── courseEmbedding.schema.js
│   │   ├── paymentModel.js
│   │   └── userModel.js
│   ├── scripts/
│   │   ├── seedCourses.js
│   │   └── testAskAi.js
│   └── utils/
│       ├── geminiClient.js
│       ├── mailSender.js
│       ├── recommendCourses.js
│       ├── uploadImage.js
│       └── uploadVideo.js
```

---

## Environment Variables (.env) — gitignored, never commit

```
API_KEY=...
API_SECRET=...
CLOUD_NAME=...
CONTACT_US_EMAIL=...
FOLDER=...
JWT_EXPIRY=...
JWT_SECRET=...
MAIL_HOST=smtp.gmail.com
MAIL_PASS=...
MAIL_USER=...
MONGO_URL=...
PORT=5015
RAZORPAY_KEY_ID=...
RAZORPAY_PLAN_ID=...
RAZORPAY_SECRET=...
GEMINI_API_KEY=...
```

---

## Ask AI Feature

### How it works

```
User types: "I want to learn React"
  → embedText(query) → 768 floats (gemini-embedding-001)
  → cosine similarity against all course embeddings
  → top 5 matched courses (full objects with thumbnails)
  → generateText(prompt + matches) via gemini-3.6-flash
  → returns { aiResponse, courses }
  → Frontend renders AI text + clickable course mini-cards
```

### API Endpoints
- **`POST /api/v1/ask-ai`** — Body: `{ "query": "..." }` → `{ success, aiResponse, courses }`
- **`POST /api/v1/sync-embeddings`** — Admin only. Syncs course embeddings.

### Test scripts (run directly, no server needed)
```bash
node server/scripts/seedCourses.js     # Seed 8 courses into MongoDB
node server/scripts/testAskAi.js       # Embed + run 6 test queries
```

### Files

| File | Purpose |
|---|---|
| `server/Schemas/courseEmbedding.schema.js` | Separate collection for course embeddings |
| `server/utils/geminiClient.js` | Gemini SDK — embedText() + generateText() |
| `server/utils/recommendCourses.js` | Cosine similarity engine, top 5 matches |
| `server/controllers/askAiController.js` | POST /api/v1/ask-ai — full pipeline |
| `server/controllers/syncEmbeddingsController.js` | POST /api/v1/sync-embeddings |
| `server/routes/askAiRoutes.js` | Routes for ask-ai + sync-embeddings |
| `server/scripts/seedCourses.js` | Seeds courses into MongoDB (idempotent) |
| `server/scripts/testAskAi.js` | Standalone AI feature test |
| `client/src/components/AskAiWidget.jsx` | Floating chat widget (FAB + panel + cards) |
| `client/src/layouts/HomeLayout.jsx` | Renders AskAiWidget on every page |

---

## Bugs Fixed

1. `server/utils/mailSender.js` — error swallowing (added throw)
2. `server/controllers/Course.Controller.js` — video upload: ObjectId validation, size check, chunked upload
3. `server/app.js` — file size limits (150 MB) with abort handler
4. `server/utils/uploadVideo.js` — new file, chunked upload via upload_large()
5. `client/src/pages/Dashboard/Addlectures.jsx` — locationState fix, video size check, redirect fix
6. `client/src/pages/Dashboard/showAllLectures.jsx` — locationState fix, courseId guard
7. `client/src/pages/LoginPage.jsx` — login fulfilled match, default export
8. `client/src/pages/profilePage.jsx` — broken change password link removed
9. `server/utils/geminiClient.js` — model updated gemini-2.5-flash → gemini-3.6-flash

---

## Local Development

```bash
# Backend
npm run dev

# Frontend (separate terminal)
cd client
npm run dev

# Visit http://localhost:5173
```

---
