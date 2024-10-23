export const defaultMapCenter = {
    latitude: 10.295669, // Latitude for center of the heatmap
    longitude: 123.898039, // Longitude for center of the heatmap
}

export const defaultMapZoom = 18

export const defaultMapOptions = {
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'], // Add additional map types
        position: window.google.maps.ControlPosition.TOP_CENTER,
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR, // Control style (optional)
    },
    zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER, // Move zoom control to the bottom-left corner
    },
    zoomControl: true,
    rotateControl: false, // Disable the tilt/rotate control
    tiltControl: false, // Optionally ensure tilt functionality is off
    gestureHandling: 'greedy',
    mapTypeId: 'satellite',
}

export const defaultMapContainerStyle = {
    width: '100vw',
    height: '100vh',
}
