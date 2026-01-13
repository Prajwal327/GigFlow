import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Gig from "./models/Gig.js";
import User from "./models/user.js";

dotenv.config();

// --- DUMMY DATA CONFIG ---
const PASS = "123456"; // All dummy users will have this password
const SALT_ROUNDS = 10;

const dummyUsers = [
  { name: "Alice Designer", email: "alice@test.com", isSeller: true },
  { name: "Bob Developer", email: "bob@test.com", isSeller: true },
  { name: "Charlie Writer", email: "charlie@test.com", isSeller: true },
  { name: "Diana Marketing", email: "diana@test.com", isSeller: true },
  { name: "Evan Client", email: "evan@test.com", isSeller: false }, // Buyer only
];

const dummyGigs = [
  {
    title: "Modern Logo Design for Tech Startup",
    desc: "I need a minimalist logo for my AI company. Colors should be blue and white.",
    cat: "Design",
    price: 150,
    cover: "https://images.pexels.com/photos/430205/pexels-photo-430205.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Fix React Native Bugs in Mobile App",
    desc: "My app crashes on login. Need an expert to debug and fix state management issues.",
    cat: "Development",
    price: 300,
    cover: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Write SEO Blog Posts for Travel Site",
    desc: "Looking for 5 articles about hidden gems in Italy. 1000 words each.",
    cat: "Writing",
    price: 50,
    cover: "https://images.pexels.com/photos/768473/pexels-photo-768473.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Social Media Manager for Fashion Brand",
    desc: "Manage Instagram and TikTok for 1 month. Create content and engage followers.",
    cat: "Marketing",
    price: 500,
    cover: "https://images.pexels.com/photos/16129728/pexels-photo-16129728/free-photo-of-man-coding-on-pc.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "2D Animation for Explainer Video",
    desc: "Create a 60-second animation explaining how our solar panels work.",
    cat: "Animation",
    price: 400,
    cover: "https://images.pexels.com/photos/6211603/pexels-photo-6211603.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "E-commerce Website Development",
    desc: "Build a Shopify-like store using MERN stack with payment gateway integration.",
    cat: "Development",
    price: 1200,
    cover: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Translate Legal Documents to Spanish",
    desc: "Official translation needed for a 20-page contract.",
    cat: "Writing",
    price: 100,
    cover: "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Custom Illustration for Book Cover",
    desc: "Fantasy style artwork needed for a young adult novel.",
    cat: "Design",
    price: 250,
    cover: "https://images.pexels.com/photos/15032623/pexels-photo-15032623/free-photo-of-tourists-on-a-rooftop-overlooking-the-city-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Google Ads Campaign Setup",
    desc: "Setup and optimize PPC campaign for a local dentist.",
    cat: "Marketing",
    price: 200,
    cover: "https://images.pexels.com/photos/1136575/pexels-photo-1136575.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Fix WordPress Plugin Conflict",
    desc: "Urgent help needed. My site is down due to a plugin error.",
    cat: "Development",
    price: 80,
    cover: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");

    // OPTIONAL: Clear existing data to avoid duplicates
    // await User.deleteMany({});
    // await Gig.deleteMany({});
    // console.log("Cleared old data...");

    // 1. Create Users
    const hashedPassword = await bcrypt.hash(PASS, SALT_ROUNDS);
    
    const usersWithPass = dummyUsers.map(u => ({
        ...u,
        password: hashedPassword,
        country: "USA", // Default fields
        desc: "I am a professional freelancer.",
    }));

    const createdUsers = await User.insertMany(usersWithPass);
    console.log(`Created ${createdUsers.length} Users`);

    // 2. Create Gigs (Randomly assigned to users)
    const gigsWithOwners = dummyGigs.map((gig) => {
        // Pick a random user from the ones we just created
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        
        return {
            ownerId: randomUser._id, // LINK THE ID
            title: gig.title,
            description: gig.desc, // Map 'desc' to 'description'
            budget: gig.price,     // Map 'price' to 'budget'
            category: gig.cat,     // Map 'cat' to 'category'
            cover: gig.cover,
            status: "Open"
        };
    });

    await Gig.insertMany(gigsWithOwners);
    console.log(`Created ${gigsWithOwners.length} Gigs`);

    console.log("✅ Seeding Complete!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();