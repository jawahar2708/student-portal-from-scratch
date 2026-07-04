# Product Requirements Document (PRD)

## Rapid Prototyping Lab — Student Portal

| Field | Value |
|-------|-------|
| **Product** | ILP Student Portal (Rapid Prototyping Lab Management System) |
| **Version** | 1.0 (Frontend Prototype) |
| **Primary users** | Engineering students enrolled in the ILP program |
| **Status** | Static prototype with mock data; no production backend |

---

## 1. Overview

The Student Portal is the student-facing module of the **Rapid Prototyping Lab Management System (RPLMS)**. It enables students to track ILP project progress across defined stages, manage lab resource requests, access institutional knowledge resources, raise support tickets, and view academic profile information.

The current implementation is a **multi-page static web application** served as HTML/CSS/JavaScript, designed as a high-fidelity UI prototype prior to backend integration.

---

## 2. Problem Statement

Students in the Rapid Prototyping Lab need a single place to:

- Understand where they are in the 10-stage ILP project lifecycle
- Submit documents for mentor review and read feedback
- Book lab components and equipment
- Access templates, guidelines, and past project reports
- Contact faculty and raise support requests
- View their profile and account settings

Today, much of this is handled offline or through fragmented channels. The portal centralizes these workflows into one consistent experience.

---

## 3. Goals & Success Metrics

### Goals

1. Provide a clear visual overview of project status and upcoming deadlines
2. Guide students through stage-based document submission
3. Reduce lab coordinator overhead for component/equipment requests (future: automated routing)
4. Improve discoverability of lab resources and past project work
5. Offer responsive, accessible UI that works on desktop and mobile

### Success Metrics (when backend is live)

| Metric | Target |
|--------|--------|
| Stage submission completion rate | > 90% on-time |
| Support ticket first-response time | < 24 hours |
| Equipment booking conflicts | < 5% double-bookings |
| Student weekly active usage | > 80% during active semester |
| Portal task completion without staff help | > 70% |

---

## 4. User Personas

### Primary: ILP Student (e.g. Trainee1)

- Final-year CSE student with one active team project
- Needs deadline visibility, upload capability, and mentor feedback
- Occasionally books Arduino kits, 3D printer slots, etc.

### Secondary: Team Leader

- Same as student, plus visibility into team roster on Ongoing Projects
- Coordinates submissions on behalf of the team (future scope)

### Out of scope (separate portals)

- Faculty mentor approval workflows
- Lab technician inventory management
- Admin system configuration

---

## 5. Functional Requirements

### 5.1 Authentication & Session

| ID | Requirement | Priority | Current Status |
|----|-------------|----------|----------------|
| AUTH-01 | Role-based login (Student, Faculty, Admin, etc.) | P0 | Prototype exists in parent `login.html` (not wired to student portal) |
| AUTH-02 | Session persistence / remember me | P1 | Demo only (`sessionStorage`) |
| AUTH-03 | Logout | P1 | UI present; no action implemented |
| AUTH-04 | Redirect to dashboard after student login | P0 | Not integrated |

### 5.2 Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| DASH-01 | Show welcome message with student name | P0 |
| DASH-02 | Display stat cards: active projects, completed, pending stages, overdue | P0 |
| DASH-03 | Show current project summary with progress bar | P0 |
| DASH-04 | List upcoming deadlines | P0 |
| DASH-05 | Show recent activity feed | P1 |
| DASH-06 | Notification bell with unread count | P1 |

### 5.3 My Profile

| ID | Requirement | Priority |
|----|-------------|----------|
| PROF-01 | Display student avatar, name, register number, department | P0 |
| PROF-02 | Show personal and academic information (read-only) | P0 |
| PROF-03 | Show project stats (active, completed, stages done) | P1 |

### 5.4 Ongoing Projects

| ID | Requirement | Priority |
|----|-------------|----------|
| PROJ-01 | Display active project hero (mentor, stage, dates, deadline) | P0 |
| PROJ-02 | **Ongoing Project Overview** tab: project description, domain, tech stack, team | P0 |
| PROJ-03 | **Stage Tracking** tab: 10-step visual stepper | P0 |
| PROJ-04 | Click stepper step to view stage details (status, deadline, description, feedback) | P0 |
| PROJ-05 | Upload documents for current stage (drag-and-drop + file picker) | P0 |
| PROJ-06 | Submission history filtered by selected stage | P0 |
| PROJ-07 | Show submission status: Approved, Revision Needed, Approval Pending | P0 |
| PROJ-08 | Component booking form (component, quantity, purpose) | P1 |
| PROJ-09 | Component return form | P1 |
| PROJ-10 | Equipment slot booking with date-based availability grid | P1 |
| PROJ-11 | Overall progress indicator (percentage + circular chart) | P1 |

**ILP Stage Model (10 stages):**

1. Title  
2. Abstract  
3. Problem Statement  
4. Literature Survey  
5. System Design  
6. Modules  
7. Coding  
8. Testing  
9. Report  
10. Presentation  

### 5.5 Completed Projects

