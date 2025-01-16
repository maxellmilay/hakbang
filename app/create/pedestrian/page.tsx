'use client'

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import {
    defaultMapContainerStyle,
    defaultMapZoom,
    defaultMapCenter,
} from '@/constants/map-properties'
import { MapProvider } from '@/providers/map-provider'
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api'
import Button from '@/components/generic/Button'

const lineOptions = {
    strokeColor: 'blue',
    strokeOpacity: 1.0,
    strokeWeight: 2,
}

const CreatePedestrian = () => {
    const [isMarkingPedestrianEdges, setIsMarkingPedestrianEdges] =
        useState(false)
    const [markedPedestrianEdges, setMarkedPedestrianEdges] = useState(
        [] as google.maps.LatLngLiteral[]
    )

    const updateMarkedPedestrianEdges = (event: google.maps.MapMouseEvent) => {
        if (!event.latLng || !isMarkingPedestrianEdges) return
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()

        setMarkedPedestrianEdges((prevMarkedPedestrianEdges) => [
            ...prevMarkedPedestrianEdges,
            { lat, lng },
        ])
    }

    const cancelMarkedPedestrialEdges = () => {
        setIsMarkingPedestrianEdges(false)
        setMarkedPedestrianEdges([])
    }

    const saveMarkedPedestrialEdges = () => {
        setIsMarkingPedestrianEdges(false)
        setMarkedPedestrianEdges([])
    }

    return (
        <MapProvider>
            <div className="w-full relative">
                {!isMarkingPedestrianEdges ? (
                    <Button
                        className="absolute bottom-10 right-20 z-[1] bg-primary"
                        onClick={() => setIsMarkingPedestrianEdges(true)}
                    >
                        CREATE
                    </Button>
                ) : (
                    <>
                        <div className="absolute top-0 left-0 w-full z-[1] bg-primary py-5 flex justify-center items-center font-semibold border-b border-black">
                            Creating Pedestrian
                        </div>
                        <Button
                            className="absolute bottom-10 right-44 z-[1] bg-white hover:bg-red-400"
                            onClick={cancelMarkedPedestrialEdges}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="absolute bottom-10 right-20 z-[1] bg-primary"
                            onClick={saveMarkedPedestrialEdges}
                        >
                            Save
                        </Button>
                    </>
                )}

                <GoogleMap
                    mapContainerStyle={defaultMapContainerStyle}
                    zoom={defaultMapZoom}
                    center={{
                        lat: defaultMapCenter.latitude,
                        lng: defaultMapCenter.longitude,
                    }}
                    onClick={updateMarkedPedestrianEdges}
                    options={{
                        styles: [
                            {
                                featureType: 'all',
                                elementType: 'labels',
                                stylers: [
                                    {
                                        visibility: 'no',
                                    },
                                ],
                            },
                        ],
                    }}
                >
                    {markedPedestrianEdges.map((point, index) => (
                        <>
                            <Marker
                                key={index}
                                position={{ lat: point.lat, lng: point.lng }}
                                icon={{
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 5,
                                    fillColor: 'red',
                                    fillOpacity: 1,
                                    strokeWeight: 0,
                                }}
                            />
                        </>
                    ))}
                    {markedPedestrianEdges.length > 0 && (
                        <Polyline
                            path={markedPedestrianEdges}
                            options={lineOptions}
                        />
                    )}
                </GoogleMap>
            </div>
        </MapProvider>
    )
}

export default CreatePedestrian
