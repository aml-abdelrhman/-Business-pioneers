# Pioneers Architectural Hub | منصة رواد العمارة

Pioneers is a world-class architectural portfolio and educational platform designed to showcase luxury real estate projects and architectural designs. The platform provides an immersive experience with high-performance animations, multi-language support, and a seamless user interface.

## 🏗️ Project Overview

This project is built using modern web technologies to provide a high-end digital presence. Although the core focus is architectural projects, the system architecture uses a **"Courses"** naming convention for its main project modules to facilitate structured navigation and potential educational integration.

### Key Features

- **Dynamic Project Showcase:** Located under the `/courses` directory, featuring real-time data fetching and interactive galleries.
- **Bi-directional Support (RTL/LTR):** Fully integrated internationalization (i18n) supporting Arabic and English.
- **Adaptive UI:** Intelligent Dark/Light mode synchronization using a global state manager.
- **Modern Animations:** Powered by Framer Motion for smooth, architectural-grade transitions.
- **Responsive Design:** Optimized for all devices, from mobile phones to high-resolution desktop monitors.
- **Secure Payment Simulation:** Integration-ready payment pages for project enrollment or service acquisition.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Localization:** Next-Intl
- **Animations:** Framer Motion
- **Data Fetching:** TanStack Query (React Query)
- **Icons:** Lucide React & FontAwesome

---

## 📂 Architecture, Naming & Scalability

To maintain a clean and scalable codebase, the projects are organized under the `courses` module:

- `src/components/pages/courses/`: Contains the main logic for project listing and details.
- `src/components/pages/courses/lastProjectsAr.ts` & `lastProjectsEn.ts`: The source of truth for architectural project data.
- `CourseDetailsClient.tsx`: The primary client component for rendering high-fidelity project specifications.

### 🛠️ Future-Ready Pages (Placeholders)
The project includes several pre-built modules and interfaces designed for future expansion:
- **Authentication System:** Fully integrated auth flows (Login, Register, Role management) located in `src/app/[locale]/auth/`.
- **Extended UI Templates:** Ready-to-use layouts for contact management and dashboards.

> **Flexibility Note:** These pages are included as high-quality templates. Depending on the final deployment phase, they can be activated for production use or removed if the scope remains strictly portfolio-focused.

> **Note:** The directory `/courses` is used programmatically to manage architectural projects, allowing the platform to serve both as a portfolio and a training hub for future architects.

---

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <https://github.com/your-repo/pioneers.git>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file and add your configuration (Database, Auth, etc.).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

---

## 🏛️ About Pioneers

Pioneers is dedicated to "Designing Your Next Vision Together". We believe in creating spaces that mimic the future with classic touches, ensuring luxury and smart sustainability in every square meter.

---
© 2024 Pioneers Architecture. All rights reserved.
