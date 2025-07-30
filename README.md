

---

# 🌱 Wellness Sessions Platform

A **MERN stack** application where users can **create, edit, and publish** wellness sessions.
Published sessions are **publicly accessible**, while drafts remain **private** to the creator.

🔗Deployed Link : https://wellness-assignment.vercel.app/

---

## ✨ Features

* 🔐 **User authentication** (JWT-based)  
* 📝 **Create, edit, and delete sessions**  
* 💾 **Save sessions as drafts or publish them**  
* 🌍 **View all published sessions without login**  
* 📊 **User dashboard to manage drafts and published sessions**  
* 📝 **Session content is automatically saved:**  
  ⏱️ After **5 seconds** of user inactivity, and  
  🔁 Every **30 seconds**, regardless of activity (as a backup)  
* ✅ **This ensures users don’t lose progress while editing sessions**













---

## 🛠 **Tech Stack**

* **Frontend:** ⚛️ React (Vite), 🎨 Tailwind CSS, 🌐 Axios, 🧭 React Router
* **Backend:** 🟢 Node.js, 🚀 Express.js, 🍃 MongoDB, 🗃 Mongoose
* **Authentication:** 🔑 JWT

---

## 🚀 **Setup Instructions**

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/wellness-sessions.git
cd wellness-sessions
```

### 2️⃣ Install dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the **server** folder:

```
MONGO_URI=your_mongodb_connection_string
Port=your_port_number
MONGO_DB_NAME=your_db_name
REFRESH_TOKEN_EXPIRY=expiry_day_number
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

ACCESS_TOKEN_EXPIRY=expiry_time
ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

### 4️⃣ Start the backend

```bash
cd backend
npm run dev
```

### 5️⃣ Start the frontend

```bash
cd frontend
npm run dev
```

---

## 📡 **API Routes & Documentation**

### 🔑 **Authentication**

* **POST** `/api/v1/auth/register` – Register a new user
* **POST** `/api/v1/auth/login` – Login user and return JWT
* **GET** `/api/v1/auth/logout` – Logout user (invalidate JWT)

---

### 📋 **Sessions**

* **GET** `/api/sessions/published`
  *Public route* – Fetch all published sessions

* **GET** `/api/sessions`
  *Protected route* – Fetch all sessions of the logged-in user

* **POST** `/api/sessions`
  *Protected route* – Create a new session

  ```json
  {
    "title": "Morning Mindfulness",
    "tags": ["Mindfulness", "Routine"],
    "jsonUrl": "https://wellnesshub.com/morning-mindfulness",
    "content": "Start your day with intention..."
  }
  ```

* **GET** `/api/sessions/:sessionId`
  *Protected route* – Fetch a specific session by ID (creator access only for drafts, public for published)

* **PUT** `/api/sessions/:sessionId`
  *Protected route* – Update an existing session (only if status is draft)

* **DELETE** `/api/sessions/:sessionId`
  *Protected route* – Delete a session

---

## 🧭 **Frontend Routes**

* `/login` – User login
* `/register` – User registration
* `/dashboard` – User-specific session management
* `/editor/new` – Create a new session
* `/editor/:id` – Edit an existing session (only drafts)
* `/view/:id` – View session details (public for published, private for drafts)
* `/published` – List of all published sessions

---


 
