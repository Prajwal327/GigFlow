import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import newRequest from "../utils/newRequest";

const EditGig = () => {
  const { id } = useParams(); // Get Gig ID from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Development",
  });

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await newRequest.get(`/gigs/${id}`);
        setFormData({
            title: res.data.title,
            description: res.data.description,
            budget: res.data.budget,
            category: res.data.category
        });
      } catch (err) {
        toast.error("Error loading gig details");
      }
    };
    fetchGig();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 2. Send Update Request (PUT)
      await newRequest.put(`/gigs/${id}`, formData);
      toast.success("Gig Updated Successfully!");
      navigate("/profile"); // Go back to profile
    } catch (err) {
      toast.error("Failed to update gig");
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow border">
        <h1 className="text-2xl font-bold mb-6">Edit Gig</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
            <input 
                name="title" 
                value={formData.title} 
                required 
                className="w-full p-3 border rounded-lg" 
                onChange={handleChange} 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                className="w-full p-3 border rounded-lg bg-white" 
                onChange={handleChange}
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Writing">Writing</option>
                <option value="Animation">Animation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
              <input 
                name="budget" 
                type="number" 
                value={formData.budget} 
                required 
                className="w-full p-3 border rounded-lg" 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
                name="description" 
                value={formData.description} 
                required 
                rows="5" 
                className="w-full p-3 border rounded-lg" 
                onChange={handleChange} 
            />
          </div>

          <div className="flex gap-4">
              <button type="submit" className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
                Save Changes
              </button>
              <button type="button" onClick={() => navigate("/profile")} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGig;