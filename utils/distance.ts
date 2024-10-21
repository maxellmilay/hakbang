import { MapCoordinate, MapLineSegment } from '@/interface/map'

export const getLineSegmentCenter = (lineSegment: MapLineSegment) => {
    const start = lineSegment.start_coordinates
    const end = lineSegment.end_coordinates

    const centerLat = (start.latitude + end.latitude) / 2
    const centerLng = (start.longitude + end.longitude) / 2

    const center: MapCoordinate = {
        latitude: centerLat,
        longitude: centerLng,
    }

    return center
}
