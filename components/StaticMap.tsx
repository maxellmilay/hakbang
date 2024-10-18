import React from 'react'
import { MapLineSegment } from '@/interface/map'

const containerStyle = {
    width: '500',
    height: '300',
}

interface PropsInterface {
    lineSegment: MapLineSegment
}

function StaticMap(props: PropsInterface) {
    const { lineSegment } = props

    const start = lineSegment.start
    const end = lineSegment.end

    const centerLat = (start.lat + end.lat) / 2
    const centerLng = (start.lng + end.lng) / 2

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=20&size=${containerStyle.width}x${containerStyle.height}&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`

    return (
        <div>
            <img src={mapUrl} alt="Static Map" />
        </div>
    )
}

export default StaticMap
