'use client'

import { useEffect, useRef, useState } from 'react'
import {
    defaultMapCenter,
    defaultMapZoom,
    defaultMapContainerStyle,
    defaultMapOptions,
} from '@/constants/map-properties'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { FeatureCollection } from 'geojson'
import AppLayer from './AppLayer'

interface PropsInterface {
    geojsonData: FeatureCollection
}

const MapComponent = (props: PropsInterface) => {
    const { geojsonData } = props

    const [isPickingLocation, setIsPickingLocation] = useState(false)

    const mapRef = useRef<google.maps.Map | null>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)

    const [center, setCenter] = useState(defaultMapCenter)

    const [pickedCoordinates, setPickedCoordinates] = useState(defaultMapCenter)

    const [dataLayer, setDataLayer] = useState<google.maps.Data | null>(null)
    const [highlightedFeature, setHighlightedFeature] =
        useState<google.maps.Data.Feature | null>(null)

    const [previousColor, setPreviousColor] = useState('#8f9691')

    const handleSaveLocation = () => {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter()
            if (newCenter) {
                const lat = newCenter.lat()
                const lng = newCenter.lng()
                setPickedCoordinates({ lat, lng })
                console.log('LAT', lat, 'LANG', lng)
            }
        }
    }

    useEffect(() => {
        if (isMapLoaded && mapRef.current && geojsonData) {
            const map = mapRef.current

            // Create a Data Layer
            const newDataLayer = new google.maps.Data({ map })
            newDataLayer.addGeoJson(geojsonData)
            setDataLayer(newDataLayer)

            // Style the GeoJSON lines based on their 'weight' property
            newDataLayer.setStyle((feature) => {
                const weight = feature.getProperty('weight')

                const strokeWeight = typeof weight === 'number' ? weight : 0
                let strokeColor = '#8f9691' // Default to grey

                if (strokeWeight > 15) {
                    strokeColor = '#FF0000' // Change to red for heavier weights
                } else if (strokeWeight <= 15 && strokeWeight > 5) {
                    strokeColor = '#00FF00' // Green for mid-range weights
                }

                feature.setProperty('originalStrokeColor', strokeColor)

                return {
                    strokeColor: strokeColor,
                    strokeWeight: 10,
                    strokeOpacity: 1.0,
                }
            })

            newDataLayer.addListener(
                'click',
                (event: google.maps.Data.MouseEvent) => {
                    const feature = event.feature
                    const geometry = feature.getGeometry()

                    // Check if geometry exists
                    if (geometry) {
                        if (geometry.getType() === 'LineString') {
                            // Cast geometry to LineString
                            const lineString =
                                geometry as google.maps.Data.LineString
                            const coordinates = lineString
                                .getArray()
                                .map((latLng: google.maps.LatLng) => ({
                                    lat: latLng.lat(),
                                    lng: latLng.lng(),
                                }))
                            console.log('LineString coordinates:', coordinates)
                        } else if (geometry.getType() === 'Point') {
                            // Cast geometry to Point
                            const point = geometry as google.maps.Data.Point
                            const latLng = point.get()
                            console.log('Point coordinates:', {
                                lat: latLng.lat(),
                                lng: latLng.lng(),
                            })
                        } else {
                            console.log(
                                'Other geometry type:',
                                geometry.getType()
                            )
                        }
                    } else {
                        console.log('No geometry found for this feature.')
                    }
                }
            )

            // Optionally, fit the map to the bounds of the GeoJSON
            const bounds = new google.maps.LatLngBounds()
            newDataLayer.forEach((feature) => {
                feature.getGeometry()?.forEachLatLng((latLng) => {
                    bounds.extend(latLng)
                })
            })
            map.fitBounds(bounds)
        }
    }, [isMapLoaded, geojsonData, isPickingLocation])

    const handleDragEnd = () => {
        if (isPickingLocation && mapRef.current && dataLayer) {
            const currentCenter = new google.maps.LatLng(center)

            if (!currentCenter) return

            const centerLatLng = new google.maps.LatLng(
                currentCenter.lat(),
                currentCenter.lng()
            )

            let closestFeature = {} as google.maps.Data.Feature
            let minDistance = Number.MAX_VALUE

            dataLayer.forEach((feature: google.maps.Data.Feature) => {
                const geometry = feature.getGeometry()
                if (geometry && geometry.getType() === 'LineString') {
                    const lineString = geometry as google.maps.Data.LineString
                    const coordinates = lineString.getArray()

                    const point1 = coordinates[0]
                    const point2 = coordinates[1]

                    const linestringLat = (point1.lat() + point2.lat()) / 2
                    const linestringLng = (point1.lng() + point2.lng()) / 2

                    const distance =
                        google.maps.geometry.spherical.computeDistanceBetween(
                            centerLatLng,
                            new google.maps.LatLng(linestringLat, linestringLng)
                        )

                    if (distance < minDistance) {
                        minDistance = distance
                        closestFeature = feature
                    }
                }
            })

            if (closestFeature) {
                // Use type assertion to ensure it's treated as a string
                const strokeColor =
                    (closestFeature.getProperty(
                        'originalStrokeColor'
                    ) as string) || '#8f9691'

                setPreviousColor(strokeColor)

                // Highlight the closest feature
                dataLayer.overrideStyle(closestFeature, {
                    strokeColor: '#0000FF', // Blue for the closest feature
                    strokeWeight: 15,
                })
                setHighlightedFeature(closestFeature)
            }

            if (highlightedFeature) {
                // Reset the style of the previously highlighted feature
                dataLayer.overrideStyle(highlightedFeature, {
                    strokeColor: previousColor, // Default to grey
                    strokeWeight: 10,
                })
            }
        }
    }

    return (
        <div className="w-full">
            <AppLayer
                center={center}
                setIsPickingLocation={setIsPickingLocation}
                isPickingLocation={isPickingLocation}
                handleSaveLocation={handleSaveLocation}
                pickedCoordinates={pickedCoordinates}
                setPickedCoordinates={setPickedCoordinates}
            />
            <GoogleMap
                mapContainerStyle={defaultMapContainerStyle}
                center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions}
                onLoad={(map) => {
                    mapRef.current = map
                    setIsMapLoaded(true)
                }}
                onCenterChanged={
                    isPickingLocation
                        ? () => {
                              if (mapRef.current) {
                                  const newCenter = mapRef.current.getCenter()
                                  if (newCenter) {
                                      setCenter({
                                          lat: newCenter.lat(),
                                          lng: newCenter.lng(),
                                      })
                                  }
                              }
                          }
                        : () => {}
                }
                onDragEnd={handleDragEnd}
            >
                {isPickingLocation && <Marker position={center} />}
            </GoogleMap>
        </div>
    )
}

export { MapComponent }
