import { MapLineSegment } from '@/interface/map'
import { lineString, length, along } from '@turf/turf'
import axios from 'axios'

const getLineSegmentCenter = (lineSegment: MapLineSegment) => {
    const start = lineSegment.start_coordinates
    const end = lineSegment.end_coordinates

    const centerLat = (start.latitude + end.latitude) / 2
    const centerLng = (start.longitude + end.longitude) / 2

    return { latitude: centerLat, longitude: centerLng }
}

const getNearestRoad = async (lat: number, lng: number) => {
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

// const getNearestPlaces = async (lat: number, lng: number) => {
//     const apiKey = process.env.GOOGLE_MAP_API_KEY
//     const radius = 1200 // Define the radius in meters
//     const types = 'restaurant|cafe|bank|hospital' // Types of establishments you're interested in

//     const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${types}&key=${apiKey}`

//     try {
//         const response = await axios.get(url)
//         const placesData = response.data.results

//         const countByType = placesData.reduce((acc, place) => {
//             place.types.forEach((type) => {
//                 acc[type] = (acc[type] || 0) + 1
//             })
//             return acc
//         }, {})

//         return countByType
//     } catch (error) {
//         console.error('Error fetching places data:', error)
//         return {}
//     }
// }

interface CoordinatePairs {
    start_coordinates: [number, number]
    end_coordinates: [number, number]
}

export const splitLineStringIntoEqualPartsByLength = async (
    coordinates: CoordinatePairs[],
    segmentLength: number
) => {
    const newSidewalks = []

    for (const { start_coordinates, end_coordinates } of coordinates) {
        const lineStringFeature = lineString([
            start_coordinates,
            end_coordinates,
        ])
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

            const sidewalkSegment = {
                start_coordinates: {
                    latitude: startPoint.geometry.coordinates[1],
                    longitude: startPoint.geometry.coordinates[0],
                },
                end_coordinates: {
                    latitude: endPoint.geometry.coordinates[1],
                    longitude: endPoint.geometry.coordinates[0],
                },
            }

            const { latitude, longitude } =
                getLineSegmentCenter(sidewalkSegment)
            const nearestStreet = await getNearestRoad(latitude, longitude)

            // const nearPlacesFrequency = await getNearestPlaces(
            //     latitude,
            //     longitude
            // )

            // const segment = {
            //     type: 'Feature',
            //     properties: {
            //         weight: null,
            //         nearestStreet: nearestStreet,
            //         nearPlacesFrequency: nearPlacesFrequency,
            //     },
            //     geometry: {
            //         type: 'LineString',
            //         coordinates: [
            //             startPoint.geometry.coordinates,
            //             endPoint.geometry.coordinates,
            //         ],
            //     },
            // }

            const newSidewalk = {
                adjacentStreet: nearestStreet,
                start_coordinates: startPoint.geometry.coordinates,
                end_coordinates: startPoint.geometry.coordinates,
                data: {
                    nearPlacesFrequency: null,
                    hazard: null,
                    population: null,
                    zone: null,
                },
            }

            newSidewalks.push(newSidewalk)
            currentDistance = endPointDistance
        }
    }

    return newSidewalks
}
