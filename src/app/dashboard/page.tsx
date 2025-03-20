"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { getUserRecentBookings } from "../../../lib/firestoreService";
import Link from "next/link";
import { logoutUser } from "../../../lib/firebaseAuth";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const loadRecentBookings = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          console.log("Loading bookings for user:", currentUser.uid);
          const bookings = await getUserRecentBookings(currentUser.uid, 5);
          console.log("Fetched bookings:", bookings);
          setRecentBookings(bookings);
          setBookingError("");
        } catch (error) {
          console.error("Error loading bookings:", error);
          setBookingError("Failed to load your recent bookings");
        } finally {
          setLoading(false);
        }
      }
    };

    if (currentUser) {
      loadRecentBookings();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
    }
  }, [currentUser, router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out", error);
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
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Profile Card */}
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
            <div className="pt-16 pb-8 px-8">
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

            {/* Profile Stats */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl className="grid grid-cols-3 gap-4 p-8">
                <div className="text-center">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Repairs
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    0
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
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    -
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Link
                  href="/features"
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-center"
                >
                  Create New Repair Request
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Bookings
                </h2>
                <Link
                  href="/dashboard/history"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View All
                </Link>
              </div>

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
                    onClick={() => loadRecentBookings()}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
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
                            {booking.createdAt?.toDate
                              ? new Date(
                                  booking.createdAt.toDate()
                                ).toLocaleDateString()
                              : new Date(
                                  booking.createdAt
                                ).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {booking.serviceType} • ₹
                            {booking.amount ||
                              booking.expert?.hourlyRate ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No bookings yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
