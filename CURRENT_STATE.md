# Current State

## Rapid Prototyping Lab — Student Portal

**Last reviewed:** July 2026  
**Codebase:** `student portal from scratch/`  
**Type:** Static HTML/CSS/JS frontend prototype

---

## 1. Executive Summary

The student portal is a **fully navigable UI prototype** with seven pages, shared layout, dark mode, collapsible sidebar, and interactive mock workflows on Ongoing Projects. **There is no backend.** All student, project, ticket, and resource data is hard-coded in HTML or JavaScript arrays. Forms show toast feedback but do not persist data to a server.

The portal is **not connected** to the login page in the parent repository (`login.html`). Students can open any page directly without authentication.

---

## 2. What Works Today

### Global (all pages)

| Feature | Status | Notes |
|---------|--------|-------|
| Sidebar navigation | ✅ Working | 7 routes linked |
| Active nav highlighting | ✅ Working | Based on current filename |
| My Projects submenu | ✅ Working | Expands inline; flyout when sidebar collapsed |
| Sidebar icon-only collapse | ✅ Working | Toggle at bottom of sidebar; persisted in `localStorage` |
| Dark mode | ✅ Working | Toggle in top navbar; persisted via `portal-preferences.js` across pages |
| Notification dropdown | ✅ UI only | Static mock notifications; badge shows "3" |
| Toast system | ✅ Working | `showToast()` in `global.js` |
| Responsive mobile drawer | ✅ Working | ≤768px: hamburger opens sidebar overlay |
| Logout link | ⚠️ Stub | Present in sidebar; `href="#"` |

### Dashboard (`dashboard.html`)

| Feature | Status |
|---------|--------|
| Welcome header + stat cards | ✅ Static mock data |
| Current project card + progress bar | ✅ Static |
| Upcoming deadlines list | ✅ Static |
| Recent activity feed | ✅ Static |

### My Profile (`myprofile.html`)

| Feature | Status |
|---------|--------|
| Profile card with avatar | ✅ Static (Trainee1) |
| Personal & academic info panels | ✅ Read-only static data |
| Project stats | ✅ Static |

### Ongoing Projects (`ongoingprojects.html`)

| Feature | Status | Notes |
|---------|--------|-------|
| Project hero + meta cards | ✅ Static | Smart Inventory Management System |
| Ongoing Project Overview tab | ✅ | Merged overview + team |
| Stage Tracking tab | ✅ | |
| 10-step interactive stepper | ✅ | Click to view stage details |
| Stage detail panel | ✅ | Status, deadline, description, feedback |
| Document upload (drag/drop) | ✅ Frontend | Adds "Approval Pending" row to history |
| Submission history (per stage) | ✅ Dynamic | Filtered by selected stepper stage |
| Component booking | ✅ Frontend | Yellow toast; form resets |
| Component return | ✅ Frontend | Yellow toast; form resets |
| Equipment slot booking | ✅ Frontend | Interactive slot grid; yellow toast with date/times |
| Progress circle (30%) | ✅ Static | |

### Completed Projects (`completedprojects.html`)

| Feature | Status | Notes |
|---------|--------|-------|
| Stats cards | ✅ Static |
| Projects table (4 rows) | ✅ Static |
| Search / domain filter inputs | ⚠️ Present | No JS filtering wired |

### Knowledge Base (`knowledgebase.html`)

| Feature | Status | Notes |
|---------|--------|-------|
| Resources tab (6 cards) | ✅ Static display |
| Project reports tab | ✅ Static table |
| Request report form | ✅ Frontend | Toast on submit via `knowledgebase.js` |
| Resource search input | ⚠️ Present | No filter logic |

### Support Center (`supportcenter.html`)

| Feature | Status | Notes |
|---------|--------|-------|
| Tickets table | ✅ Static |
| Raise ticket modal + form | ✅ Frontend | Validates + toast; no persistence |
| FAQ accordion | ✅ Working | `supportcenter.js` |
| Faculty directory | ✅ Static | "Send Message" → warning toast stub |

