'use client'

import FullScreenLoader from '@/components/FullScreenLoader'
import { Libraries, useJsApiLoader } from '@react-google-maps/api'
import { ReactNode } from 'react'

const libraries = ['places', 'drawing', 'geometry', 'visualization']

interface MapProvider {
    children: ReactNode
}

export function MapProvider({ children }: MapProvider) {
    const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
        libraries: libraries as Libraries,
    })

    console.log('map provider', scriptLoaded, loadError)

    if (loadError) return <p>Encountered error while loading google maps</p> // create error screen

    if (!scriptLoaded) return <FullScreenLoader />

    return children
}
