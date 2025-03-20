"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

// Fix for default marker icons
const DEFAULT_ICON_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const DEFAULT_SHADOW_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";
const DEFAULT_RETINA_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";

// Set default icon
L.Marker.prototype.options.icon = L.icon({
  iconUrl: DEFAULT_ICON_URL,
  iconRetinaUrl: DEFAULT_RETINA_URL,
  shadowUrl: DEFAULT_SHADOW_URL,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

interface MapComponentProps {
  userLocation: {
    latitude: number;
    longitude: number;
  };
  expertLocation?: {
    latitude: number;
    longitude: number;
    name: string;
    eta: string;
  };
}

const MapComponent = ({ userLocation, expertLocation }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize map with error handling
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Cleanup previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    try {
      // Create map instance
      const map = L.map(mapRef.current, {
        center: [userLocation.latitude, userLocation.longitude],
        zoom: 13,
        layers: [
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }),
        ],
      });

      mapInstanceRef.current = map;

      // Create custom icons
      const userIcon = L.divIcon({
        html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
        className: "custom-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Add user marker
      L.marker([userLocation.latitude, userLocation.longitude], {
        icon: userIcon,
      })
        .addTo(map)
        .bindPopup("You are here")
        .openPopup();

      // Add expert marker if available
      if (expertLocation) {
        const expertIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
              <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-0.5 rounded text-xs shadow">
                ${expertLocation.name}
              </div>
            </div>
          `,
          className: "custom-div-icon",
          iconSize: [24, 40],
          iconAnchor: [12, 12],
        });

        // Create expert marker but no need to store the reference since we don't use it later
        L.marker([expertLocation.latitude, expertLocation.longitude], {
          icon: expertIcon,
        })
          .addTo(map)
          .bindPopup(`${expertLocation.name}<br/>ETA: ${expertLocation.eta}`);

        // Draw route
        const waypoints = [
          L.latLng(userLocation.latitude, userLocation.longitude),
          L.latLng(expertLocation.latitude, expertLocation.longitude),
        ];

        // Use a proper type assertion instead of 'any'
        const routingControl = L.Routing.control({
          waypoints,
          show: false,
          addWaypoints: false,
          routeWhileDragging: false,
          lineOptions: {
            styles: [{ color: "#3B82F6", weight: 3 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
        }) as unknown as L.Routing.Control;

        routingControl.addTo(map);

        // Fit bounds to show both markers
        const bounds = L.latLngBounds(waypoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, expertLocation]);

  return <div ref={mapRef} className="h-full w-full min-h-[300px]" />;
};

export default MapComponent;
