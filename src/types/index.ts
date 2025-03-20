export interface Expert {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  specialties: string[];
  location: string;
  latitude: number;
  longitude: number;
  distance: number;
  arrivalTime: string;
  hourlyRate: number;
  available: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface BookingRequest {
  userId: string;
  expertId: number;
  serviceType: string;
  description: string;
  scheduledTime: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}
