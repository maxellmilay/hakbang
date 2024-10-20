import { MapCoordinate, MapLineSegment } from '@/interface/map'

export const getLineSegmentCenter = (lineSegment: MapLineSegment) => {
    const start = lineSegment.start
    const end = lineSegment.end

    const centerLat = (start.lat + end.lat) / 2
    const centerLng = (start.lng + end.lng) / 2

    const center: MapCoordinate = {
        lat: centerLat,
        lng: centerLng,
    }

    return center
}
