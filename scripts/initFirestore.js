import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Use environment variables for configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// First names for generating expert names
const firstNames = [
  "Rajesh",
  "Priya",
  "Vikram",
  "Ananya",
  "Arjun",
  "Kavitha",
  "Rahul",
  "Deepa",
  "Sanjay",
  "Meera",
  "Anil",
  "Divya",
  "Suresh",
  "Neha",
  "Ravi",
  "Sneha",
  "Karthik",
  "Anjali",
  "Vinod",
  "Lakshmi",
];

// Last names for generating expert names
const lastNames = [
  "Kumar",
  "Patel",
  "Singh",
  "Sharma",
  "Nair",
  "Reddy",
  "Iyer",
  "Menon",
  "Pillai",
  "Verma",
  "Gupta",
  "Joshi",
  "Rao",
  "Shah",
  "Choudhury",
  "Das",
  "Chatterjee",
  "Kapoor",
  "Malhotra",
  "Mukherjee",
];

// IT & Networking specialties
const allSpecialties = [
  "Network Setup",
  "PC Repair",
  "WiFi Troubleshooting",
  "Data Recovery",
  "Virus Removal",
  "Smart Home Setup",
  "CCTV Installation",
  "Software Installation",
  "Cloud Setup",
  "Hardware Repair",
  "Mobile Fix",
  "Printer Setup",
  "Internet Connectivity",
  "Server Configuration",
  "Game Console Repair",
  "Home Theater Setup",
  "Security Systems",
  "Router Configuration",
  "Website Development",
  "App Development",
];

// Initialize experts collection
const initializeExperts = async () => {
  try {
    console.log("Starting to initialize experts...");
    const expertsCollection = collection(db, "experts");

    // SRM Nagar, Kattankulathur, Tamil Nadu coordinates
    const baseLatitude = 12.8231;
    const baseLongitude = 80.0444;

    // Generate 20 experts
    for (let i = 0; i < 20; i++) {
      // Generate unique expert ID
      const expertId = `exp${String(i + 1).padStart(3, "0")}`;

      // Create random expert name
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;

      // Generate 2-3 random specialties
      const numSpecialties = Math.floor(Math.random() * 2) + 2; // 2-3 specialties
      const shuffledSpecialties = [...allSpecialties].sort(
        () => 0.5 - Math.random()
      );
      const specialties = shuffledSpecialties.slice(0, numSpecialties);

      // Generate random rating between 3.8 and 5.0
      const rating = parseFloat((Math.random() * 1.2 + 3.8).toFixed(1));

      // Generate random number of reviews
      const reviews = Math.floor(Math.random() * 200) + 50; // 50-250 reviews

      // Generate random hourly rate between ₹399 and ₹999
      const hourlyRate = Math.floor(Math.random() * 600) + 399;

      // Generate nearby location (within 3km radius)
      const radius = Math.random() * 2.5; // 0-2.5km
      const angle = Math.random() * 2 * Math.PI; // Random direction
      const latOffset = (radius * Math.cos(angle)) / 111.32; // Convert km to degrees
      const lngOffset =
        (radius * Math.sin(angle)) /
        (111.32 * Math.cos(baseLatitude * (Math.PI / 180)));

      const latitude = baseLatitude + latOffset;
      const longitude = baseLongitude + lngOffset;

      // Create expert document
      const expertDoc = {
        name,
        specialties,
        rating,
        reviews,
        hourlyRate,
        location: "SRM Nagar, Kattankulathur, Tamil Nadu",
        latitude,
        longitude,
        available: Math.random() > 0.1, // 90% chance to be available
        city: "Chennai",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log(`Adding expert ${expertId}: ${name}`);
      await setDoc(doc(expertsCollection, expertId), expertDoc);
      console.log(`Successfully added expert: ${name}`);
    }

    console.log("All experts added successfully");
  } catch (error) {
    console.error("Error initializing experts:", error);
    console.error("Full error details:", JSON.stringify(error));
    throw error;
  }
};

// Initialize database
const initializeDatabase = async () => {
  try {
    console.log("Starting database initialization...");
    await initializeExperts();
    console.log("Database initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

// Start initialization with better error handling
initializeDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
