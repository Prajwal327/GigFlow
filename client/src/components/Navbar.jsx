import { Link, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

const Navbar = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser");
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
            GigFlow.
          </span>
        </Link>

        {/* NAVIGATION */}
        <div className="flex items-center gap-6 font-medium text-sm text-gray-600">
          <Link to="/" className="hover:text-green-600 transition-colors">Explore</Link>
          <Link to="/about" className="hover:text-green-600 transition-colors">About</Link>
          
          {!currentUser ? (
            <>
              <Link to="/login" className="hover:text-green-600 transition-colors">Sign In</Link>
              <Link to="/register" 
                className="bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                Join Now
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-gray-900 font-bold hidden md:block">Hi, {currentUser.name}</span>
              
              {/* --- CHANGED: Visible to ALL logged-in users --- */}
              <Link to="/add" className="text-green-600 border border-green-600 px-4 py-2 rounded-full hover:bg-green-50 transition-colors">
                + Post Job
              </Link>
              {/* ----------------------------------------------- */}

              <Link to="/profile">
                {currentUser.img ? (
                    <img src={currentUser.img} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-green-100" />
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {currentUser.name.charAt(0)}
                    </div>
                )}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;