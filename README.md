# 🧩 Status Up

**Status Up** is a **Kanban-style Job Tracker** built with **Next.js** and **MongoDB**, designed to help users manage and visualize their job applications across different stages.  
It features a modern, drag-and-drop interface with authentication via **NextAuth (Google & Credentials)** and persistent storage in MongoDB.

---

## 🚀 Tech Stack

- **Next.js 16** (App Router)
- **MongoDB + Mongoose**
- **NextAuth.js** (Google + Credentials Sign-in)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (for smooth animations)
- **React DnD / Drag-and-Drop**
- **next-themes** (Dark Mode Toggle)

---

## 🎯 Purpose

Status Up helps job seekers stay organized by providing a **visual Kanban board** to track the progress of job applications.  
Each card represents a job, and users can move them between columns such as _Applied_, _Interviewing_, _Offer Received_, and _Rejected_.

---

## 🧩 Features

✅ **Authentication**

- Secure login with **Credentials** or **Google Sign-In** using NextAuth.
- Protected routes for authenticated users.

✅ **Kanban Job Board**

- Default columns:
  - Applied
  - Interviewing
  - Offer Received
  - Rejected
  - Hired

✅ **Job Management**

- Add new job cards with details like company name, role, and date applied.
- Edit or delete existing job cards.
- Drag & drop jobs between columns to update their status.

✅ **Data Persistence**

- All jobs are stored in **MongoDB**, ensuring your board remains intact between sessions.

✅ **Analytics**

- Displays the **total number of job applications**.

✅ **Dark Mode**

- Built-in **theme toggle** powered by `next-themes`.

---

## 🖥️ Demo

🔗 **Live Deployment:** [https://status-up.vercel.app](https://status-up.vercel.app)

_(Make sure to allow Google Sign-In on the deployed domain via Google Cloud Console.)_

---

## 🛠️ Local Development Setup

Follow these steps to run **Status Up** locally 👇

```bash
# 1. Clone the repository
git clone https://github.com/your-username/status-up.git
cd status-up

# 2. Install dependencies
npm install

# 3. Create a .env.local file in the root directory
# and add the following environment variables:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
