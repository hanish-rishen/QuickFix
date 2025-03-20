"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../../../../contexts/AuthContext";
import dynamic from "next/dynamic";
import {
  getNearbyExperts,
  createBooking,
} from "../../../../lib/firestoreService";

// Import OpenStreetMap dynamically since it requires browser APIs
const MapComponent = dynamic(
  () => import("../../../../components/MapComponent"),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-200 rounded animate-pulse" />,
  }
);

export default function ITNetworkingPage() {
  const { currentUser } = useAuth();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [sortBy, setSortBy] = useState("distance");
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [mapVisible, setMapVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Fetch user's location and nearby experts
  useEffect(() => {
    const fetchUserLocationAndExperts = async () => {
      setLoadingExperts(true);
      try {
        // Default SRM Nagar location - change this to match where your experts are located
        const defaultLocation = { latitude: 12.8231, longitude: 80.0444 };

        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ latitude, longitude });

              console.log("Got user location:", latitude, longitude);

              // Fetch experts - use a larger radius to ensure we find some
              const nearbyExperts = await getNearbyExperts(
                latitude,
                longitude,
                50
              );
              console.log("Fetched experts:", nearbyExperts);

              // If no experts found near user, fetch from default location
              if (nearbyExperts.length === 0) {
                console.log("No experts near user, using default location");
                const defaultExperts = await getNearbyExperts(
                  defaultLocation.latitude,
                  defaultLocation.longitude,
                  50
                );
                setExperts(defaultExperts);
                setFilteredExperts(defaultExperts);
              } else {
                setExperts(nearbyExperts);
                setFilteredExperts(nearbyExperts);
              }
            },
            async (error) => {
              console.error("Geolocation error:", error);
              setUserLocation(defaultLocation);
              setErrorMsg(
                "Location access denied. Using default location to find experts."
              );

              // Fetch from default location with larger radius
              const defaultExperts = await getNearbyExperts(
                defaultLocation.latitude,
                defaultLocation.longitude,
                50
              );
              setExperts(defaultExperts);
              setFilteredExperts(defaultExperts);
            }
          );
        } else {
          // Browser doesn't support geolocation
          setUserLocation(defaultLocation);
          setErrorMsg("Geolocation not supported. Using default location.");

          // Fetch from default location with larger radius
          const defaultExperts = await getNearbyExperts(
            defaultLocation.latitude,
            defaultLocation.longitude,
            50
          );
          setExperts(defaultExperts);
          setFilteredExperts(defaultExperts);
        }
      } catch (error) {
        console.error("Error fetching experts:", error);
        setErrorMsg("Error loading experts. Please try again later.");
      } finally {
        setLoadingExperts(false);
      }
    };

    fetchUserLocationAndExperts();
  }, []);

  // Apply sorting and filtering
  useEffect(() => {
    if (!experts.length) return;

    let result = [...experts];

    // Apply specialty filter if active
    if (activeFilter) {
      result = result.filter(
        (expert) =>
          expert.specialties && expert.specialties.includes(activeFilter)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "distance":
        result.sort((a, b) => a.distance - b.distance);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price":
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "arrival":
        result.sort((a, b) => {
          const aTime = parseInt(a.arrivalTime?.split("-")[0] || "30");
          const bTime = parseInt(b.arrivalTime?.split("-")[0] || "30");
          return aTime - bTime;
        });
        break;
      default:
        break;
    }

    setFilteredExperts(result);
  }, [experts, sortBy, activeFilter]);

  // Get all unique specialties
  const allSpecialties = React.useMemo(() => {
    const specialtiesSet = new Set<string>();
    experts.forEach((expert) => {
      if (expert.specialties) {
        expert.specialties.forEach((specialty) => {
          specialtiesSet.add(specialty);
        });
      }
    });
    return Array.from(specialtiesSet);
  }, [experts]);

  const handleBooking = (expertId: string) => {
    if (!currentUser) {
      window.location.href = "/signin?redirect=/services/it-networking";
      return;
    }

    setSelectedExpert(expertId);
    setMapVisible(true);

    // Scroll to map
    if (mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelBooking = () => {
    setSelectedExpert(null);
  };

  const handleConfirmBooking = async () => {
    if (!currentUser || !selectedExpert || !userLocation) {
      setErrorMsg("Please log in to book an expert");
      return;
    }

    try {
      // Create booking in Firestore
      const expertDetails = experts.find((e) => e.id === selectedExpert);

      if (!expertDetails) {
        setErrorMsg("Expert details not found. Please try again.");
        return;
      }

      // Show loading state
      setLoadingExperts(true);

      const bookingData = {
        userId: currentUser.uid,
        expertId: selectedExpert,
        serviceType: "IT & Networking",
        description: `IT support service with ${expertDetails.name}`,
        status: "pending",
        createdAt: new Date(),
        scheduledTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        location: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          address: "User's location",
        },
        amount: expertDetails.hourlyRate,
        paymentStatus: "pending",
      };

      const result = await createBooking(bookingData);
      console.log("Booking created:", result);

      // Show success message
      alert(
        `Your repair request has been confirmed! ${expertDetails.name} will arrive at your location in approximately ${expertDetails.arrivalTime}.`
      );

      // Redirect to dashboard to see the booking
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("There was an error processing your booking. Please try again.");
    } finally {
      setLoadingExperts(false);
      setSelectedExpert(null);
    }
  };

  const toggleFilter = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  // Get details of selected expert
  const selectedExpertDetails = selectedExpert
    ? experts.find((e) => e.id === selectedExpert)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">IT & Networking Services</h1>
              <p className="mt-2">
                Expert tech support at your doorstep within minutes
              </p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link
                href="/dashboard"
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Goto Dashboard
              </Link>
              <Link
                href="/features"
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Back to Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map Section */}
        <div
          ref={mapContainerRef}
          className={`mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
            mapVisible ? "block" : "hidden"
          }`}
        >
          <div className="h-64 md:h-80">
            <MapComponent
              userLocation={userLocation}
              expertLocation={
                selectedExpertDetails
                  ? {
                      latitude: selectedExpertDetails.latitude,
                      longitude: selectedExpertDetails.longitude,
                      name: selectedExpertDetails.name,
                      eta: selectedExpertDetails.arrivalTime,
                    }
                  : undefined
              }
            />
          </div>

          {selectedExpertDetails && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg font-bold mr-4">
                    {selectedExpertDetails.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {selectedExpertDetails.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Will arrive in {selectedExpertDetails.arrivalTime}
                    </p>
                  </div>
                </div>

                <div className="space-x-3">
                  <button
                    onClick={handleCancelBooking}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="px-3 py-1 bg-blue-600 rounded text-white"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  {errorMsg}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Blinkit-style Quick Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              5-20
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              min delivery
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              250+
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              experts
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              4.8
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              avg. rating
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              {loadingExperts ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Finding experts near you...</span>
                </div>
              ) : userLocation ? (
                <span>Showing experts near your location</span>
              ) : (
                <span>Using default location</span>
              )}

              <button
                onClick={() => setMapVisible(!mapVisible)}
                className="ml-4 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                {mapVisible ? "Hide Map" : "View Map"}
              </button>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <label
                htmlFor="sort-by"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Sort by:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md flex-grow md:flex-grow-0 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 text-sm"
              >
                <option value="distance">Distance</option>
                <option value="arrival">Fastest Arrival</option>
                <option value="rating">Rating</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>

          {/* Quick filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {allSpecialties.slice(0, 6).map((filter, idx) => (
              <button
                key={idx}
                onClick={() => toggleFilter(filter)}
                className={`px-3 py-1 text-xs border ${
                  activeFilter === filter
                    ? "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                } rounded-full transition-colors`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Expert Listings */}
        <div className="grid grid-cols-1 gap-4">
          {loadingExperts ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredExperts.length > 0 ? (
            // List of experts
            filteredExperts.map((expert) => (
              <div
                key={expert.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${
                  !expert.available ? "opacity-60" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Expert Photo and Rating */}
                  <div className="w-full md:w-24 flex flex-row md:flex-col items-center md:items-start">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
                        {expert.name.charAt(0)}
                      </div>
                      {expert.available ? (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      ) : (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="ml-4 md:ml-0 md:mt-2 flex md:justify-center items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 font-semibold text-sm">
                        {expert.rating}
                      </span>
                    </div>
                  </div>

                  {/* Expert Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {expert.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {expert.location} • {expert.distance.toFixed(1)} km
                          away
                        </p>

                        {/* Blinkit-style time indicator */}
                        <div className="mt-1 inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                          <svg
                            className="inline-block w-3 h-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {expert.arrivalTime}
                        </div>
                      </div>

                      <div className="mt-2 md:mt-0 flex items-center">
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          ₹{expert.hourlyRate}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          /hour
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {expert.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {specialty}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          +{expert.reviews} reviews
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => handleBooking(expert.id)}
                        disabled={!expert.available}
                        className={`px-4 py-2 rounded text-white font-medium ${
                          expert.available
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        } transition-colors`}
                      >
                        {expert.available ? "Book Now" : "Unavailable"}
                      </button>

                      {/* Quick Action Buttons */}
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                          <svg
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                          <svg
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty state
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                No experts available
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {activeFilter
                  ? "Try selecting a different specialty"
                  : "Try a different location or check back later"}
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            What IT & Networking services do we offer?
          </h2>
          <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <strong>Network Setup & Troubleshooting:</strong> WiFi
                installation, router configuration, network security, and
                connectivity issues
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <strong>PC & Laptop Repairs:</strong> Hardware upgrades,
                component replacement, OS installation, virus removal
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <strong>Data Recovery Services:</strong> Recover lost files from
                damaged drives, formatted devices, and corrupted storage
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <strong>Smart Home Setup:</strong> Installation and
                configuration of smart devices, home automation systems, and IoT
                integration
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
