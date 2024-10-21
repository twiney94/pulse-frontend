"use client";

import React from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';


interface Location {
  place: string;
  lat: number;
  lng: number;
}

interface MapBoxProps {
  locations: Location | Location[];
}

const MapBox: React.FC<MapBoxProps> = ({ locations }) => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  React.useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 2,
    });

    if (Array.isArray(locations)) {
      locations.forEach((loc) => {
        new mapboxgl.Marker()
          .setLngLat([loc.lng, loc.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${loc.place}</h3>`))
          .addTo(map);
      });
    } else {
      new mapboxgl.Marker()
        .setLngLat([locations.lng, locations.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${locations.place}</h3>`))
        .addTo(map);
      map.setCenter([locations.lng, locations.lat]);
      map.setZoom(10);
    }

    return () => map.remove();
  }, [locations]);

return <div id="map" style={{ width: "100%", height: "100%" }} />;
};

export default MapBox;
