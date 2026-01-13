import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    img: "", // Profile Picture URL
    isSeller: false,
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSeller = (e) => {
    setUser((prev) => ({ ...prev, isSeller: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/auth/register", user);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 py-10">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg border border-white/50 backdrop-blur-lg">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">Create Account</h1>
        <p className="text-gray-500 text-center mb-8">Join GigFlow today.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Toggle Switch */}
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border">
            <span className="font-medium text-gray-700">I want to be a Freelancer</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" onChange={handleSeller} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div>
             <label className="text-sm font-medium text-gray-700">Full Name</label>
             <input name="name" type="text" placeholder="John Doe" required className="input-field" onChange={handleChange} />
          </div>

          <div>
             <label className="text-sm font-medium text-gray-700">Email</label>
             <input name="email" type="email" placeholder="john@example.com" required className="input-field" onChange={handleChange} />
          </div>

          <div>
             <label className="text-sm font-medium text-gray-700">Password</label>
             <input name="password" type="password" placeholder="Min 6 characters" required className="input-field" onChange={handleChange} />
          </div>

          <div>
             <label className="text-sm font-medium text-gray-700">Profile Picture URL (Optional)</label>
             <input name="img" type="text" placeholder="https://..." className="input-field" onChange={handleChange} />
          </div>

          <button 
            type="submit" 
            className="mt-2 bg-gray-900 text-white font-bold py-3.5 rounded-lg shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Register Now
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-bold hover:underline">Log In</Link>
        </p>
      </div>

      {/* Internal CSS for clean inputs */}
      <style>{`
        .input-field {
          margin-top: 5px;
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          outline: none;
          transition: all 0.3s;
        }
        .input-field:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Register;