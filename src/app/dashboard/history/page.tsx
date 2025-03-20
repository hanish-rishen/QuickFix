"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import { getUserBookingHistory } from "../../../../lib/firestoreService";
import Link from "next/link";

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

  // Helper function to format dates
  const formatDate = (date: Date | FirestoreTimestamp): string => {
    if (date instanceof Date) {
      return date.toLocaleString();
    } else if (date && typeof date.toDate === "function") {
      return date.toDate().toLocaleString();
    }
    return "Unknown date";
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
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {booking.expert?.name?.[0] || "E"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {booking.expert?.name || "Expert"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ₹{booking.expert?.hourlyRate || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
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
