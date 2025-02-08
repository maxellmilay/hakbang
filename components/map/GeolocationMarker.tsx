'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Icon, DivIcon } from 'leaflet'

const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
)
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
    ssr: false,
})

const GeolocationMarker = () => {
    const [position, setPosition] = useState<[number, number] | null>(null)
    const [icon, setIcon] = useState<Icon | DivIcon | null>(null)

    const dotHTML = `<div class="dot"></div>`
    const dotClassName = 'glowing-dot'

    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('leaflet').then((leaflet) => {
                const L = leaflet.default

                // Define the glowing dot icon inside useEffect to avoid SSR issues
                const glowingDotIcon = L.divIcon({
                    className: dotClassName,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    popupAnchor: [0, -15],
                    html: dotHTML,
                })

                setIcon(glowingDotIcon)
            })
        }

        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser.')
            return
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setPosition([latitude, longitude])
            },
            (error) => {
                console.error('Error getting geolocation:', error)
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        )

        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    if (!position || !icon) return null

    return (
        <Marker position={position} icon={icon}>
            <Popup>You are here!</Popup>
        </Marker>
    )
}

export default GeolocationMarker
