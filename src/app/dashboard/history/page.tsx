"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  getUserBookingHistory,
  cancelBooking,
} from "../../../../lib/firestoreService";
import Link from "next/link";
import BookingCard from "../../../../components/BookingCard";

// Reuse the same interfaces we defined in the dashboard page
interface Expert {
  name?: string;
  hourlyRate?: number;
}

interface FirestoreTimestamp {
  toDate(): Date;
}

interface Booking {
  id: string;
  userId: string;
  expertId: string;
  serviceType: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date | FirestoreTimestamp;
  amount: number;
  expert?: Expert | null;
}

export default function BookingHistory() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
      return;
    }

    const loadBookings = async () => {
      try {
        const history = await getUserBookingHistory(currentUser.uid);
        setBookings(history as Booking[]);
      } catch (error) {
        console.error("Error loading booking history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [currentUser, router]);

  // Add cancellation handler
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await cancelBooking(bookingId);

      // Update the local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      alert("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(
        `Failed to cancel booking: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex justify-between items-center h-full">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Booking History
        </h1>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white dark:bg-gray-800 rounded-lg shadow"
              />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                removeOnCancel={false} // Set to false for history page
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">
              No booking history found
            </p>
            <Link
              href="/features"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Browse Services →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