### Settings (`settings.html`)

| Feature | Status | Notes |
|---------|--------|-------|
| Profile / Change Password tabs | ✅ Working | `settings.js` |
| Read-only profile fields | ✅ Static |
| Change password validation | ✅ Frontend | Min 8 chars, match confirm; success toast |

### Login (parent repo — `../login.html`)

| Feature | Status | Notes |
|---------|--------|-------|
| Role-based demo login | ✅ Demo | Hard-coded `DEMO_USERS` in `login.js` |
| Session in sessionStorage | ✅ Demo | Not linked to student portal pages |
| Redirect to portal | ❌ Missing | Login does not route to `dashboard.html` |

---

## 3. What Does Not Work / Is Not Implemented

| Area | Gap |
|------|-----|
| Authentication | No gate on portal pages |
| API / database | All data is mock |
| File upload persistence | Files are not sent anywhere |
| Mentor approval workflow | Status changes are manual in mock data only |
| Notifications | Static; "Mark all read" does nothing |
| Logout | No session clearing |
| Completed projects search/filter | Inputs not connected |
| KB resource search | Input not connected |
| KB resource downloads | Cards are not clickable |
| Faculty messaging | Stub toast only |
| Report request approval | No backend |
| Ticket creation | Does not append to table |
| Profile editing | Institution-managed; fields disabled by design |
| Email / SMS alerts | Not implemented |
| Multi-project support | UI assumes one active project |

---

## 4. File Inventory

### HTML pages (7)

| File | Page-specific JS | Page-specific CSS |
|------|------------------|-------------------|
| `dashboard.html` | `dashboard.js` (empty) | `dashboard.css` |
| `myprofile.html` | `myprofile.js` (empty) | `myprofile.css` |
| `ongoingprojects.html` | `ongoingprojects.js` (~590 lines) | `ongoingprojects.css` |
| `completedprojects.html` | `completedprojects.js` (empty) | `completedprojects.css` |
| `knowledgebase.html` | `knowledgebase.js` | `knowledgebase.css` |
| `supportcenter.html` | `supportcenter.js` | `supportcenter.css` |
| `settings.html` | `settings.js` | `settings.css` |

### Shared assets

| File | Purpose |
|------|---------|
| `assets/css/global.css` | ~1200 lines; layout, components, dark mode, responsive |
| `assets/js/global.js` | Sidebar, toggles, toasts, validation, nav |
| `assets/js/portal-preferences.js` | Early theme/sidebar pref hydration |
| `assets/images/OIP.webp` | Logo and avatar placeholder |

---

## 5. Mock Data Snapshot

### Student

```
Name:       Trainee1
Register:   22BCS001
Department: Computer Science and Engineering
Email:      trainee1@email.com
Role:       Student
Team ID:    TEAM-2026-01
```

### Active project

```
Title:          Smart Inventory Management System
Mentor:         Dr. R. Karthikeyan
Start:          Feb 10, 2026
Current stage:  3 — Problem Statement
Next deadline:  Jul 08, 2026
Progress:       30% (2/10 stages completed)
Technology:     Node.js, Express, MongoDB
```

### Submission history (seeded)

| Stage | Document | Status |
|-------|----------|--------|
| 1 — Project Title | title.pdf | Approved |
| 2 — Abstract | abstract_v1.docx | Revision Needed |
| 2 — Abstract (Resubmission) | abstract_v2.docx | Approved |

Stage 3 submissions are added dynamically when the student uploads a file.

### Team

| Member | Register | Role |
|--------|----------|------|
| Trainee1 | 22BCS001 | Team Leader |
| Ajay | 22BCS002 | Member |
| Karthik | 22BCS003 | Member |
| Praveen | 22BCS004 | Member |
| Rahul | 22BCS005 | Member |

---

## 6. Recent Feature History (This Build)

Features implemented during recent iteration:

