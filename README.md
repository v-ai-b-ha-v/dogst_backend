# 🐶 DOGST Backend – Gamified Digital Wellness Platform

Backend services powering **DOGST**, a full-stack gamified productivity application that encourages healthier digital habits by rewarding users for staying within their daily screen-time goals. The backend manages authentication, XP progression, streak tracking, leaderboard generation, and user analytics through secure REST APIs.

> 🔐 Firebase Authentication  
> ☁️ MongoDB Atlas for persistent storage  
> 🚀 Deployed on Render  
> 📱 Frontend Repository: https://github.com/v-ai-b-ha-v/dogst_frontend

---

# ✨ Features

- Secure Firebase ID token authentication using Firebase Admin SDK
- RESTful APIs for user onboarding, profile management, and synchronization
- XP calculation based on daily screen-time goals
- Streak tracking and bonus XP rewards
- Dynamic pet evolution and level progression system
- Leaderboard-ready backend architecture
- Daily statistics and screen-time tracking
- Modular Express.js API architecture
- MongoDB persistence with Mongoose schemas

---

# 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | Firebase Admin SDK |
| Deployment | Render |
| Configuration | dotenv |

---

# 📂 Project Structure

```text
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── config/
├── server.js
└── package.json
```

---

# 🚀 Core Backend Responsibilities

- Authenticate users using Firebase ID tokens
- Store and manage user profiles
- Process daily screen-time updates
- Calculate XP and streak bonuses
- Determine pet evolution and level progression
- Expose leaderboard and analytics APIs
- Persist application state in MongoDB

---

# 🔒 Authentication

Every protected endpoint validates Firebase ID tokens using the Firebase Admin SDK before processing requests, ensuring only authenticated users can access their data.

---

# 🌐 API Highlights

- User initialization
- User profile retrieval
- Screen-time synchronization
- XP & streak calculation
- Leaderboard retrieval

---

# 📈 Deployment

The backend is deployed on **Render** and uses **MongoDB Atlas** as the cloud database.

---

# 📱 Related Project

Frontend Repository

https://github.com/v-ai-b-ha-v/dogst_frontend
