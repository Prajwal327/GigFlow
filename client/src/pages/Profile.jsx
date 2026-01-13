import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [myGigs, setMyGigs] = useState([]);
  const [myBids, setMyBids] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gigsRes = await newRequest.get("/gigs/my");
        setMyGigs(gigsRes.data);
        const bidsRes = await newRequest.get("/bids/my");
        setMyBids(bidsRes.data);
      } catch (err) {
        console.log("Error loading profile data");
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

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

  // --- NEW: DELETE FUNCTION ---
  const handleDeleteGig = async (gigId) => {
    if(!window.confirm("Are you sure you want to delete this Gig?")) return;

    try {
      await newRequest.delete(`/gigs/${gigId}`);
      // Remove from UI instantly
      setMyGigs((prev) => prev.filter((gig) => gig._id !== gigId));
    } catch (err) {
      alert("Error deleting gig");
    }
  };
  // -----------------------------

  if (!currentUser) return <div className="p-10">Please Log In</div>;

  return (
    <div className="py-10">
      <div className="bg-white p-8 rounded-lg shadow border mb-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {currentUser.img ? (
  <img 
    src={currentUser.img} 
    alt="Profile" 
    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 mb-4 mx-auto"
  />
) : (
  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
    {currentUser.name.charAt(0).toUpperCase()}
  </div>
)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <p className="text-gray-500">{currentUser.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red-50 text-red-600 px-6 py-2 rounded border border-red-100 font-bold hover:bg-red-100">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMN 1: MY POSTED GIGS */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">My Posted Jobs</h2>
          {myGigs.length === 0 ? (
            <p className="text-gray-400">You haven't posted any jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {myGigs.map((gig) => (
                <div key={gig._id} className="border p-4 rounded hover:bg-gray-50 transition relative">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{gig.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${gig.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {gig.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">${gig.budget}</span>
                    
                    <div className="flex gap-3">
    {/* EDIT BUTTON */}
    <Link 
        to={`/edit/${gig._id}`} 
        className="text-sm text-blue-500 font-bold hover:text-blue-700"
    >
        Edit
    </Link>
    
    <Link to={`/gig/${gig._id}`} className="text-sm text-gray-500 font-bold hover:text-black">
        View
    </Link>
    
    <button 
        onClick={() => handleDeleteGig(gig._id)}
        className="text-sm text-red-500 font-bold hover:text-red-700"
    >
        Delete
    </button>
</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        

        {/* COLUMN 2: MY BIDS */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">My Bids (Applications)</h2>
          {myBids.length === 0 ? (
            <p className="text-gray-400">You haven't applied to any jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {myBids.map((bid) => (
                <div key={bid._id} className="border p-4 rounded hover:bg-gray-50 transition">
                  <h3 className="font-bold text-gray-800">{bid.gigId?.title || "Unknown Gig"}</h3>
                  <p className="text-sm text-gray-500 mt-1">My Offer: <span className="text-black font-bold">${bid.price}</span></p>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold
                      ${bid.status === 'Hired' ? 'bg-green-100 text-green-700' : 
                        bid.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {bid.status}
                    </span>
                    <Link to={`/gig/${bid.gigId?._id}`} className="text-xs text-gray-400 hover:text-black">
                      View Gig
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;