import colonGeoJSONData from '../data/geojson/mandaue.json' assert { type: 'json' }

// Helper function to calculate the squared distance between two points
const distanceSquared = (point1, point2) => {
    return (
        (point1.latitude - point2.latitude) ** 2 +
        (point1.longitude - point2.longitude) ** 2
    )
}

// Helper function to calculate the minimum distance between a point and a line segment
function distancePointToSegment(point, segmentStart, segmentEnd) {
    const l2 = distanceSquared(segmentStart, segmentEnd)
    if (l2 === 0) return Math.sqrt(distanceSquared(point, segmentStart)) // segmentStart == segmentEnd

    let t =
        ((point.latitude - segmentStart.latitude) *
            (segmentEnd.latitude - segmentStart.latitude) +
            (point.longitude - segmentStart.longitude) *
                (segmentEnd.longitude - segmentStart.longitude)) /
        l2
    t = Math.max(0, Math.min(1, t))

    const projection = {
        latitude:
            segmentStart.latitude +
            t * (segmentEnd.latitude - segmentStart.latitude),
        longitude:
            segmentStart.longitude +
            t * (segmentEnd.longitude - segmentStart.longitude),
    }
    return Math.sqrt(distanceSquared(point, projection))
}

// Function to find the closest line segment to a given point
function findClosestSegment(point, lineSegments) {
    let closestSegment = null
    let minDistance = Infinity

    for (const segment of lineSegments) {
        const distance = distancePointToSegment(
            point,
            segment.start_coordinates,
            segment.end_coordinates
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
    latitude: 10.295680066689476,
    longitude: 123.89646966784828,
}

const colonLineSegments = colonGeoJSONData.features.map((feature) => {
    const start = feature.geometry.coordinates[0]
    const end = feature.geometry.coordinates[1]

    return {
        start_coordinates: {
            latitude: start[1],
            longitude: start[0],
        },
        end_coordinates: {
            latitude: end[1],
            longitude: end[0],
        },
    }
})

const closestSegment = findClosestSegment(point, colonLineSegments)
console.log('Closest segment:', closestSegment)
