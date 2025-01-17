'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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
import { getColorFromValue } from '@/utils/colormap'
import { PulsatingMarker } from './PulsatingMarker'
import FullScreenLoader from './FullScreenLoader'

interface PropsInterface {
    geojsonData: Record<string, unknown>
}

const MapComponent = (props: PropsInterface) => {
    const { geojsonData } = props

    const { getSidewalks } = useAnnotationStore()

    const [currentSidewalk, setCurrentSidewalk] = useState({ lat: 0, lng: 0 })
    const [isAccessibilityDataLoaded, setIsAccessibilityDataLoaded] =
        useState(false)
    const [accessibilityScores, setAccessibilityScores] = useState(
        [] as AccessibilityScoreData[]
    )
    const [isPickingSidewalk, setIsPickingSidewalk] = useState(false)
    const mapRef = useRef<google.maps.Map | null>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [center, setCenter] = useState(defaultMapCenter)
    const [pickedCoordinates, setPickedCoordinates] = useState(defaultMapCenter)
    const [pickedLineSegment, setPickedLineSegment] =
        useState<MapLineSegment | null>(null)
    const [highlightedFeature, setHighlightedFeature] =
        useState<google.maps.Data.Feature | null>(null)
    const [selectedLineSegment, setSelectedLineSegment] =
        useState<MapLineSegment | null>(null)

    const dataLayerRef = useRef<google.maps.Data | null>(null)

    const handleSaveSidewalk = () => {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter()
            if (newCenter) {
                const latitude = newCenter.lat()
                const longitude = newCenter.lng()
                setPickedCoordinates({ latitude, longitude })
            }
        }
    }

    useEffect(() => {
        if (isMapLoaded && mapRef.current && geojsonData) {
            const map = mapRef.current

            // Create a Data Layer
            const newDataLayer = new google.maps.Data({ map })
            newDataLayer.addGeoJson(geojsonData)
            newDataLayer.setStyle(() => {
                return {
                    strokeWeight: 0,
                }
            })
            dataLayerRef.current = newDataLayer

            const fetchSidewalksAtOnce = async () => {
                const res = await getSidewalks()

                let accessibilityScoresList: AccessibilityScoreData[] = []

                accessibilityScoresList = res.objects.map(
                    (lineSegment: MapLineSegment) => {
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
                    }
                )
                setAccessibilityScores(accessibilityScoresList)
                setIsAccessibilityDataLoaded(true)
            }

            fetchSidewalksAtOnce()

            dataLayerRef.current.addListener(
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
                        }
                    } else {
                        console.error('No geometry found for this feature.')
                    }
                }
            )

            // Optionally, fit the map to the bounds of the GeoJSON
            const bounds = new google.maps.LatLngBounds()
            dataLayerRef.current.forEach((feature) => {
                feature.getGeometry()?.forEachLatLng((latLng) => {
                    bounds.extend(latLng)
                })
            })
            map.fitBounds(bounds)
        }
    }, [isMapLoaded, geojsonData, getSidewalks])

    useEffect(() => {
        if (dataLayerRef.current && accessibilityScores.length > 0) {
            // Style the GeoJSON lines based on their 'weight' property
            dataLayerRef.current.setStyle((feature) => {
                const coordinates = extractFeatureCoordinates(feature)
                let strokeColor = '#8f9691' // Default to grey

                if (accessibilityScores) {
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
                            return scoreData
                        }
                    })

                    if (weightData) {
                        const weight = weightData.score
                        if (weight) {
                            strokeColor = getColorFromValue(weight)
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
    }, [accessibilityScores])

    const resetFeatureStyles = useCallback(() => {
        if (dataLayerRef.current && highlightedFeature) {
            const originalStrokeColor = highlightedFeature.getProperty(
                'originalStrokeColor'
            )
            const strokeColor =
                typeof originalStrokeColor === 'string'
                    ? originalStrokeColor
                    : '#8f9691'
            dataLayerRef.current.overrideStyle(highlightedFeature, {
                strokeColor: strokeColor,
                strokeWeight: 10,
                zIndex: 1,
            })
        }
    }, [])

    useEffect(() => {
        if (selectedLineSegment && dataLayerRef.current) {
            let matchedFeature: google.maps.Data.Feature | null = null

            // Collect all features into an array
            const features: google.maps.Data.Feature[] = []
            dataLayerRef.current.forEach(
                (feature: google.maps.Data.Feature) => {
                    features.push(feature)
                }
            )

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
                        lineSegment.start_coordinates.latitude ==
                            selectedLineSegment.start_coordinates.latitude &&
                        lineSegment.start_coordinates.longitude ==
                            selectedLineSegment.start_coordinates.longitude &&
                        lineSegment.end_coordinates.latitude ==
                            selectedLineSegment.end_coordinates.latitude &&
                        lineSegment.end_coordinates.longitude ==
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
                dataLayerRef.current.overrideStyle(matchedFeature, {
                    strokeColor: '#0000FF', // Blue color for the highlighted feature
                    strokeWeight: 25,
                    zIndex: 1000, // Ensure it appears on top
                })

                const lineSegment = extractFeatureCoordinates(matchedFeature)

                const lineSegmentCenter = getLineSegmentCenter(lineSegment)

                if (mapRef.current) {
                    mapRef.current.setCenter({
                        lat: lineSegmentCenter.latitude,
                        lng: lineSegmentCenter.longitude,
                    })
                }

                setPickedLineSegment(extractFeatureCoordinates(matchedFeature))

                // Update the highlighted feature state
                setHighlightedFeature(matchedFeature)
            }
        } else {
            resetFeatureStyles()
        }
    }, [selectedLineSegment, highlightedFeature, resetFeatureStyles])

    const handleDragEnd = () => {
        if (isPickingSidewalk && mapRef.current && dataLayerRef.current) {
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
            let currentLineSegmentCenter = center

            dataLayerRef.current.forEach(
                (feature: google.maps.Data.Feature) => {
                    const geometry = feature.getGeometry()
                    if (geometry && geometry.getType() === 'LineString') {
                        const lineString =
                            geometry as google.maps.Data.LineString
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
                                new google.maps.LatLng(
                                    linestringLat,
                                    linestringLng
                                )
                            )
                        if (distance < minDistance) {
                            minDistance = distance
                            closestFeature = feature
                            currentLineSegmentCenter = {
                                latitude: linestringLat,
                                longitude: linestringLng,
                            }
                        }
                    }
                }
            )

            if (closestFeature && minDistance < 30) {
                setCenter(currentLineSegmentCenter)

                dataLayerRef.current.overrideStyle(closestFeature, {
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

                if (minDistance >= 30) {
                    setPickedLineSegment(null)
                }
            }
        }
    }

    useEffect(() => {
        if (navigator.geolocation) {
            const watcher = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setCurrentSidewalk({ lat: latitude, lng: longitude })
                },
                (error) => console.error('Error getting sidewalk:', error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            )

            // Cleanup the watcher on component unmount
            return () => navigator.geolocation.clearWatch(watcher)
        } else {
            console.error('Geolocation is not supported by this browser.')
        }
    }, [])

    const handleMapClick = () => {
        resetFeatureStyles()
        setSelectedLineSegment(null)
    }

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.addListener('zoom_changed', () => {
                resetFeatureStyles()
                setPickedLineSegment(null)
            })
        }
    }, [dataLayerRef.current, highlightedFeature])

    return (
        <div className="w-full">
            {!isAccessibilityDataLoaded && <FullScreenLoader />}
            <AppLayer
                center={center}
                setIsPickingSidewalk={setIsPickingSidewalk}
                isPickingSidewalk={isPickingSidewalk}
                handleSaveSidewalk={handleSaveSidewalk}
                pickedCoordinates={pickedCoordinates}
                setPickedCoordinates={setPickedCoordinates}
                resetFeatureStyles={resetFeatureStyles}
                pickedLineSegment={pickedLineSegment}
                setPickedLineSegment={setPickedLineSegment}
                selectedLineSegment={selectedLineSegment}
                setSelectedLineSegment={setSelectedLineSegment}
                setAccessibilityScores={setAccessibilityScores}
                accessibilityScores={accessibilityScores}
                isAccessibilityDataLoaded={isAccessibilityDataLoaded}
            />
            <GoogleMap
                mapContainerStyle={defaultMapContainerStyle}
                zoom={defaultMapZoom}
                options={defaultMapOptions(google)}
                onLoad={(map) => {
                    mapRef.current = map
                    setIsMapLoaded(true)
                }}
                onCenterChanged={
                    isPickingSidewalk
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
                {isPickingSidewalk && (
                    <Marker
                        position={{
                            lat: center.latitude,
                            lng: center.longitude,
                        }}
                    />
                )}
                {currentSidewalk && (
                    <PulsatingMarker position={currentSidewalk} />
                )}
            </GoogleMap>
        </div>
    )
}

export { MapComponent }
