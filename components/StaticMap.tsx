import React, { useRef } from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'

const containerStyle = {
    width: '400px',
    height: '300px',
}

const center = {
    lat: 37.7749,
    lng: -122.4194,
}

const options = {
    disableDefaultUI: true,
    gestureHandling: 'none',
    zoomControl: false,
}

const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [
                    [-122.4194, 37.7749],
                    [-122.4145, 37.7755],
                    [-122.4094, 37.7776],
                ],
            },
            properties: {},
        },
    ],
}

function MapWithLineString() {
    const mapRef = useRef<google.maps.Map | null>(null)

    // This function adds the LineString from the GeoJSON
    const addGeoJsonLineString = (map: google.maps.Map) => {
        if (!map) return

        // Convert GeoJSON LineString to Google Maps LatLng coordinates
        const coordinates = geojson.features[0].geometry.coordinates.map(
            (coord) => ({
                lat: coord[1], // Latitude is the second element in GeoJSON coordinates
                lng: coord[0], // Longitude is the first element in GeoJSON coordinates
            })
        )

        // Create a polyline from the coordinates
        const lineString = new window.google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
        })

        // Set the polyline on the map
        lineString.setMap(map)
    }

    return (
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                options={options}
                onLoad={(map) => {
                    mapRef.current = map
                    addGeoJsonLineString(map)
                }}
            />
        </LoadScript>
    )
}

export default MapWithLineString
