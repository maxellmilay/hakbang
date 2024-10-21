'use client'

import { useEffect, useRef, useState } from 'react'
import {
    defaultMapCenter,
    defaultMapZoom,
    defaultMapContainerStyle,
    defaultMapOptions,
} from '@/constants/map-properties'
import { GoogleMap, Marker } from '@react-google-maps/api'
import AppLayer from './AppLayer'
import { MapLineSegment } from '@/interface/map'
import { extractFeatureCoordinates } from '@/utils/geojson'
import { getLineSegmentCenter } from '@/utils/distance'
import useAnnotationStore from '@/store/annotation'
import { AccessibilityScoreData } from '@/tests/mock-api/mock-map-api'

interface PropsInterface {
    geojsonData: Record<string, unknown>
}

const MapComponent = (props: PropsInterface) => {
    const { geojsonData } = props

    const { getLocations } = useAnnotationStore()

    const [accessibilityScores, setAccessibilityScores] = useState(
        [] as AccessibilityScoreData[]
    )

    const [isPickingLocation, setIsPickingLocation] = useState(false)

    const mapRef = useRef<google.maps.Map | null>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)

    const [center, setCenter] = useState(defaultMapCenter)

    const [pickedCoordinates, setPickedCoordinates] = useState(defaultMapCenter)
    const [pickedLineSegment, setPickedLineSegment] = useState(
        {} as MapLineSegment
    )

    const [dataLayer, setDataLayer] = useState<google.maps.Data | null>(null)

    const [highlightedFeature, setHighlightedFeature] =
        useState<google.maps.Data.Feature | null>(null)

    const [selectedLineSegment, setSelectedLineSegment] =
        useState<MapLineSegment | null>(null)

    const handleSaveLocation = () => {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter()
            if (newCenter) {
                const latitude = newCenter.lat()
                const longitude = newCenter.lng()
                setPickedCoordinates({ latitude, longitude })
                console.log('LAT', longitude, 'LANG', longitude)
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

            const fetchLocations = async () => {
                const res = await getLocations()
                setAccessibilityScores(
                    res.objects.map((lineSegment: MapLineSegment) => {
                        const parsedLineSegment: AccessibilityScoreData = {
                            score: lineSegment.accessibility_score,
                            start_coordinates: {
                                latitude:
                                    lineSegment.start_coordinates.latitude,
                                longitude:
                                    lineSegment.start_coordinates.longitude,
                            },
                            end_coordinates: {
                                latitude: lineSegment.end_coordinates.latitude,
                                longitude:
                                    lineSegment.end_coordinates.longitude,
                            },
                        }
                        return parsedLineSegment
                    })
                )
            }

            fetchLocations()

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
                                    latitude: latLng.lat(),
                                    longitude: latLng.lng(),
                                }))

                            const lineSegment: MapLineSegment = {
                                start_coordinates: coordinates[0],
                                end_coordinates: coordinates[1],
                            }

                            setSelectedLineSegment(lineSegment)
                        } else if (geometry.getType() === 'Point') {
                            // Cast geometry to Point
                            const point = geometry as google.maps.Data.Point
                            const latLng = point.get()
                            console.log('Point coordinates:', {
                                latitude: latLng.lat(),
                                longitude: latLng.lng(),
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
    }, [isMapLoaded, geojsonData])

    useEffect(() => {
        if (dataLayer && accessibilityScores.length > 0) {
            // Style the GeoJSON lines based on their 'weight' property
            console.log(accessibilityScores)
            dataLayer.setStyle((feature) => {
                const coordinates = extractFeatureCoordinates(feature)
                let strokeColor = '#8f9691' // Default to grey

                if (accessibilityScores) {
                    // console.log(accessibilityScores)
                    const weightData = accessibilityScores.find((scoreData) => {
                        const isMatch =
                            coordinates.start_coordinates.longitude ==
                                scoreData.start_coordinates.longitude &&
                            coordinates.start_coordinates.latitude ==
                                scoreData.start_coordinates.latitude &&
                            coordinates.end_coordinates.longitude ==
                                scoreData.end_coordinates.longitude &&
                            coordinates.end_coordinates.latitude ==
                                scoreData.end_coordinates.latitude

                        if (isMatch) {
                            console.log('MATCH')
                            return scoreData
                        }
                    })

                    if (weightData) {
                        const weight = weightData.score
                        if (weight) {
                            if (weight > 0.75) {
                                strokeColor = '#70F915' // Dark Green
                            } else if (weight > 0.5) {
                                strokeColor = '#CAF9AB' // Light Green
                            } else if (weight < 0.25) {
                                strokeColor = '#F91515' // Dark Red
                            } else if (weight < 0.5) {
                                strokeColor = '#FF8282' // Light Red
                            } else if (weight == 0.5) {
                                strokeColor = '#FBD08F' // Yellow
                            }
                        }
                    }
                }

                feature.setProperty('originalStrokeColor', strokeColor)
                feature.setProperty('originalZIndex', 1)

                return {
                    strokeColor: strokeColor,
                    strokeWeight: 10,
                    strokeOpacity: 1.0,
                    zIndex: 1,
                }
            })
        }
    }, [dataLayer, accessibilityScores])

    const resetFeatureStyles = () => {
        if (dataLayer && highlightedFeature) {
            const originalStrokeColor = highlightedFeature.getProperty(
                'originalStrokeColor'
            )
            const strokeColor =
                typeof originalStrokeColor === 'string'
                    ? originalStrokeColor
                    : '#8f9691'
            dataLayer.overrideStyle(highlightedFeature, {
                strokeColor: strokeColor,
                strokeWeight: 10,
                zIndex: 1,
            })
        }
    }

    useEffect(() => {
        if (selectedLineSegment && dataLayer) {
            let matchedFeature: google.maps.Data.Feature | null = null

            // Collect all features into an array
            const features: google.maps.Data.Feature[] = []
            dataLayer.forEach((feature: google.maps.Data.Feature) => {
                features.push(feature)
            })

            // Use a for-of loop for better type inference
            for (const feature of features) {
                const geometry = feature.getGeometry()
                if (geometry && geometry.getType() === 'LineString') {
                    const lineString = geometry as google.maps.Data.LineString
                    const coordinates = lineString
                        .getArray()
                        .map((latLng: google.maps.LatLng) => ({
                            latitude: latLng.lat(),
                            longitude: latLng.lng(),
                        }))

                    const lineSegment = {
                        start_coordinates: coordinates[0],
                        end_coordinates: coordinates[1],
                    }

                    const isMatch =
                        lineSegment.start_coordinates.latitude ===
                            selectedLineSegment.start_coordinates.latitude &&
                        lineSegment.start_coordinates.longitude ===
                            selectedLineSegment.start_coordinates.longitude &&
                        lineSegment.end_coordinates.latitude ===
                            selectedLineSegment.end_coordinates.latitude &&
                        lineSegment.end_coordinates.longitude ===
                            selectedLineSegment.end_coordinates.longitude

                    if (isMatch) {
                        matchedFeature = feature
                        break // Exit the loop since we've found our match
                    }
                }
            }

            // Reset previous highlight if necessary
            if (highlightedFeature && highlightedFeature !== matchedFeature) {
                resetFeatureStyles()
            }

            if (matchedFeature) {
                // Highlight the matched feature
                dataLayer.overrideStyle(matchedFeature, {
                    strokeColor: '#0000FF', // Blue color for the highlighted feature
                    strokeWeight: 25,
                    zIndex: 1000, // Ensure it appears on top
                })

                setPickedLineSegment(extractFeatureCoordinates(matchedFeature))

                // Update the highlighted feature state
                setHighlightedFeature(matchedFeature)
            }
        } else {
            resetFeatureStyles()
        }
    }, [selectedLineSegment])

    const handleDragEnd = () => {
        if (isPickingLocation && mapRef.current && dataLayer) {
            const formattedCenter = {
                lat: center.latitude,
                lng: center.longitude,
            }
            const currentCenter = new google.maps.LatLng(formattedCenter)

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
                    const coordinates = lineString
                        .getArray()
                        .map((latLng: google.maps.LatLng) => ({
                            latitude: latLng.lat(),
                            longitude: latLng.lng(),
                        }))

                    const lineSegment = {
                        start_coordinates: coordinates[0],
                        end_coordinates: coordinates[1],
                    }

                    const {
                        latitude: linestringLat,
                        longitude: linestringLng,
                    } = getLineSegmentCenter(lineSegment)

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
                dataLayer.overrideStyle(closestFeature, {
                    strokeColor: '#0000FF', // Blue color for the highlighted feature
                    strokeWeight: 25,
                    zIndex: 1000, // Ensure it appears on top
                })

                setPickedLineSegment(extractFeatureCoordinates(closestFeature))

                // Update the highlighted feature state
                setHighlightedFeature(closestFeature)
            }

            if (highlightedFeature) {
                if (highlightedFeature === closestFeature) return
                resetFeatureStyles()
            }
        }
    }

    const handleMapClick = () => {
        resetFeatureStyles()
        setSelectedLineSegment(null)
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
                resetFeatureStyles={resetFeatureStyles}
                pickedLineSegment={pickedLineSegment}
                selectedLineSegment={selectedLineSegment}
                setSelectedLineSegment={setSelectedLineSegment}
            />
            <GoogleMap
                mapContainerStyle={defaultMapContainerStyle}
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
                                          latitude: newCenter.lat(),
                                          longitude: newCenter.lng(),
                                      })
                                  }
                              }
                          }
                        : () => {}
                }
                onDragEnd={handleDragEnd}
                onClick={handleMapClick}
            >
                {isPickingLocation && (
                    <Marker
                        position={{
                            lat: center.latitude,
                            lng: center.longitude,
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    )
}

export { MapComponent }
