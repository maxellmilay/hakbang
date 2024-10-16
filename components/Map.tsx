'use client';

import { useEffect, useRef, useState } from 'react';
import { defaultMapCenter, defaultMapZoom, defaultMapOptions, defaultMapContainerStyle } from '@/constants/map-properties';
import { GoogleMap } from '@react-google-maps/api';
import { FeatureCollection } from 'geojson';

interface PropsInterface {
  geojsonData: FeatureCollection;
}

const MapComponent = (props: PropsInterface) => {
  const { geojsonData } = props;

  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (isMapLoaded && mapRef.current && geojsonData) {
      const map = mapRef.current;

      // Create a Data Layer
      const dataLayer = new google.maps.Data({ map });
      dataLayer.addGeoJson(geojsonData);

      // Style the GeoJSON lines based on their 'weight' property
      dataLayer.setStyle((feature) => {
        const weight = feature.getProperty('weight'); // Get the custom weight property

        const strokeWeight = typeof weight === 'number' ? weight : 0; // Default weight

        let strokeColor = '#8f9691'; // Default to grey

        if (strokeWeight > 15) {
          strokeColor = '#FF0000'; // Change to blue for heavier weights
        } else if (strokeWeight <= 15 && strokeWeight > 5) {
          strokeColor = '#00FF00'; // Green for mid-range weights
        }

        console.log("WEIGHT", strokeWeight, "COLOR", strokeColor)

        return {
          strokeColor: strokeColor,
          strokeWeight: 10, // You can adjust the stroke thickness based on weight
          strokeOpacity: 1.0,
        };
      });

      // Optionally, fit the map to the bounds of the GeoJSON
      const bounds = new google.maps.LatLngBounds();
      dataLayer.forEach((feature) => {
        feature.getGeometry()?.forEachLatLng((latLng) => {
          bounds.extend(latLng);
        });
      });
      map.fitBounds(bounds);
    }
  }, [isMapLoaded, geojsonData]);

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
        onLoad={(map) => {
          mapRef.current = map;
          setIsMapLoaded(true);
        }}
      />
    </div>
  );
};

export { MapComponent };
