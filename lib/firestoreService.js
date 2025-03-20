import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
} from "firebase/firestore";
import { app } from "./firebase";

// Initialize Firestore
const db = getFirestore(app);

// Get all experts
export const getAllExperts = async () => {
  try {
    const expertsCollection = collection(db, "experts");
    const snapshot = await getDocs(expertsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting experts:", error);
    return [];
  }
};

// Get expert by ID
export const getExpertById = async (id) => {
  try {
    const expertDoc = doc(db, "experts", id);
    const snapshot = await getDoc(expertDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      throw new Error("Expert not found");
    }
  } catch (error) {
    console.error("Error getting expert:", error);
    throw error;
  }
};

// Get experts by specialty
export const getExpertsBySpecialty = async (specialty) => {
  try {
    const expertsQuery = query(
      collection(db, "experts"),
      where("specialties", "array-contains", specialty)
    );
    const snapshot = await getDocs(expertsQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting experts by specialty:", error);
    return [];
  }
};

// Get nearby experts within radius (km)
export const getNearbyExperts = async (latitude, longitude, radius = 5) => {
  try {
    console.log("Fetching experts near:", latitude, longitude);
    const expertsSnapshot = await getDocs(collection(db, "experts"));

    if (expertsSnapshot.empty) {
      console.log("No experts found in database");
      return [];
    }

    console.log(`Found ${expertsSnapshot.docs.length} experts total`);

    // Calculate distances and filter
    const nearbyExperts = expertsSnapshot.docs
      .map((doc) => {
        const expertData = doc.data();
        return {
          id: doc.id,
          ...expertData,
          distance: calculateDistance(
            latitude,
            longitude,
            expertData.latitude || 0,
            expertData.longitude || 0
          ),
        };
      })
      .filter((expert) => expert.distance <= radius)
      .map((expert) => ({
        ...expert,
        arrivalTime: calculateArrivalTime(expert.distance),
      }));

    console.log(`Found ${nearbyExperts.length} experts within ${radius}km`);
    return nearbyExperts;
  } catch (error) {
    console.error("Error getting nearby experts:", error);
    return [];
  }
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate arrival time based on distance
const calculateArrivalTime = (distance) => {
  if (distance < 0.5) return "2-4 min";
  if (distance < 1) return "4-6 min";
  if (distance < 1.5) return "6-8 min";
  return "8-10 min";
};

// Create a booking with improved error handling
export const createBooking = async (bookingData) => {
  try {
    console.log("Creating booking with data:", bookingData);

    // Ensure we have all required fields
    const requiredFields = [
      "userId",
      "expertId",
      "serviceType",
      "status",
      "location",
    ];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        throw new Error(`Missing required booking field: ${field}`);
      }
    }

    // Prepare booking data with firestore-compatible types
    const bookingToSave = {
      ...bookingData,
      createdAt: new Date(),
      status: bookingData.status || "pending",
      // Convert any potential Date objects to firestore-compatible timestamps
      scheduledTime:
        bookingData.scheduledTime instanceof Date
          ? bookingData.scheduledTime
          : new Date(bookingData.scheduledTime || Date.now()),
    };

    const bookingsCollection = collection(db, "bookings");
    const newBookingRef = doc(bookingsCollection);
    await setDoc(newBookingRef, bookingToSave);

    console.log(`Booking created successfully with ID: ${newBookingRef.id}`);
    return { id: newBookingRef.id, ...bookingToSave };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// Get user bookings
export const getUserBookings = async (userId) => {
  try {
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(bookingsQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user bookings:", error);
    return [];
  }
};

// Get user's recent bookings with expert details
export const getUserRecentBookings = async (userId, limitCount = 5) => {
  try {
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitCount)
    );

    const snapshot = await getDocs(bookingsQuery);
    const bookings = [];

    for (const docSnapshot of snapshot.docs) {
      const booking = { id: docSnapshot.id, ...docSnapshot.data() };

      try {
        // Get expert details for each booking
        if (booking.expertId) {
          // Use the doc function correctly with the db reference
          const expertDocRef = doc(db, "experts", booking.expertId);
          const expertDocSnapshot = await getDoc(expertDocRef);
          booking.expert = expertDocSnapshot.exists()
            ? expertDocSnapshot.data()
            : null;
        }
      } catch (expertError) {
        console.error("Error fetching expert details:", expertError);
        booking.expert = null;
      }

      bookings.push(booking);
    }

    console.log(
      `Retrieved ${bookings.length} recent bookings for user ${userId}`
    );
    return bookings;
  } catch (error) {
    console.error("Error getting user bookings:", error);
    return [];
  }
};

// Get all user bookings with expert details
export const getUserBookingHistory = async (userId) => {
  try {
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(bookingsQuery);
    const bookings = [];

    for (const docSnapshot of snapshot.docs) {
      const booking = { id: docSnapshot.id, ...docSnapshot.data() };

      // Fixed: Correct usage of doc function
      if (booking.expertId) {
        const expertDocRef = doc(db, "experts", booking.expertId);
        const expertDocSnapshot = await getDoc(expertDocRef);
        booking.expert = expertDocSnapshot.exists()
          ? expertDocSnapshot.data()
          : null;
      } else {
        booking.expert = null;
      }

      bookings.push(booking);
    }

    return bookings;
  } catch (error) {
    console.error("Error getting booking history:", error);
    return [];
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status, updatedAt: new Date() });
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};
