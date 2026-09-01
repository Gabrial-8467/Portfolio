# 🛠️ Portfolio CMS — Admin Panel & Dashboard

> A multi-tenant, headless Content Management System (CMS) and Developer Platform for managing portfolio content, media assets, API keys, and content delivery APIs.

---

## 📑 Table of Contents
1. [Overview & Product Vision](#-overview--product-vision)
2. [Architecture & Tech Stack](#-architecture--tech-stack)
3. [Key Features & Modules](#-key-features--modules)
   - [1. Dashboard Overview](#1-dashboard-overview)
   - [2. Multi-Tenant Portfolio Switcher](#2-multi-tenant-portfolio-switcher)
   - [3. Sections & Content CMS](#3-sections--content-cms)
   - [4. Dual-Mode Section Editor](#4-dual-mode-section-editor)
   - [5. Media Asset Manager](#5-media-asset-manager)
   - [6. API Key Management](#6-api-key-management)
   - [7. Interactive API Playground](#7-interactive-api-playground)
   - [8. Developer API Documentation](#8-developer-api-documentation)
   - [9. Settings & Security](#9-settings--security)
4. [Design System & UI Guidelines](#-design-system--ui-guidelines)
5. [Environment Variables](#-environment-variables)
6. [Getting Started & Development](#-getting-started--development)
7. [Directory Structure](#-directory-structure)

---

## 🎯 Overview & Product Vision

The **Portfolio CMS Admin Panel** is designed to feel like modern developer infrastructure platforms (**Linear + Vercel + Stripe Docs**). 

It empowers developers to:
- Manage multi-tenant portfolio content without hardcoding frontend files.
- Deliver content globally via high-performance REST APIs.
- Generate secure API keys for consuming content across React, Next.js, Vue, mobile apps, or static site generators.
- Test and inspect API payloads using a live interactive playground.

---

## 🏗️ Architecture & Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla Modern CSS Variables + Glassmorphism (`admin.css`)
- **State & Auth**: React Context API (`AuthContext.jsx`)
- **Linter**: [Oxlint](https://oxc.rs/)

```text
┌──────────────────────────────────────────────────────────────┐
│                     Admin Dashboard (5174)                   │
├──────────────┬───────────────────────────────────────────────┤
│ Sidebar      │ Topbar: Portfolio Switcher + Live Preview     │
│              ├───────────────────────────────────────────────┤
│ • Overview   │                                               │
│ • Sections   │  Active Module (Sections / Media / API Keys)  │
│ • Media      │                                               │
│ • API Keys   │                                               │
│ • Docs       │                                               │
│ • Playground │                                               │
│ • Settings   │                                               │
└──────────────┴───────────────────────────────────────────────┘
                               │
                      REST API / JWT Token
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    Express + MongoDB (5000)                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features & Modules

### 1. Dashboard Overview
- **Metrics Grid**: Real-time counters for Published Sections, Draft Sections, Uploaded Media Assets, Active API Keys, and API Health status.
- **Portfolio Quick Switcher**: Instant switching between multiple portfolios owned by the administrator.
- **Recent Activity Feed**: Chronological event logs for content modifications, section publishing, and key creation.
- **Quick Links**: One-click shortcuts to Edit Sections, Upload Media, Test APIs, or View Live Portfolio.

### 2. Multi-Tenant Portfolio Switcher
- Create multiple portfolios (e.g. *Personal*, *Freelance / Agency*, *Work Profile*) under a single user account.
- Topbar dropdown allows instant context switching.
- All sections, media items, API keys, and settings automatically scope to the active portfolio.

### 3. Sections & Content CMS
- **Section Reordering**: Change presentation order dynamically with reordering controls.
- **Publish / Unpublish Toggle**: Instantly toggle section visibility in the public API (`GET /api/p/:slug`) without deleting data.
- **Custom Section Creation**: Create custom JSON-driven sections with arbitrary data schemas.
- **Live Preview Integration**: One-click preview opens the frontend with the active draft token or slug.

### 4. Dual-Mode Section Editor
The editor supports two synchronized editing experiences:

#### A. Structured Mode
- Schema-driven visual form fields with automatic data formatting.
- Modal-based array managers for complex collections (Projects, Work Experience, Skills, Hackathons, Socials).
- Live validation preventing malformed types or missing required fields.

#### B. Raw JSON Mode
- Full JSON code editor with real-time syntax formatting, linting, and error markers.
- Pretty-print beautifier (`Format JSON` button).
- Reset and dirty-state tracking with unsaved changes warnings.

### 5. Media Asset Manager
- **Multi-File Upload**: Drag-and-drop or click to upload PNG, JPG, WEBP, GIF, or AVIF images up to 5MB.
- **Asset Gallery**: Responsive image grid displaying thumbnails, filenames, file dimensions, and file sizes.
- **Copy URL**: Instant one-click clipboard copying of the public asset URL.
- **Delete Confirmation**: Safe deletion modal preventing accidental data loss.

### 6. API Key Management
- **One-Time Key Generation**: Cryptographically secure API keys generated with `pk_live_` prefix.
- **One-Time Secret Display**: Modal warning requiring the user to copy the key immediately (the full key is never stored in plaintext or shown again).
- **Secure Key Hashing**: Backend hashes keys with SHA-256; dashboard displays only safe prefix and creation dates.
- **Key Revocation**: Instant revocation of compromised or obsolete API credentials.

### 7. Interactive API Playground
- Test endpoints directly from the dashboard:
  - `GET /api/v1/portfolio`
  - `GET /api/v1/section/:key`
  - `GET /api/p/:slug`
  - `GET /api/p/:slug/section/:key`
- Configure API Key headers (`Authorization: Bearer pk_live_...`).
- Inspect live HTTP status badges (`200 OK`, `401 Unauthorized`), response duration, response headers, and formatted JSON response tree.
- Automatically generates copyable **cURL commands**.

### 8. Developer API Documentation
- Complete, in-dashboard API reference with live base URL detection.
- Interactive code snippets in 5 languages:
  - **JavaScript (Fetch)**
  - **cURL**
  - **React Hook**
  - **Next.js Server Component**
  - **Python (Requests)**
- Response schema documentation with field descriptions and example JSON payloads.

### 9. Settings & Security
- **Profile Configuration**: Update full name, email address, and avatar.
- **Password Management**: Secure password change with verification.
- **Portfolio Settings**: Update portfolio title, slug, custom domain, and theme configuration.
- **Danger Zone**: Safe, double-confirmed portfolio deletion and account deletion workflows.

---

## 🎨 Design System & UI Guidelines

The dashboard is built upon a developer-first SaaS design system:

| Token | Light Value | Purpose |
| :--- | :--- | :--- |
| `--admin-bg` | `#f8fafc` | Main application backdrop |
| `--admin-card` | `#ffffff` | Elevated surface / card background |
| `--admin-border` | `#e2e8f0` | Subtle hairline borders (1px) |
| `--admin-text-main` | `#0f172a` | Primary headings & high-contrast text |
| `--admin-text-muted` | `#64748b` | Supporting text, timestamps, labels |
| `--admin-primary` | `#4f46e5` | Interactive brand accent (Indigo) |
| `--admin-success` | `#10b981` | Active status & publish indicators |
| `--admin-danger` | `#ef4444` | Destructive actions & error alerts |

---

## 🔑 Environment Variables

The admin panel is configured via [`admin/.env`](file:///home/gabrialdeora/React-Projects/Portfolio/admin/.env):

```env
# Backend API base URL (the Portfolio CMS server)
VITE_API_URL=http://localhost:5000

# Default portfolio slug shown for preview links
VITE_PORTFOLIO_SLUG=gabrial-deora

# Public portfolio frontend URL (for Live Preview buttons)
VITE_FRONTEND_URL=http://localhost:3000
```

---

## 💻 Getting Started & Development

### 1. Installation
```bash
cd admin
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The admin panel starts on **`http://localhost:5174`**.

### 3. Production Build & Lint
```bash
npm run build
npm run lint
```

---

## 📁 Directory Structure

```text
admin/
├── src/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx      # Confirmation modals
│   │   │   ├── Field.jsx              # Reusable form field wrapper
│   │   │   ├── ItemModal.jsx          # Array item edit modal
│   │   │   ├── JsonEditor.jsx         # Raw JSON syntax editor
│   │   │   ├── StructuredEditor.jsx   # Dynamic visual form editor
│   │   │   ├── Toast.jsx              # Floating notification toasts
│   │   │   └── useToast.js            # Toast state hook
│   │   ├── admin.css                  # Design system & component styling
│   │   ├── AdminLayout.jsx            # Shell layout with sidebar & topbar
│   │   ├── AuthContext.jsx            # Authentication state & provider
│   │   ├── ProtectedRoute.jsx         # Route guard for authenticated views
│   │   ├── structuredSchemas.js       # Field schemas for portfolio sections
│   │   └── useAuth.js                 # Authentication hook
│   ├── api/
│   │   └── client.js                  # Axios/Fetch API client for server endpoints
│   ├── pages/
│   │   └── admin/
│   │       ├── ApiDocs.jsx            # In-app API documentation
│   │       ├── ApiKeys.jsx            # API key generation & revocation
│   │       ├── Dashboard.jsx          # Overview analytics & activity
│   │       ├── Login.jsx              # Administrator sign-in
│   │       ├── Media.jsx              # Image upload & gallery manager
│   │       ├── Playground.jsx         # Live API request tester
│   │       ├── SectionEditor.jsx      # Dual-mode section editor page
│   │       ├── Sections.jsx           # Section listing & reorder page
│   │       └── Settings.jsx           # Portfolio & account settings
│   ├── App.jsx                        # Route table configuration
│   └── main.jsx                       # Application bootstrap
├── .env                               # Local environment configuration
├── .gitignore                         # Ignored files
├── package.json                       # Dependencies & scripts
└── vite.config.js                     # Vite build configuration (Port 5174)
```

---

## 📄 License & Attribution

Part of the **Portfolio CMS SaaS Ecosystem** — Built for developers.
