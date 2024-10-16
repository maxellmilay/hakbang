import { FeatureCollection } from "geojson";

export const createDataLayer = (map: google.maps.Map, geojsonData: FeatureCollection) => {
    const dataLayer = new window.google.maps.Data({ map });
    dataLayer.addGeoJson(geojsonData);
  
    // Optional: Set styling for the Data Layer
    dataLayer.setStyle({
      fillColor: "blue",
      strokeWeight: 1,
    });
  
    // Fit the map to the bounds of the GeoJSON data
    const bounds = new window.google.maps.LatLngBounds();
    dataLayer.forEach((feature) => {
      feature.getGeometry().forEachLatLng((latLng) => {
        bounds.extend(latLng);
      });
    });
    map.fitBounds(bounds);
  
    return dataLayer;
  };