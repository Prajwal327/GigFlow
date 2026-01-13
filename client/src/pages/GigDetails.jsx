import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // To get ID from URL
import newRequest from "../utils/newRequest";

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidForm, setBidForm] = useState({ message: "", price: "" });
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("currentUser")));

  // Fetch Gig Data & Bids on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gigRes = await newRequest.get(`/gigs/${id}`);
        setGig(gigRes.data);

        // If I am the owner, fetch the bids too
        if (currentUser && gigRes.data.ownerId?._id === currentUser._id) {
          const bidsRes = await newRequest.get(`/bids/${id}`);
          setBids(bidsRes.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, currentUser]);

  // Handle Placing a Bid
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/bids", { ...bidForm, gigId: id });
      alert("Bid placed successfully!");
      navigate("/");
    } catch (err) {
      alert("Error placing bid");
    }
  };

  // Handle Hiring Logic
  const handleHire = async (bidId) => {
    try {
      await newRequest.patch(`/bids/${bidId}/hire`);
      // Update UI instantly without refresh
      setGig((prev) => ({ ...prev, status: "Assigned" }));
      setBids((prev) =>
        prev.map((bid) =>
          bid._id === bidId ? { ...bid, status: "Hired" } : { ...bid, status: "Rejected" }
        )
      );
    } catch (err) {
      alert("Error hiring freelancer");
    }
  };

  if (!gig) return <div className="p-10">Loading...</div>;

  const isOwner = currentUser?._id === gig.ownerId._id;

  return (
    <div className="py-10 max-w-4xl mx-auto">
      {/* Gig Header */}
      <div className="bg-white p-8 rounded-lg shadow border mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-800">{gig.title}</h1>
          <span className={`px-4 py-1 rounded-full text-sm font-bold ${gig.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
            {gig.status}
          </span>
        </div>
        <p className="text-gray-600 mt-4 text-lg">{gig.description}</p>
        <div className="mt-6 pt-6 border-t flex justify-between">
          <div>
            <span className="text-gray-400 text-sm">Budget</span>
            <p className="text-2xl font-bold text-green-700">${gig.budget}</p>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-sm">Posted By</span>
            <p className="font-medium">{gig.ownerId.name}</p>
          </div>
        </div>
      </div>

      {/* SECTION A: If Owner -> Show Bids */}
      {isOwner && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Received Bids ({bids.length})</h2>
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid._id} className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">{bid.freelancerId.name}</h4>
                  <p className="text-gray-600">{bid.message}</p>
                  <p className="text-green-600 font-bold mt-1">${bid.price}</p>
                </div>
                
                {/* HIRE BUTTON LOGIC */}
                {gig.status === "Open" ? (
                  <button 
                    onClick={() => handleHire(bid._id)}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Hire
                  </button>
                ) : (
                  <span className={`font-bold ${bid.status === 'Hired' ? 'text-green-600' : 'text-red-400'}`}>
                    {bid.status}
                  </span>
                )}
              </div>
            ))}
            {bids.length === 0 && <p className="text-gray-500">No bids yet.</p>}
          </div>
        </div>
      )}

      {/* SECTION B: If Freelancer -> Show Bid Form */}
      {!isOwner && gig.status === "Open" && (
        <div className="bg-white p-8 rounded-lg shadow border">
          <h2 className="text-2xl font-bold mb-4">Place a Bid</h2>
          <form onSubmit={handleBidSubmit} className="flex flex-col gap-4">
            <textarea
              placeholder="Why are you a good fit?"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
              rows="4"
              onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
            />
            <input
              type="number"
              placeholder="Your Offer Price ($)"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
              onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
            />
            <button className="bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition">
              Submit Proposal
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GigDetails;