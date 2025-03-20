import { useState } from "react";

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

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => Promise<void>;
  compact?: boolean;
  removeOnCancel?: boolean; // Add this prop to control behavior
}

export default function BookingCard({
  booking,
  onCancel,
  compact = false,
  removeOnCancel = false, // Default to updating the status (history page behavior)
}: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // To handle removing from view

  // Format date helper
  const formatDate = (date: Date | FirestoreTimestamp): string => {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    } else if (date && typeof date.toDate === "function") {
      return date.toDate().toLocaleDateString();
    }
    return "Unknown date";
  };

  // Handle cancel with internal state management
  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setIsCancelling(true);
      await onCancel(booking.id);

      // If we should remove the card on cancel, hide it with animation
      if (removeOnCancel) {
        setIsVisible(false);
        // Optional: could add setTimeout here to fully remove component after animation
      }
    } finally {
      setIsCancelling(false);
    }
  };

  // Skip rendering if the card should be hidden
  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all duration-300">
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
          <p className="text-xs text-gray-400">
            {booking.serviceType} • ₹
            {booking.amount || booking.expert?.hourlyRate || "N/A"}
          </p>
        </div>
      </div>

      <div className="text-right flex flex-col items-end space-y-2">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            booking.status === "completed"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : booking.status === "pending"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>

        {booking.status === "pending" && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 
              dark:hover:text-red-300 transition-colors"
          >
            {isCancelling
              ? "Cancelling..."
              : compact
              ? "Cancel"
              : "Cancel Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
