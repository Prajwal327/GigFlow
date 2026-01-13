import { useState } from "react";
import toast from "react-hot-toast"; // Use our new tool
import { useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

const AddGig = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Development", // Default value
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/gigs", formData);
      toast.success("Gig Posted Successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Failed to post gig");
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow border">
        <h1 className="text-2xl font-bold mb-6">Post a New Gig</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
            <input name="title" required placeholder="e.g. Build a Website" className="w-full p-3 border rounded-lg" onChange={handleChange} />
          </div>

          {/* NEW: CATEGORY DROPDOWN */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select name="category" className="w-full p-3 border rounded-lg bg-white" onChange={handleChange}>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Writing">Writing</option>
                <option value="Animation">Animation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
              <input name="budget" type="number" required placeholder="500" className="w-full p-3 border rounded-lg" onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea name="description" required rows="5" placeholder="Project details..." className="w-full p-3 border rounded-lg" onChange={handleChange} />
          </div>

          <button type="submit" className="bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
            Publish Gig
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGig;