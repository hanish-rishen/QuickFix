"use client";

import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { logoutUser } from "../../../lib/firebaseAuth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="p-4 bg-blue-50 rounded-md mb-6">
            <p className="font-medium">
              Welcome, {currentUser?.email || "User"}
            </p>
            <p className="text-sm text-gray-600">
              You're now signed in to QuicKFix
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Profile</h3>
                <p className="text-gray-600">
                  View and update your profile information
                </p>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Settings</h3>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
