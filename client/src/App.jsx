import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast"; // For Popups
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client"; // For Real-time updates

// Pages
import About from "./pages/About";
import AddGig from "./pages/AddGig";
import EditGig from "./pages/EditGig";
import GigDetails from "./pages/GigDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

// Components
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
  
  // --- REAL-TIME NOTIFICATION SYSTEM ---
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser) {
      // 1. Connect to Backend
     const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");
      // 2. Identify Myself (So server knows my Socket ID)
      socket.emit("identify", currentUser._id);

      // 3. Listen for "Hired" Notification
      socket.on("notification", (data) => {
        // Show a special green Toast
        toast.success(data.message, {
           duration: 6000,
           icon: '🎉',
           style: {
             border: '2px solid #4ade80',
             padding: '16px',
             color: '#166534',
             background: '#f0fdf4'
           },
        });
        
        // Optional: Play a sound
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play().catch(e => console.log("Audio blocked"));
      });

      // 4. Cleanup on Logout/Close
      return () => {
        socket.disconnect();
      };
    }
  }, []);
  // -------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <BrowserRouter>
        <Navbar />
        {/* Global Popup Manager */}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gig/:id" element={<GigDetails />} />
            <Route path="/add" element={<AddGig />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit/:id" element={<EditGig />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;