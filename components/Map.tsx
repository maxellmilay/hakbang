'use client';

import { useEffect, useRef, useState } from 'react';
import { defaultMapCenter, defaultMapZoom, defaultMapContainerStyle, defaultMapOptions } from '@/constants/map-properties';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { FeatureCollection } from 'geojson';
import AppLayer from './AppLayer';

interface PropsInterface {
  geojsonData: FeatureCollection;
}

const MapComponent = (props: PropsInterface) => {
  const { geojsonData } = props;

  const [isPickingLocation, setIsPickingLocation] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [center, setCenter] = useState(defaultMapCenter);

  const [pickedCoordinates, setPickedCoordinates] = useState({lat:10.298684, lng:123.898283});

  const handleSaveLocation = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        setPickedCoordinates({ lat, lng });
        console.log('LAT', lat, 'LANG', lng)
      }
    }
  };

  useEffect(() => {
    if (isMapLoaded && mapRef.current && geojsonData) {
      const map = mapRef.current;

      // Create a Data Layer
      const dataLayer = new google.maps.Data({ map });
      dataLayer.addGeoJson(geojsonData);

      // Style the GeoJSON lines based on their 'weight' property
      dataLayer.setStyle((feature) => {
        const weight = feature.getProperty('weight');

        const strokeWeight = typeof weight === 'number' ? weight : 0;
        let strokeColor = '#8f9691'; // Default to grey

        if (strokeWeight > 15) {
          strokeColor = '#FF0000'; // Change to red for heavier weights
        } else if (strokeWeight <= 15 && strokeWeight > 5) {
          strokeColor = '#00FF00'; // Green for mid-range weights
        }

        return {
          strokeColor: strokeColor,
          strokeWeight: 10,
          strokeOpacity: 1.0,
        };
      });

      dataLayer.addListener('click', (event: google.maps.Data.MouseEvent) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
    
        // Check if geometry exists
        if (geometry) {
            if (geometry.getType() === 'LineString') {
                // Cast geometry to LineString
                const lineString = geometry as google.maps.Data.LineString;
                const coordinates = lineString.getArray().map((latLng: google.maps.LatLng) => ({
                    lat: latLng.lat(),
                    lng: latLng.lng()
                }));
                console.log('LineString coordinates:', coordinates);
            } else if (geometry.getType() === 'Point') {
                // Cast geometry to Point
                const point = geometry as google.maps.Data.Point;
                const latLng = point.get();
                console.log('Point coordinates:', { lat: latLng.lat(), lng: latLng.lng() });
            } else {
                console.log('Other geometry type:', geometry.getType());
            }
        } else {
            console.log('No geometry found for this feature.');
        }
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
      <AppLayer center={center} setIsPickingLocation={setIsPickingLocation} isPickingLocation={isPickingLocation} handleSaveLocation={handleSaveLocation} pickedCoordinates={pickedCoordinates} setPickedCoordinates={setPickedCoordinates}/>
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
        onLoad={(map) => {
          mapRef.current = map;
          setIsMapLoaded(true);
        }}
        onCenterChanged={isPickingLocation ? () => {
          if (mapRef.current) {
            const newCenter = mapRef.current.getCenter();
            if (newCenter) {
              setCenter({
                lat: newCenter.lat(),
                lng: newCenter.lng(),
              });
            }
          }
        } : () => {}}
      >
      {isPickingLocation && 
        <Marker
          position={center}
        />}
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
