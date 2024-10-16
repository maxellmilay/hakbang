export const defaultMapCenter = {
    lat: 10.295669,  // Latitude for center of the heatmap
    lng: 123.898039 // Longitude for center of the heatmap
}

export const defaultMapZoom = 18

export const boundaries = {
    north: 10.299793,  // Northernmost latitude
    south: 10.294115,  // Southernmost latitude
    east: 123.892943, // Easternmost longitude
    west: 123.898639, // Westernmost longitude
};

export const defaultMapOptions = {
    streetViewControl: false,
    fullscreenControl: false,  // This will remove the fullscreen control
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: window.google.maps.ControlPosition.TOP_RIGHT,
      style: window.google.maps.MapTypeControlStyle.DEFAULT,
    },
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'greedy',
    mapTypeId: 'satellite',
    // restriction: {
    //     latLngBounds: boundaries,  // Apply the bounds restriction
    //     strictBounds: true,   // Set to true to prevent moving the map outside the bounds
    // },
};

export const defaultMapContainerStyle = {
    width: '100vw',
    height: '100vh',
};