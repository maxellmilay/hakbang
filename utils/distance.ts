import { MapCoordinate, MapLineSegment } from '@/interface/map'
import colonGeoJSONData from '@/data/geojson/colon.json'

const colonLineSegments = colonGeoJSONData.features
    .map((feature) => {
        if (feature.geometry.type === 'LineString') {
            const start = feature.geometry.coordinates[0]
            const end = feature.geometry.coordinates[1]

            return {
                start: {
                    lat: start[1],
                    lng: start[0],
                },
                end: {
                    lat: end[1],
                    lng: end[0],
                },
            }
        }
        return null
    })
    .filter((segment) => segment !== null)

// Helper function to calculate the squared distance between two points
const distanceSquared = (point1: MapCoordinate, point2: MapCoordinate) => {
    return (point1.lat - point2.lat) ** 2 + (point1.lng - point2.lng) ** 2
}

// Helper function to calculate the minimum distance between a point and a line segment
function distancePointToSegment(
    point: MapCoordinate,
    segmentStart: MapCoordinate,
    segmentEnd: MapCoordinate
) {
    const l2 = distanceSquared(segmentStart, segmentEnd)
    if (l2 === 0) return Math.sqrt(distanceSquared(point, segmentStart)) // segmentStart == segmentEnd

    let t =
        ((point.lat - segmentStart.lat) * (segmentEnd.lat - segmentStart.lat) +
            (point.lng - segmentStart.lng) *
                (segmentEnd.lng - segmentStart.lng)) /
        l2
    t = Math.max(0, Math.min(1, t))

    const projection = {
        lat: segmentStart.lat + t * (segmentEnd.lat - segmentStart.lat),
        lng: segmentStart.lng + t * (segmentEnd.lng - segmentStart.lng),
    }
    return Math.sqrt(distanceSquared(point, projection))
}

// Function to find the closest line segment to a given point
function findClosestSegment(
    point: MapCoordinate,
    lineSegments: MapLineSegment[] = colonLineSegments
) {
    let closestSegment = null
    let minDistance = Infinity

    for (const segment of lineSegments) {
        const distance = distancePointToSegment(
            point,
            segment.start,
            segment.end
        )
        if (distance < minDistance) {
            minDistance = distance
            closestSegment = segment
        }
    }

    return closestSegment
}

// Example usage
const point = {
    lat: 10.295680066689476,
    lng: 123.89646966784828,
}

const closestSegment = findClosestSegment(point)
console.log('Closest segment:', closestSegment)
