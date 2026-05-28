# 🎓 CampusAtlas

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-blue?style=for-the-badge)](https://campus-atlas.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/AyushKhaitan1/College-Discovery-Platform)

**CampusAtlas** is a modern, full-stack College Discovery Platform designed to help students make informed decisions about their higher education. With dynamic college comparisons, an interactive community forum, placement statistics, and a sleek user interface, CampusAtlas is the ultimate hub for aspiring college students.

---

## ✨ Features

- **College Explorer:** Browse through top colleges with detailed insights on fees, exams, and placement statistics.
- **Dynamic Comparisons:** Select multiple colleges to evaluate their fees, placements, and ratings side-by-side in a beautiful grid layout.
- **Interactive Forum:** Ask questions, share experiences, and connect with other students. Includes full CRUD capabilities with authorization.
- **Save to Profile:** Save your favorite colleges and previous comparison grids directly to your user profile for easy access later.
- **College Predictor:** Input your exam scores to find out which colleges you have the best chance of getting into based on real cutoff data.
- **Responsive Design:** Fully optimized for all devices, from desktop monitors to mobile phones.

---

## 🛠️ Technology Stack

**Frontend:**
- **React.js** (Vite)
- **CSS Modules** (Custom modern styling with glassmorphism)
- **React Router** (Navigation)
- **Axios** (API requests)

**Backend:**
- **Node.js** & **Express.js** (REST API)
- **Prisma ORM** (Database interaction)
- **PostgreSQL** (Relational database hosted on Neon)
- **JWT** & **Bcrypt** (Authentication and Security)

---

## 🚀 Getting Started (Local Development)

To run this project locally on your machine, follow these steps:

### Prerequisites
- Node.js (v16 or higher)
- A PostgreSQL database (Local or Cloud like Neon/Supabase)

### 1. Clone the Repository
```bash
git clone https://github.com/AyushKhaitan1/College-Discovery-Platform.git
cd College-Discovery-Platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your credentials:
```env
PORT=5000
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_super_secret_key"
```

Push the database schema and seed the initial data:
```bash
npx prisma db push
node prisma/seed.js
node prisma/apply_local_images.js
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AyushKhaitan1/College-Discovery-Platform/issues).

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
