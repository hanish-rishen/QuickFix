"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getUserRecentBookings,
  cancelBooking,
} from "../../../lib/firestoreService";
import Link from "next/link";
import { logoutUser } from "../../../lib/firebaseAuth";
import BookingCard from "../../../components/BookingCard";

// Define booking interface to fix type errors
interface Expert {
  name?: string;
  hourlyRate?: number;
}

// Refine the createdAt type to properly handle Firestore timestamps
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

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState("");

  // Define loadRecentBookings as a callback function to fix reference error
  const loadRecentBookings = useCallback(async () => {
    if (currentUser) {
      try {
        setLoading(true);
        console.log("Loading bookings for user:", currentUser.uid);
        const bookings = await getUserRecentBookings(currentUser.uid, 5);
        console.log("Fetched bookings:", bookings);
        setRecentBookings(bookings as Booking[]);
        setBookingError("");
      } catch (error) {
        console.error("Error loading bookings:", error);
        setBookingError("Failed to load your recent bookings");
      } finally {
        setLoading(false);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadRecentBookings();
    }
  }, [currentUser, loadRecentBookings]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
    }
  }, [currentUser, router]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await cancelBooking(bookingId);

      // Remove the cancelled booking from the dashboard view
      setRecentBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
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
              href="/"
              className="font-bold text-xl text-gray-900 dark:text-white"
            >
              QuickFix
            </Link>
            <button
              onClick={async () => {
                try {
                  await logoutUser();
                  router.push("/");
                } catch (error) {
                  console.error("Failed to log out", error);
                }
              }}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Enhanced Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Profile Header */}
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-700 flex items-center justify-center">
                  <span className="text-3xl">
                    {currentUser.email?.[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 pb-6 px-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentUser.email}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Member since{" "}
                    {new Date(
                      currentUser.metadata.creationTime
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* Add Edit Profile button */}
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl className="grid grid-cols-4 gap-4 p-8">
                <div className="text-center">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Repairs
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {recentBookings.length || 0}
                  </dd>
                </div>
                <div className="text-center">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Active
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {recentBookings.filter((b) => b.status === "pending")
                      .length || 0}
                  </dd>
                </div>
                <div className="text-center">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Reviews
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    0
                  </dd>
                </div>
                <div className="text-center">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Rating
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white flex items-center justify-center">
                    <span className="text-yellow-500 mr-1">★</span>-
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quick Actions - Enhanced */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/features"
                  className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Book New Repair
                </Link>
                <Link
                  href="/services/it-networking"
                  className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  IT Services
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Bookings
                </h2>
                <Link
                  href="/dashboard/history"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                >
                  <span>View All</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
                    />
                  ))}
                </div>
              ) : bookingError ? (
                <div className="text-center py-6">
                  <p className="text-red-500">{bookingError}</p>
                  <button
                    onClick={loadRecentBookings}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={handleCancelBooking}
                      removeOnCancel={true} // Set to true for dashboard
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-white">
                    No bookings yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Start by creating your first repair request
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/features"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      Browse Services
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services You Might Like */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Services You Might Like
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "IT & Networking",
                    icon: "🖥️",
                    href: "/services/it-networking",
                    color:
                      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
                  },
                  {
                    name: "Appliance Repair",
                    icon: "🔧",
                    href: "/features",
                    color:
                      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
                  },
                  {
                    name: "Home Cleaning",
                    icon: "🧹",
                    href: "/features",
                    color:
                      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
                  },
                ].map((service, index) => (
                  <Link
                    key={index}
                    href={service.href}
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md"
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${service.color}`}
                    >
                      <span className="text-xl">{service.icon}</span>
                    </div>
                    <h3 className="mt-3 font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        From
                      </span>
                      <span className="ml-1 text-lg font-semibold text-gray-900 dark:text-white">
                        ₹399
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
