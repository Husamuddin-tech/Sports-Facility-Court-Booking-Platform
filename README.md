# 🏆 Sports Facility Court Booking Platform

A full‑stack web application that allows users to browse courts, view availability, select time slots, add optional coaches or equipment, and make bookings. Admin users can manage courts, coaches, equipment, pricing, and view all bookings.

> Full‑stack project with **React + Vite frontend** and **Node.js + Express + MongoDB backend**.

---

## 📌 Features

### 🌟 User Functionality
- User sign up and login (JWT Authentication)
- Browse available courts
- View available time slots for selected date
- Select coach and equipment add‑ons
- Calculate dynamic pricing based on rules
- Book selected slots
- View “My Bookings” with status & price breakdown

### 🔧 Admin Functionality
- Manage courts (create, update, delete, toggle active)
- Manage coaches & equipment
- Manage pricing rules
- View all bookings

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| API Client | Axios |
| UI | react‑hot‑toast, react‑icons |

---

## 📁 Repository Structure

```
Sports-Facility-Court-Booking-Platform/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── README.md
└── package.json
```

---

## 🔌 Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or remote)

---

## 🛠️ Backend Setup

### 1. Navigate to backend
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Create `.env` from `.env.example`:

```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### 4. Run backend
```bash
npm run dev
```

---

## 🛠️ Frontend Setup

### 1. Navigate to frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run frontend
```bash
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

## 🧪 Testing the Project

### 1️⃣ Register & Login  
Use **/register** and **/login** pages.

### 2️⃣ Book a Court  
- Select court  
- Choose date  
- Select slot  
- Add equipment/coach  
- Confirm booking  

### 3️⃣ Admin Panel  
Admins can:
- Manage courts
- Manage pricing
- View all bookings

---

## 🤝 Contributing

1. Fork repository  
2. Create feature branch  
3. Commit changes  
4. Push & open PR  

---

## 📫 Contact  
For help, open an issue in the repository.
