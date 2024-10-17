import { MapCoordinate, MapLineSegment } from '@/interface/map'

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
    lineSegments: MapLineSegment[]
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
const point = { lat: 3, lng: 4 }
const lineSegments = [
    { start: { lat: 0, lng: 0 }, end: { lat: 5, lng: 5 } },
    { start: { lat: 1, lng: 5 }, end: { lat: 4, lng: 5 } },
    { start: { lat: 6, lng: 1 }, end: { lat: 6, lng: 4 } },
]

const closestSegment = findClosestSegment(point, lineSegments)
console.log('Closest segment:', closestSegment)
