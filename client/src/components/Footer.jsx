import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-300 py-8 mt-20 text-center">
      <div className="flex justify-center gap-6 mb-4">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <Link to="/about" className="hover:text-white transition">About Us</Link>
        <Link to="/about" className="hover:text-white transition">Contact</Link>
      </div>
      <p className="text-sm">© 2026 GigFlow. All rights reserved.</p>
    </div>
  );
};

export default Footer;