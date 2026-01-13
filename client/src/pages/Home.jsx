import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

// --- CATEGORY IMAGE MAPPING (Fixed) ---
const categoryImages = {
  "Development": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  "Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  "Marketing": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
  "Writing": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
  
  // NEW RELIABLE IMAGE FOR ANIMATION
  "Animation": "https://images.unsplash.com/photo-1633511090164-b43840ea1607?auto=format&fit=crop&w=800&q=80", 
  "animation": "https://images.unsplash.com/photo-1633511090164-b43840ea1607?auto=format&fit=crop&w=800&q=80", 

  "Default": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80"
};

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  
  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minBudget, setMinBudget] = useState(0);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await newRequest.get(`/gigs?search=${search}`);
        setGigs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [search]);

  // Apply Filters Logic
  const filteredGigs = gigs.filter((gig) => {
    // Handle case sensitivity safely
    const gigCategory = gig.category || "Development"; 
    
    // Check match
    const matchesCategory = category === "All" || gigCategory.toLowerCase() === category.toLowerCase();
    const matchesBudget = gig.budget >= minBudget;
    
    return matchesCategory && matchesBudget;
  });

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <div className="relative bg-gray-900 rounded-3xl overflow-hidden mb-12 text-white shadow-2xl w-full mt-2">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-teal-900/80 z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        
        <div className="relative z-20 px-6 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                Find the perfect <span className="text-green-400">freelance</span> <br/> services for your business.
            </h1>
            
            <div className="flex max-w-lg mx-auto bg-white rounded-full p-2 shadow-xl mt-8">
                <input 
                    type="text" 
                    placeholder="What are you looking for?" 
                    className="flex-grow px-6 py-3 rounded-full text-gray-800 outline-none w-full"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">
                    Search
                </button>
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 px-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Popular Gigs</h2>
          <p className="text-gray-500 mt-1">Most viewed services today</p>
        </div>

        {/* FILTER BAR */}
        <div className="flex gap-3 bg-white p-2 rounded-xl border shadow-sm">
           <select className="bg-transparent text-sm font-medium outline-none px-2 py-1 text-gray-600 hover:text-green-600 cursor-pointer" onChange={(e) => setCategory(e.target.value)}>
             <option value="All">All Categories</option>
             <option value="Development">Development</option>
             <option value="Design">Design</option>
             <option value="Marketing">Marketing</option>
             <option value="Writing">Writing</option>
             <option value="Animation">Animation</option>
           </select>
           <div className="w-[1px] bg-gray-200"></div>
           <input 
             type="number" 
             placeholder="Min Budget ($)" 
             className="text-sm px-2 py-1 w-32 outline-none" 
             onChange={(e) => setMinBudget(Number(e.target.value))} 
           />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading amazing gigs...</div>
      ) : filteredGigs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">No gigs found matching your filters.</p>
        </div>
      ) : (
        // GRID LAYOUT: Added 'xl:grid-cols-4' to fill space on wide screens
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredGigs.map((gig) => {
            // LOGIC: Use manual cover OR fallback to Category Image OR Default
            const displayImage = gig.cover 
                ? gig.cover 
                : (categoryImages[gig.category] || categoryImages[gig.category?.toLowerCase()] || categoryImages["Default"]);

            return (
              <div 
                key={gig._id} 
                onClick={() => navigate(`/gig/${gig._id}`)} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                {/* Dynamic Image */}
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  <img 
                      src={displayImage} 
                      alt={gig.category} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {gig.category || "General"}
                  </span>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-green-600 transition-colors">
                          {gig.title}
                      </h3>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{gig.description}</p>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-medium uppercase">Starting at</span>
                      <span className="text-xl font-extrabold text-gray-900">${gig.budget}</span>
                    </div>
                    
                    <span className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold group-hover:bg-green-600 group-hover:text-white transition-colors">
                      View
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;