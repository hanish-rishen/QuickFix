import { useState, useEffect } from "react";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

/**
 * Custom hook to get the user's current location
 */
export function useGeolocation(fallbackLocation?: {
  latitude: number;
  longitude: number;
}) {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    location: fallbackLocation || null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: "Geolocation is not supported",
        location: fallbackLocation || null,
      });
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        loading: false,
        error: null,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setState({
        loading: false,
        error: error.message,
        location: fallbackLocation || null,
      });
    };

    setState((prev) => ({ ...prev, loading: true }));

    // Request location with high accuracy
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });

    // Also watch for location updates
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [fallbackLocation]);

  return state;
}
