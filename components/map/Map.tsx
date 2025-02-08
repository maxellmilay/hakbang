'use client'

import React, { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import GeolocationMarker from './GeolocationMarker'

// Dynamically import Leaflet-related components to prevent SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
)
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
)

interface MapProps {
    children?: ReactNode
    displayGeolocation?: boolean
}

const Map = (props: MapProps) => {
    const { children, displayGeolocation = false } = props

    return (
        <MapContainer
            center={[10.327760729473056, 123.92086779061553]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100vh', width: '100%', zIndex: 1 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {displayGeolocation && <GeolocationMarker />}
            {children}
        </MapContainer>
    )
}

export default Map
