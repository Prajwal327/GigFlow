# 🚀 GigFlow - Freelance Marketplace

GigFlow is a full-stack MERN application connecting Clients with Freelancers. It features a complete bidding system, real-time notifications, and secure hiring workflows.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)

## ✨ Key Features

### 🔹 Core Functionality
- **Authentication:** Secure JWT-based Login/Register (HttpOnly Cookies).
- **Dual Roles:** Users can act as Clients (Post Jobs) or Freelancers (Bid on Jobs).
- **Gig Management:** Create, Edit, and Delete Gigs with rich text descriptions.
- **Search & Filter:** Filter gigs by Category, Budget, and Search queries.

### 🏆 Advanced Features (Bonus Implemented)
- **⚡ Real-Time Notifications (Socket.io):** When a Client hires a Freelancer, the Freelancer receives an instant "You are Hired" popup without refreshing the page.
- **🔒 Transactional Integrity (Race Conditions):** Uses **MongoDB Sessions & Transactions** to ensure that if two admins try to hire different people for the same gig simultaneously, only one succeeds.
- **🤖 Automated Workflow:** Hiring a freelancer automatically marks the Gig as "Assigned" and rejects all other pending bids.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Socket.io Client, React Hot Toast.
- **Backend:** Node.js, Express.js, Socket.io.
- **Database:** MongoDB Atlas (Mongoose).
- **DevOps:** Ready for Render (Backend) & Vercel (Frontend).

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/YourUsername/GigFlow.git](https://github.com/YourUsername/GigFlow.git)
cd GigFlow
```

### 2. Backend Setup
```bash
cd server
npm install
```

**Create a `.env` file** in the `server` folder and add your credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_KEY=your_secret_key
CLIENT_URL=http://localhost:5173
```

**Seed Database (Optional):**
Populate the DB with dummy users and gigs:
```bash
node seed.js
```

**Start Server:**
```bash
node index.js
```
*(Server runs on port 5000)*

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
*(Client runs on port 5173)*

---

## 🧪 Testing Credentials (from Seed Data)

If you ran `node seed.js`, use these accounts to test the flow:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Client** | `alice@test.com` | `123456` |
| **Freelancer** | `bob@test.com` | `123456` |

---

## 📸 Application Flow

1. **Register/Login** as a Client.
2. **Post a Gig** via the "Post Job" button.
3. **Login** as a different user (Freelancer).
4. **Place a Bid** on the gig.
5. **Switch back to Client** and click "Hire" on the bid.
6. **Watch** the Real-time notification appear on the Freelancer's screen!

---

## 📂 Project Structure

```
GigFlow/
├── client/            # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
├── server/            # Node.js Backend
│   ├── controllers/   # Business Logic
│   ├── models/        # Database Schemas
│   ├── routes/        # API Endpoints
│   └── index.js       # Entry Point
└── README.md
```