"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Location } from "@/app/types/d";
interface MapBoxProps {
  locations: Location[];
  hoveredLocation: Location | null;
}

const MapBox: React.FC<MapBoxProps> = ({ locations, hoveredLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      const initialCenter: [number, number] =
        locations.length > 0
          ? [locations[0].lng, locations[0].lat]
          : [2.3522, 48.8566];

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: initialCenter,
        zoom: 12,
      });

      mapRef.current = map;

      map.on("load", () => {
        markersRef.current = locations.map((loc) => {
          const badge = document.createElement("div");

          // Add an onClick event to navigate to the event page
          badge.innerHTML =
            loc.price === 0
              ? '<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-800 hover:bg-green-200 transition-all" style="cursor: pointer;">Free</span>'
              : `<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-primary bg-white text-primary hover:bg-gray-100 transition-all" style="cursor: pointer;">${new Intl.NumberFormat(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                  }
                ).format(loc.price / 100)}</span>`;

          badge.style.width = "auto";
          badge.style.height = "auto";
          badge.style.display = "flex";
          badge.style.alignItems = "center";
          badge.style.justifyContent = "center";

          badge.onclick = () => {
            window.location.href = `/event/${loc.id}`;
          };

          const marker = new mapboxgl.Marker({ element: badge })
            .setLngLat([loc.lng, loc.lat])
            .addTo(map);
          return marker;
        });
      });
    }
  }, [locations]);

  useEffect(() => {
    if (hoveredLocation && mapRef.current) {
      const { lat, lng } = hoveredLocation;
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        speed: 1,
        curve: 1.5,
      });
    }
  }, [hoveredLocation]);

  return (
    <div
      ref={mapContainerRef}
      className="rounded-lg"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default MapBox;
