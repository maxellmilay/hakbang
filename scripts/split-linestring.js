import { lineString, length, along } from '@turf/turf'
import fs from 'fs'
import { coordinateMarkers } from '../data/markers/mandaue-markers.js'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const getLineSegmentCenter = (lineSegment) => {
    const start = lineSegment.start_coordinates
    const end = lineSegment.end_coordinates

    const centerLat = (start.latitude + end.latitude) / 2
    const centerLng = (start.longitude + end.longitude) / 2

    return { latitude: centerLat, longitude: centerLng }
}

const getNearestRoad = async (lat, lng) => {
    const roadsUrl = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${process.env.GOOGLE_MAP_API_KEY}`
    try {
        const response = await axios.get(roadsUrl)
        if (
            response.data.snappedPoints &&
            response.data.snappedPoints.length > 0
        ) {
            const placeId = response.data.snappedPoints[0].placeId
            // Use the Place ID to get road name via the Places API
            const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAP_API_KEY}`
            const placeResponse = await axios.get(placeDetailsUrl)
            const roadName = placeResponse.data.result.name
            console.log('Nearest road found:', roadName)
            return roadName
        } else {
            console.log('No road found')
            return 'N/A'
        }
    } catch (error) {
        console.error('Error fetching the nearest road:', error)
        return 'N/A'
    }
}

const splitLineStringIntoEqualPartsByLength = async (
    coordinates,
    segmentLength
) => {
    const newFeatures = []

    for (const { start, end } of coordinates) {
        const lineStringFeature = lineString([start, end])
        const totalLength = length(lineStringFeature, { units: 'kilometers' })

        let currentDistance = 0

        while (currentDistance < totalLength) {
            const startPoint = along(lineStringFeature, currentDistance, {
                units: 'kilometers',
            })
            let endPointDistance = currentDistance + segmentLength

            if (endPointDistance > totalLength) {
                endPointDistance = totalLength
            }

            const endPoint = along(lineStringFeature, endPointDistance, {
                units: 'kilometers',
            })

            const lineSegment = {
                start_coordinates: {
                    latitude: startPoint.geometry.coordinates[1],
                    longitude: startPoint.geometry.coordinates[0],
                },
                end_coordinates: {
                    latitude: endPoint.geometry.coordinates[1],
                    longitude: endPoint.geometry.coordinates[0],
                },
            }

            const { lat, lng } = getLineSegmentCenter(lineSegment)
            const nearestStreet = await getNearestRoad(lat, lng)

            const segment = {
                type: 'Feature',
                properties: {
                    weight: null,
                    nearestStreet: nearestStreet,
                },
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        startPoint.geometry.coordinates,
                        endPoint.geometry.coordinates,
                    ],
                },
            }

            newFeatures.push(segment)
            currentDistance = endPointDistance
        }
    }

    return {
        type: 'FeatureCollection',
        features: newFeatures,
    }
}

// The fixed length for each segment in kilometers
const segmentLength = 0.0075

// Run the function and wait for the result
const splitGeoJSON = await splitLineStringIntoEqualPartsByLength(
    coordinateMarkers,
    segmentLength
)

// Write the result to a JSON file after all async operations are completed
fs.writeFileSync(
    'data/geojson/mandaue.json',
    JSON.stringify(splitGeoJSON, null, 2),
    'utf8'
)

console.log('GeoJSON has been written to mandaue.json')
