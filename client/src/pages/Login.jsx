import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { email, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      toast.success("Welcome back!", { icon: "👋" });
      navigate("/");
      window.location.reload(); // Refresh to update Navbar
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto my-10 border border-gray-100">
      
      {/* LEFT SIDE: IMAGE */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center relative" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80')" }}>
        <div className="absolute inset-0 bg-green-900 bg-opacity-40 flex items-center justify-center">
            <div className="text-white text-center p-10">
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="opacity-90">Connect with top talent and get your work done effortlessly.</p>
            </div>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
        <p className="text-gray-500 mb-8">Please enter your details.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="mt-4 bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;