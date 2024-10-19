import { MapLineSegment } from '@/interface/map'

export const extractFeatureCoordinates = (
    feature: google.maps.Data.Feature
) => {
    const geometry = feature.getGeometry()
    if (geometry && geometry.getType() === 'LineString') {
        const lineString = geometry as google.maps.Data.LineString
        const coordinates = lineString.getArray()

        const point1 = coordinates[0]
        const point2 = coordinates[1]

        const segmentCoordinates: MapLineSegment = {
            start: {
                lat: point1.lat(),
                lng: point1.lng(),
            },
            end: {
                lat: point2.lat(),
                lng: point2.lng(),
            },
        }

        return segmentCoordinates
    } else {
        const emptySegment: MapLineSegment = {
            start: {
                lat: 0,
                lng: 0,
            },
            end: {
                lat: 0,
                lng: 0,
            },
        }

        return emptySegment
    }
}
