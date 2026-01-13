# GigFlow - Freelance Marketplace (MERN Stack)

GigFlow is a full-stack platform connecting clients with freelancers. It features real-time bidding, automated hiring workflows, and live notifications.

## 🚀 Key Features
- **Authentication:** Secure Login/Register with JWT & Cookies.
- **Role-Based Access:** Clients can post jobs; Freelancers can bid.
- **Advanced Hiring Logic:** - One-click hiring system.
  - **Transactional Integrity:** Prevents race conditions (Double hiring) using MongoDB Sessions.
  - **Auto-Rejection:** Automatically rejects other bids once a freelancer is hired.
- **Real-Time Updates:** Socket.io integration for instant "You are Hired" notifications.
- **Search & Filter:** Filter gigs by category, budget, and search queries.

## 🛠️ Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, Socket.io Client.
- **Backend:** Node.js, Express.js, Socket.io.
- **Database:** MongoDB (Atlas) with Mongoose Transactions.

## 📦 Installation Guide

1. **Clone the repository**
   ```bash
   git clone <your-repo-link>
   cd GigFlow
Setup Backend

Bash

cd server
npm install
# Create a .env file based on .env.example
node seed.js # (Optional: Seeds dummy data)
node index.js
Setup Frontend

# 2. Setup Backend

cd client
npm install
npm run dev
🧪 Credentials for Testing (Seed Data)
Freelancer: bob@test.com / 123456

Client: alice@test.com / 123456


---

### **3. The Loom Video Script (2 Minutes)**
The examiner might not run your code. The video is your proof that it works. Since you need to show the **Hiring Flow**, follow this script exactly.

**Setup before recording:**
* Open **Chrome** (Client account - Alice).
* Open **Incognito/Edge** (Freelancer account - Bob).
* Split your screen so both are visible side-by-side.

**Script:**

* **0:00 - 0:20 (Intro):** * "Hi, this is [Your Name]. This is GigFlow, a marketplace built with the MERN stack."
    * "On the left, I have Alice (Client). On the right, I have Bob (Freelancer)."

* **0:20 - 0:50 (Post & Bid):**
    * "Alice posts a job called 'Fix my Website'." (Show Post Job form).
    * "The job appears instantly on Bob's dashboard." (Refresh Bob's screen).
    * "Bob places a bid of $500." (Submit Bid).

* **0:50 - 1:30 (The "Wow" Moment):**
    * "Now for the advanced logic. Alice goes to her gig and sees Bob's bid."
    * "When Alice clicks **Hire**, two things happen in the background: A MongoDB transaction ensures no one else is hired, and a Socket.io event fires."
    * *(Click the button)*.
    * "As you can see, Bob instantly received a green popup saying **'Congratulations'** without refreshing his page."

* **1:30 - 2:00 (Conclusion):**
    * "The gig status is now 'Assigned'. If we check the database, all other bids were automatically rejected. This ensures data integrity. Thank you."