1. Settings tab switching and password validation
2. Interactive 10-stage stepper with stage detail panel
3. Dynamic submission history filtered by stage
4. Abstract v2 approved; stage 3 upload adds "Approval Pending" entry
5. Interactive equipment slot picker with availability mock
6. Yellow warning toasts for component/equipment booking requests
7. Merged Overview + Team → "Ongoing Project Overview" tab (first tab)
8. Removed top navbar search bar
9. Green "Active" badge on ongoing project hero
10. Dark mode with cross-page `localStorage` persistence
11. Sidebar icon-only collapse with My Projects flyout submenu

---

## 7. Known Issues & Limitations

| Issue | Severity | Detail |
|-------|----------|--------|
| Duplicated sidebar HTML | Low | 7 copies; manual sync on nav changes |
| No build pipeline | Low | No minification, lint, or bundling |
| Login not integrated | High | Portal is publicly accessible as static files |
| `completedprojects.js` empty | Medium | Search/filter UI non-functional |
| Parent repo duplicate pages | Low | `student-portal/dashboard.html` etc. are legacy |
| file:// localStorage | Low | Theme persistence requires same folder origin |
| Submenu in collapsed mode | Low | Flyout only; no hover-open |
| Hard-coded dates | Low | Deadline countdown not computed from real date |

---

## 8. Parent Repository Artifacts (Outside Active Portal)

These exist in `student-portal/` but are **not** part of the canonical `student portal from scratch/` build:

| Path | Description |
|------|-------------|
| `login.html`, `login.css`, `login.js` | Login prototype with demo credentials |
| `dashboard.html`, `profile.html`, etc. | Legacy page copies |
| `build_portal.py` | Migration script from legacy to scratch folder |
| `fix_*.py` | One-off HTML/CSS repair scripts |

**Demo login credentials** (`login.js`):

```
student / password123  (role: Student)
student123 / password123
```

---

## 9. localStorage Keys in Use

| Key | Type | Set by |
|-----|------|--------|
| `portal-theme` | `light` \| `dark` | Dark mode toggle, `portal-preferences.js` |
| `portal-sidebar-collapsed` | `true` \| `false` | Sidebar collapse toggle |

---

## 10. Suggested Next Steps (Priority Order)

1. **Wire login → dashboard** — redirect student role to `student portal from scratch/dashboard.html` after auth
2. **Extract shared layout** — sidebar/header template to reduce duplication
3. **API contract** — define JSON schemas for projects, stages, submissions
4. **Replace mock arrays** in `ongoingprojects.js` with `fetch()` calls
5. **Implement completed projects filter** in `completedprojects.js`
6. **File upload endpoint** — multipart POST with progress and error states
7. **Add README** with local dev instructions (`python -m http.server`)
8. **Introduce CI** — HTML validation, basic smoke tests

---

## 11. How to Run Locally

```bash
cd "student portal from scratch"
python -m http.server 8080
# Open http://localhost:8080/dashboard.html
```

Use a local HTTP server (not `file://`) for reliable `localStorage` behavior across navigation.

---

## 12. Page Load Sequence

```
1. portal-preferences.js   → apply theme + sidebar pref flags
2. global.css + page.css   → render styled layout
3. global.js               → inject toggles, bind sidebar/nav/toasts
4. page.js                 → page-specific interactions
```

---

## 13. Status at a Glance

```
┌─────────────────────────────────────────────────────────┐
│  STUDENT PORTAL — IMPLEMENTATION MATURITY               │
├──────────────────────┬──────────────────────────────────┤
│  UI / UX             │  ████████████████░░  ~85%         │
│  Frontend logic      │  ██████████░░░░░░░░  ~55%         │
│  Backend integration │  ░░░░░░░░░░░░░░░░░░   0%         │
│  Authentication      │  ██░░░░░░░░░░░░░░░░  ~10% (demo) │
│  Production ready    │  ████░░░░░░░░░░░░░░  ~20%         │
└──────────────────────┴──────────────────────────────────┘
```

The portal is suitable for **demos, usability review, and frontend development**. It is **not production-ready** without authentication, API integration, and data persistence.
