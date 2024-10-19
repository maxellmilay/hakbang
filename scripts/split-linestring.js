import { lineString, length, along } from '@turf/turf'
import fs from 'fs'
import { coordinateMarkers } from '../data/coordinate-markers.js'

const splitLineStringIntoEqualPartsByLength = (coordinates, segmentLength) => {
    const newFeatures = []

    coordinates.forEach(({ start, end }) => {
        const lineStringFeature = lineString([start, end])
        const totalLength = length(lineStringFeature, { units: 'kilometers' })

        let currentDistance = 0

        // Create segments of fixed length until the total length is reached
        while (currentDistance < totalLength) {
            const startPoint = along(lineStringFeature, currentDistance, {
                units: 'kilometers',
            })
            let endPointDistance = currentDistance + segmentLength

            // Ensure the last segment ends at the final point if it exceeds total length
            if (endPointDistance > totalLength) {
                endPointDistance = totalLength
            }

            const endPoint = along(lineStringFeature, endPointDistance, {
                units: 'kilometers',
            })

            const segment = {
                type: 'Feature',
                properties: {
                    weight: null,
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
    })

    return {
        type: 'FeatureCollection',
        features: newFeatures,
    }
}

// The fixed length for each segment in kilometers
const segmentLength = 0.0075

const splitGeoJSON = splitLineStringIntoEqualPartsByLength(
    coordinateMarkers,
    segmentLength
)

// Write the result to a JSON file
fs.writeFileSync(
    'data/geojson/colon.json',
    JSON.stringify(splitGeoJSON, null, 2),
    'utf8'
)

console.log('GeoJSON has been written to colon.json')