| ID | Requirement | Priority |
|----|-------------|----------|
| COMP-01 | List all completed projects in a table | P0 |
| COMP-02 | Show completion stats (total, stages, last completed, completion rate) | P1 |
| COMP-03 | Filter/search by project name and domain | P2 |

### 5.6 Knowledge Base

| ID | Requirement | Priority |
|----|-------------|----------|
| KB-01 | Browse downloadable resources (guides, templates, manuals) | P0 |
| KB-02 | View completed project reports table | P1 |
| KB-03 | Request access to restricted reports | P1 |
| KB-04 | Search resources | P2 |

### 5.7 Support Center

| ID | Requirement | Priority |
|----|-------------|----------|
| SUP-01 | View support ticket history | P0 |
| SUP-02 | Raise new ticket (subject, category, description, attachment) | P0 |
| SUP-03 | FAQ accordion with search | P1 |
| SUP-04 | Faculty directory with contact info | P1 |
| SUP-05 | Send message to faculty | P2 (stub) |

### 5.8 Settings

| ID | Requirement | Priority |
|----|-------------|----------|
| SET-01 | View read-only profile fields | P0 |
| SET-02 | View account metadata (status, member since, last login) | P1 |
| SET-03 | Change password with validation (min 8 chars, confirm match) | P0 |

### 5.9 Global UI / UX

| ID | Requirement | Priority |
|----|-------------|----------|
| UI-01 | Persistent left sidebar navigation | P0 |
| UI-02 | Sidebar collapse to icon-only mode | P1 |
| UI-03 | My Projects submenu accessible in collapsed mode (flyout) | P1 |
| UI-04 | Dark mode toggle persisted across pages | P1 |
| UI-05 | Responsive layout (desktop, tablet, mobile) | P0 |
| UI-06 | Toast notifications for form actions | P1 |
| UI-07 | Active nav item highlighting per page | P0 |

---

## 6. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | First paint < 2s on local/static hosting; no blocking third-party deps beyond Google Fonts and Font Awesome CDN |
| **Accessibility** | Semantic HTML, aria-labels on toggle buttons; contrast maintained in dark mode |
| **Browser support** | Latest Chrome, Firefox, Edge, Safari |
| **Security** | Production requires server-side auth, HTTPS, CSRF protection, file upload validation |
| **Data** | Production data must come from API; no PII in client-side mock arrays |
| **Maintainability** | Shared layout via `global.css` / `global.js`; page-specific assets per route |

---

## 7. Out of Scope (v1 Prototype)

- Real authentication and authorization
- Database persistence
- File storage and mentor review backend
- Email/SMS notifications
- Real-time equipment availability from lab inventory
- Faculty/admin portals
- Payment or billing
- Multi-language support

---

## 8. User Flows

### 8.1 Submit a Stage Document

```
Dashboard → Ongoing Projects → Stage Tracking
  → Select current stage on stepper
  → Drag file to upload area (or click to browse)
  → Submit Document
  → Toast: success
  → Submission appears in history as "Approval Pending"
```

### 8.2 Book Equipment Slot

```
Ongoing Projects → Stage Tracking → Equipment Slot Booking
  → Select equipment + weekday date
  → Interactive slot grid shows Available / Booked
  → Click available slot → Book Slot
  → Yellow toast: request forwarded to lab-in-charge
```

### 8.3 Raise Support Ticket

```
Support Center → My Tickets → Raise Ticket
  → Fill modal form → Submit
  → Toast confirmation (frontend only today)
```

---

## 9. Mock Data Conventions (Prototype)

| Entity | Sample value |
|--------|--------------|
| Student | Trainee1, 22BCS001, CSE |
| Active project | Smart Inventory Management System |
| Current stage | 3 — Problem Statement |
| Mentor | Dr. R. Karthikeyan |
| Team leader | Trainee1 (22BCS001) |
| Tech stack | Node.js, Express, MongoDB |

---

## 10. Future Roadmap

| Phase | Deliverable |
|-------|-------------|
| **Phase 1** | Integrate login; REST API for student profile and projects |
| **Phase 2** | Real file upload, mentor approval workflow, notifications |
| **Phase 3** | Lab inventory integration for components and equipment |
| **Phase 4** | Faculty portal for reviews; admin analytics |
| **Phase 5** | Optional SPA migration (React/Vue) or SSR if complexity grows |

---

## 11. Open Questions

1. Should students edit any profile fields, or is all data institution-sourced?
2. Are equipment bookings approved by lab-in-charge before confirmation?
3. Can teams have multiple active projects, or strictly one?
4. What file size and type restrictions apply per stage?
5. Should restricted reports require faculty approval workflow in KB?

---

## 12. Appendix — Page Map

| Page | File | Purpose |
|------|------|---------|
| Dashboard | `dashboard.html` | Home overview |
| My Profile | `myprofile.html` | Student info |
| Ongoing Projects | `ongoingprojects.html` | Active project lifecycle |
| Completed Projects | `completedprojects.html` | Historical projects |
| Knowledge Base | `knowledgebase.html` | Resources & reports |
| Support Center | `supportcenter.html` | Tickets & help |
| Settings | `settings.html` | Account & password |
| Login (parent repo) | `../login.html` | Authentication entry (not linked) |
