"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import Link from "next/link";
import { logoutUser } from "../../../lib/firebaseAuth";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();

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
              {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
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
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                Create New Repair Request
              </button>
              <button className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                View History
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
