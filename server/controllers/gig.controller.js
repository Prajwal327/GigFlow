import Gig from "../models/Gig.js";

export const createGig = async (req, res, next) => {
  try {
    // Basic validation
    if (!req.body.title || !req.body.description || !req.body.budget) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newGig = new Gig({
      ...req.body,
      ownerId: req.userId, // From the verifyToken middleware
    });

    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    res.status(500).json({ message: "Error creating gig" });
  }
};


// Get My Gigs function
export const getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ ownerId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my gigs" });
  }
};

//Delete Gig function
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    // Check if gig exists
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // Check if the user trying to delete is the OWNER
    if (gig.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own gigs!" });
    }

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gig has been deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting gig" });
  }
};

export const getGigs = async (req, res, next) => {
  const q = req.query;
  
  // Filter Logic:
  // 1. Show only "Open" gigs (unless specific override)
  // 2. If 'search' query exists, look for it in the title (Case insensitive)
  
  const filters = {
    status: "Open", 
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  try {
    const gigs = await Gig.find(filters).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gigs" });
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("ownerId", "name email");
    if (!gig) return res.status(404).json({ message: "Gig not found!" });
    res.status(200).json(gig);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gig" });
  }
};


export const updateGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // Check ownership
    if (gig.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own gigs!" });
    }

    // Perform Update
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body, // Update with whatever data is sent
      },
      { new: true } // Return the updated version
    );

    res.status(200).json(updatedGig);
  } catch (err) {
    res.status(500).json({ message: "Error updating gig" });
  }
};