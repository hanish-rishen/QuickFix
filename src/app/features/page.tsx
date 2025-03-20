"use client";

import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";

const ProjectsServicesSection = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          Our Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Home Repairs Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:scale-105">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Home Repairs
            </h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Plumbing repairs & installations
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Electrical work & lighting
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Carpentry & furniture repair
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Wall & ceiling repairs
              </li>
            </ul>
          </div>

          {/* Appliance Repairs Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Appliance Repairs
            </h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Refrigerator & freezer repairs
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Washing machine services
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                AC & heating system maintenance
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Kitchen appliance fixes
              </li>
            </ul>
          </div>

          {/* Mobile & Gadget Repairs Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Mobile & Gadget Repairs
            </h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Screen replacements
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Battery replacements
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Water damage repairs
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Software troubleshooting
              </li>
            </ul>
          </div>

          {/* Home Cleaning & Maintenance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Home Cleaning & Maintenance
            </h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Deep cleaning services
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Carpet & upholstery cleaning
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Window & facade cleaning
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Garden maintenance
              </li>
            </ul>
          </div>

          {/* Locksmith & Security Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Locksmith & Security
            </h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Lock installation & repair
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Key cutting & duplication
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Security system setup
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Emergency lockout service
              </li>
            </ul>
          </div>

          {/* IT & Networking Services Card - Highlight this one */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative overflow-hidden transform transition-all hover:scale-105 ring-2 ring-blue-500">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl">
              Popular
            </div>
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              IT & Networking Services
            </h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Network setup & troubleshooting
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                PC & laptop repairs
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Data recovery services
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                Smart home setup
              </li>
            </ul>
            {currentUser ? (
              <Link
                href="/services/it-networking"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Find Experts
              </Link>
            ) : (
              <Link
                href="/signin?redirect=/features"
                className="inline-block mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Sign in to Find Experts
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsServicesSection;
