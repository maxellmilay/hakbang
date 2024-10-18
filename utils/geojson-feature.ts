export const extractFeatureCoordinates = (
    feature: google.maps.Data.Feature
) => {
    const geometry = feature.getGeometry()
    if (geometry && geometry.getType() === 'LineString') {
        const lineString = geometry as google.maps.Data.LineString
        const coordinates = lineString.getArray()

        const point1 = coordinates[0]
        const point2 = coordinates[1]

        return {
            start: {
                lat: point1.lat(),
                lng: point1.lng(),
            },
            end: {
                lat: point2.lat(),
                lng: point2.lng(),
            },
        }
    } else {
        return {
            start: {
                lat: 0,
                lng: 0,
            },
            end: {
                lat: 0,
                lng: 0,
            },
        }
    }
}
