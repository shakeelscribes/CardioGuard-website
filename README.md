<div align="center">
  
# 🫀 CardioGuard Web Platform
**Next-Generation Cardiovascular Disease Risk Prediction Ecosystem**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/Status-V2.0%20Ready-success?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

## 🌌 Overview

**CardioGuard** is a modern, responsive web application engineered to predict cardiovascular disease (CVD) risks using advanced Machine Learning. 

Operating as the central web client within a larger cross-platform ecosystem, this frontend works in perfect synchronization with a dedicated Flutter mobile application. Both platforms share a unified **Supabase PostgreSQL** database, ensuring real-time state management, secure authentication, and instantaneous history syncing across all user devices.

---

## ✨ Core Features

* ⚡ **Real-Time ML Inference:** Interacts directly with a highly optimized Python/FastAPI predictive model. Analyzes complex medical parameters (e.g., cholesterol, blood pressure, BMI) and lifestyle data in milliseconds.
* 🎨 **Premium UI/UX:** Built with **Tailwind CSS** and **Framer Motion**, delivering fluid micro-animations, an intuitive multi-step data entry form, and a frictionless user experience.
* 🔐 **Enterprise-Grade Security:** Utilizes **Supabase Auth** for secure, encrypted user registration, login, and session management.
* 🔄 **Cross-Platform Syncing:** True omnichannel experience. Predictions logged on the web platform are instantly pushed and visible on the companion Flutter mobile application (and vice versa).
* 📊 **Analytics & History:** Comprehensive dashboard providing a chronological view of medical history, allowing users to track their cardiovascular risk trends over time using interactive **Recharts**.

---

## 🏗️ System Architecture

CardioGuard strictly follows a separation-of-concerns architecture, ensuring scalability and maintainability:

1.  **The Interface (Next.js 14):** This repository. Handles routing, server-side rendering (SSR), and client-side UI/UX.
2.  **The Brain (FastAPI + ML Model):** A separate Python microservice that calculates AI risk logic using advanced predictive algorithms.
3.  **The State (Supabase):** The central nervous system handling all persistent data (Users, Prediction Logs) and cross-platform synchronization via PostgreSQL.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (React 18), TypeScript |
| **Styling & UI** | Tailwind CSS, shadcn/ui |
| **Animations** | GSAP, Framer Motion |
| **Icons & Charts**| Lucide Icons, Chart.js, Recharts |
| **BaaS / Database**| Supabase (PostgreSQL, Auth) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started Locally

Follow these steps to set up the development environment on your local machine.

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm**, **yarn**, or **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/shakeelscribes/cvd-website.git
cd cvd-website
```

### 2. Install Dependencies

```bash
npm install
# or 'yarn install' / 'pnpm install'
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory. You will need your Supabase project keys and the URL to your deployed FastAPI backend.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ML Backend Connection
NEXT_PUBLIC_FASTAPI_URL=https://cardiovascluar-backend.onrender.com
```

### 4. Boot the Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser to view the application.

---

## 🌐 Production Deployment

This project is highly optimized for edge deployment via **Vercel**.

1.  Push your latest code to your GitHub repository.
2.  Import the project into your [Vercel Dashboard](https://vercel.com).
3.  In the Vercel project settings, navigate to **Environment Variables** and add:
      * `NEXT_PUBLIC_SUPABASE_URL`
      * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      * `NEXT_PUBLIC_FASTAPI_URL`
4.  Ensure the **Root Directory** is configured correctly if this Next.js app sits inside a mono-repo subfolder.
5.  Click **Deploy**. Vercel will handle the CI/CD pipeline automatically.

---

## 👥 The Team

This project is developed and maintained by the following core team members:

| Role | Name |
| :--- | :--- |
| **Team Lead / Project Manager** | Mohamed Shakeel |
| **Core Developer** | Mohamed Imran |
| **Core Developer** | Sri Thandapani |
| **Core Developer** | Shabith Subair |

<br>
<div align="center">
  <i>Engineered for the future of healthcare.</i>
</div>