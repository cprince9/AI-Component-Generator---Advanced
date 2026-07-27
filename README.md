# GenU: Full-Stack AI Component Generator & Copilot 🤖⚡

![MERN Stack](https://img.shields.io/badge/Stack-MERN-purple?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-412991?style=for-the-badge&logo=google)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Smart%20JSON-47A248?style=for-the-badge&logo=mongodb)

Welcome to **GenU**, an advanced, production-grade full-stack web application that transforms natural language descriptions into responsive, state-of-the-art UI components using the **Google Gemini 2.5 Flash API**. 

Unlike basic generators, GenU features a **Multi-Stack Live Preview Engine** (compiling JSX/React and Vue directly in the browser), an **AI Code Refiner Copilot** for iterative improvements, and a robust **MERN Backend** with JWT authentication and a **Smart Database Auto-Fallback** system that guarantees zero downtime!

---

## 🌟 Key Features

### ⚡ 1. Multi-Stack AI Generation
Generate clean, production-ready code across multiple frameworks:
* **HTML & Vanilla CSS**
* **HTML & Tailwind CSS**
* **React + Tailwind CSS (JSX)**
* **Vue 3 + Tailwind CSS**

### 🖥️ 2. Universal Live Preview Engine
* Built-in in-browser compiler powered by `@babel/standalone` and CDN injects.
* Compiles React JSX functional components and Vue 3 template apps on the fly inside a secure sandbox iframe.
* **Responsive Viewport Testing**: Test components instantly across **Mobile (375px)**, **Tablet (768px)**, and **Desktop** widths, or pop out to a Fullscreen preview modal.

### 🔄 3. AI Code Refiner (Iterative Copilot)
* Modify existing generated code through natural language chat (e.g., *"Make button emerald green"*, *"Add a dark mode toggle"*).
* Preserves component structure without doing a slow, scratch rebuild.
* Keeps a timestamped **Refinement History** of all iterative edits.

### 💾 4. Full-Stack MERN & Cloud Library
* **Custom REST API**: Built with Node.js, Express, and Mongoose.
* **JWT Authentication**: Secure user sign up, login, and protected routes.
* **Personal Component Library**: Save generated components to your cloud dashboard, view live thumbnails, copy code, and manage your collection.

### 🛡️ 5. Smart Database Auto-Fallback
* **Zero Downtime Guarantee**: The Express server intelligently detects if a local MongoDB service is unavailable (`ECONNREFUSED`).
* If offline, it automatically switches to a **Local JSON File Database** stored in `server/data/*.json`.
* Registration, Login, and Component Saving work 100% seamlessly in both online MongoDB and offline Fallback modes!

### 🌓 6. Crisp Light & Sleek Dark Themes
* Complete theme support with smooth 300ms transitions across all pages, modals, cards, and forms.
* **Monaco Editor Theme Sync**: The code editor automatically switches between a bright clean theme (`light`) in Light Mode and Visual Studio Dark (`vs-dark`) in Dark Mode.

---

## 🏗️ Architecture & Pipeline Overview

```
[ User Prompt / Refinement ] 
            │
            ▼
┌────────────────────────────────────────────────────────┐
│  React Frontend (Vite + Tailwind CSS + Monaco Editor)  │
└──────────────────┬─────────────────────────────────────┘
                   │  1. Generate / Refine Code (REST)
                   ▼
       ┌──────────────────────┐
       │  Google Gemini API   │ (gemini-2.5-flash)
       └──────────────────────┘
                   │  2. Return Code Stream
                   ▼
┌────────────────────────────────────────────────────────┐
│  Universal Preview Engine (@babel/standalone / Iframe) │
└──────────────────┬─────────────────────────────────────┘
                   │  3. Save to Library (JWT Auth)
                   ▼
┌────────────────────────────────────────────────────────┐
│  Express.js REST API Server (Port 5000)                │
└──────────────────┬─────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌─────────────────┐ ┌────────────────────────────────────┐
│ MongoDB (Online)│ │ Local JSON Database (Offline Mode) │
└─────────────────┘ └────────────────────────────────────┘
```

---

## 📁 Project Directory Structure

```text
Generate_UI/
├── src/                        # React Frontend Source
│   ├── components/
│   │   ├── Navbar.jsx          # Responsive header with Theme Toggle & Auth status
│   │   ├── PromptForm.jsx      # Multi-stack selector & inspiration starters
│   │   ├── OutputDisplay.jsx   # Monaco Editor & Responsive Iframe Live Preview
│   │   └── RefineChat.jsx      # Iterative AI Code Refiner (Copilot)
│   ├── context/
│   │   └── AuthContext.jsx     # Global JWT authentication & user state
│   ├── pages/
│   │   ├── Home.jsx            # Main AI Generator dashboard
│   │   ├── Dashboard.jsx       # User Component Library & management grid
│   │   ├── Login.jsx           # User authentication login page
│   │   ├── Register.jsx        # User registration page
│   │   ├── Docs.jsx            # Documentation & usage guides
│   │   └── About.jsx           # About page
│   ├── utils/
│   │   └── previewBuilder.js   # Universal Babel transpiler & CDN preview builder
│   ├── App.jsx                 # Main application routes & theme provider
│   └── main.jsx                # Entry point
│
├── server/                     # Express Backend API
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── User.js             # Mongoose User schema with Bcrypt hashing
│   │   └── Component.js        # Mongoose Component schema & refinement history
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/register, /api/auth/login, /api/auth/me
│   │   └── componentRoutes.js  # /api/components CRUD endpoints
│   ├── utils/
│   │   └── dbService.js        # Smart Offline/Online DB adapter (MongoDB <-> JSON)
│   ├── data/                   # Auto-generated offline JSON database storage
│   ├── server.js               # Express server hub & offline mode auto-detector
│   └── package.json            # Backend dependencies
│
├── package.json                # Root package & concurrent scripts
├── tailwind.config.js          # Tailwind styling configuration
└── vite.config.js              # Vite bundler configuration
```

---

## 🚀 Getting Started

Follow these steps to run the full-stack application on your local machine.

### ✅ Prerequisites
* **Node.js** (v18.x or higher)
* **npm**
* **Google Gemini API Key** → [Get one for free at Google AI Studio](https://ai.google.dev/)
* *(Optional)* **MongoDB Community Server** running on port 27017 (if not installed, the server will automatically use the offline JSON file database).

---

### 📥 Installation & Configuration

#### 1. Clone the Repository
```bash
git clone https://github.com/cprince9/Generate_UI.git
cd Generate_UI
```

#### 2. Install Root (Frontend) Dependencies
```bash
npm install
```

#### 3. Install Backend (Server) Dependencies
```bash
cd server
npm install
cd ..
```

#### 4. Configure Environment Variables

**Frontend (`.env`)** in the root project folder:
```env
VITE_GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

**Backend (`server/.env`)** in the `server/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/genu
JWT_SECRET=supersecretjwtkey_genu_2026
```

---

### ⚡ Running the Application

You can start **both** the Express Backend Server and the Vite React Frontend simultaneously with a single command from the project root:

```bash
npm run dev:all
```

* **Frontend UI**: Opens at `http://localhost:5173`
* **Backend API**: Runs at `http://localhost:5000` (Health check available at `http://localhost:5000/api/health`)

---

## 💡 Usage Tips

1. **Multi-Stack Preview**: Try generating a `React + Tailwind CSS` component! The live preview will automatically inject React 18, Babel, and Tailwind CDN to render your JSX live in the browser.
2. **Iterative Refinement**: After generating a component, type into the **AI Code Refiner** box below the editor (e.g., *"Make the card glassmorphic with a purple border"*). Watch how it intelligently upgrades your code.
3. **Responsive Testing**: Click the **Mobile**, **Tablet**, or **Desktop** icons in the top right of the preview box to test how your UI reacts to different screen widths.
4. **Offline Resilience**: If MongoDB isn't running on your machine, notice the console log when starting the server—it will automatically switch to **Local File Database Mode**, storing your library cleanly in `server/data/*.json`.

---
