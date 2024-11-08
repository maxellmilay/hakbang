'use client'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'

import Sidebar from '@/components/Sidebar'
import AnnotationForm from '@/components/AnnotationForm'
import SearchBar from '@/components/SearchBar'
import FullScreenLoader from '@/components/FullScreenLoader'
import DemoModal from './DemoModal'

import AnnotationDetails from './AnnotationDetails'
import { MapLineSegment } from '@/interface/map'

import useAuthStore from '@/store/auth'
import useAnnotationStore from '@/store/annotation'

import { AccessibilityScoreData } from '@/tests/mock-api/mock-map-api'

import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

interface PropsInterface {
    isPickingLocation: boolean
    setIsPickingLocation: Dispatch<SetStateAction<boolean>>
    setPickedCoordinates: Dispatch<
        SetStateAction<{
            latitude: number
            longitude: number
        }>
    >
    pickedCoordinates: {
        latitude: number
        longitude: number
    }
    handleSaveLocation: () => void
    center: {
        latitude: number
        longitude: number
    }
    resetFeatureStyles: () => void
    pickedLineSegment: MapLineSegment | null
    setPickedLineSegment: Dispatch<SetStateAction<MapLineSegment | null>>
    selectedLineSegment: MapLineSegment | null
    setSelectedLineSegment: Dispatch<SetStateAction<MapLineSegment | null>>
    setAccessibilityScores: Dispatch<SetStateAction<AccessibilityScoreData[]>>
    accessibilityScores: AccessibilityScoreData[]
    isAccessibilityDataLoaded: boolean
}

const AppLayer = (props: PropsInterface) => {
    const { user, getUser } = useAuthStore()
    const { getLocationDetails, demoMode, setDemoMode, demoStep, setDemoStep } =
        useAnnotationStore()
    const {
        center,
        isPickingLocation,
        setIsPickingLocation,
        setPickedCoordinates,
        pickedCoordinates,
        handleSaveLocation,
        resetFeatureStyles,
        pickedLineSegment,
        setPickedLineSegment,
        selectedLineSegment,
        setSelectedLineSegment,
        setAccessibilityScores,
        accessibilityScores,
        isAccessibilityDataLoaded,
    } = props

    const [isMobile, setIsMobile] = useState(false)
    const [expandSidebar, setExpandSidebar] = useState(!isMobile)
    const [showAnnotationForm, setShowAnnotationForm] = useState(false)
    const [isFetchingUser, setIsFetchingUser] = useState(false)
    const [hasSeenGuide, setHasSeenGuide] = useState(false)
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

    const runDemo = () => {
        console.log('demo running')
        const steps = [
            {
                element: '#demo-sidebar',
                popover: {
                    title: 'Toggle Info Panel',
                    description: 'This button toggles the info panel',
                },
            },
        ]
        const driverObj = driver({
            steps,
            popoverClass: 'driverjs-theme',
            disableActiveInteraction: true,
            nextBtnText: 'Next',
            prevBtnText: 'Back',
            doneBtnText: 'Close',
            onDestroyStarted: () => {
                setDemoStep(0)
                driverObj.destroy()
            },
        })
        driverObj.drive()
    }

    useEffect(() => {
        // Check localStorage on component mount
        const guideStatus = localStorage.getItem('hasSeenAnnotatorGuide')
        setHasSeenGuide(!!guideStatus)
    }, [])

    const handleGuideClick = () => {
        localStorage.setItem('hasSeenAnnotatorGuide', 'true')
        setHasSeenGuide(true)
        setIsDemoModalOpen(true)
    }

    const pickLocation = () => {
        setIsPickingLocation(true)
        setExpandSidebar(false)
        setSelectedLineSegment(null)
        console.log('here', isPickingLocation)
    }

    const cancelPickLocation = () => {
        setPickedLineSegment(null)
        resetFeatureStyles()
        setIsPickingLocation(false)
        if (!isMobile) {
            setExpandSidebar(true)
        }
    }

    const removeAccessibilityScore = (lineSegment: AccessibilityScoreData) => {
        console.log(lineSegment, 'heree')
        console.log(accessibilityScores, 'scores')
        const newList = accessibilityScores.filter((score) => {
            return (
                score.start_coordinates.latitude.toString() !==
                    lineSegment.start_coordinates.latitude.toString() &&
                score.start_coordinates.longitude.toString() !==
                    lineSegment.start_coordinates.latitude.toString() &&
                score.end_coordinates.latitude.toString() !==
                    lineSegment.end_coordinates.latitude.toString() &&
                score.end_coordinates.longitude.toString() !==
                    lineSegment.end_coordinates.latitude.toString()
            )
        })
        setAccessibilityScores(newList)
    }

    const saveAnnotation = async (
        lineSegment: MapLineSegment,
        locationId: number
    ) => {
        const location = await getLocationDetails(locationId)
        const prev = accessibilityScores.filter(
            (score) =>
                score.start_coordinates.latitude !==
                    location.start_coordinates.latitude &&
                score.start_coordinates.longitude !==
                    location.start_coordinates.longitude &&
                score.end_coordinates.latitude !==
                    location.end_coordinates.latitude &&
                score.end_coordinates.longitude !==
                    location.end_coordinates.longitude
        )
        setAccessibilityScores([
            ...prev,
            {
                score: location.accessibility_score,
                start_coordinates: {
                    latitude: location.start_coordinates.latitude,
                    longitude: location.start_coordinates.longitude,
                },
                end_coordinates: {
                    latitude: location.end_coordinates.latitude,
                    longitude: location.end_coordinates.longitude,
                },
            },
        ])

        setShowAnnotationForm(false)
        setIsPickingLocation(false)
        setExpandSidebar(true)
        setSelectedLineSegment(lineSegment)
    }

    const closeAnnotationDetails = () => {
        setSelectedLineSegment(null)
        if (!isMobile) {
            setExpandSidebar(true)
        }
    }

    const confirmLocation = () => {
        resetFeatureStyles()
        handleSaveLocation()
        setShowAnnotationForm(true)
        setSelectedLineSegment(null)
    }

    const disableConfirmButton =
        !pickedCoordinates ||
        !pickedLineSegment ||
        Object.keys(pickedLineSegment).length === 0

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            const isCurrentlyMobile = width < 768

            // Only update states if there's an actual change in the breakpoint
            if (isCurrentlyMobile !== isMobile) {
                setIsMobile(isCurrentlyMobile)
                setExpandSidebar(!isCurrentlyMobile)
            }
        }

        handleResize() // Call it initially to set the correct state

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [isMobile]) // Add `isMobile` to the dependency array

    useEffect(() => {
        if (selectedLineSegment) {
            setExpandSidebar(false)
            setIsPickingLocation(false)
            setShowAnnotationForm(false)
            setPickedCoordinates({ latitude: 10.298684, longitude: 123.898283 })
        }
    }, [selectedLineSegment])

    useEffect(() => {
        setIsFetchingUser(true)
        getUser()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((e: any) => {
                console.error(e)
            })
            .finally(() => {
                setIsFetchingUser(false)
            })
    }, [])

    return (
        isAccessibilityDataLoaded && (
            <div
                className={`absolute top-0 left-0 right-0 bottom-0 z-[100] ${!showAnnotationForm && 'pointer-events-none'}`}
            >
                {selectedLineSegment === null && (
                    <div className="pointer-events-auto">
                        <Sidebar
                            isMobile={isMobile}
                            expand={expandSidebar}
                            setExpandSidebar={setExpandSidebar}
                            pickLocation={pickLocation}
                            setSelectedLineSegment={setSelectedLineSegment}
                            isPickingLocation={isPickingLocation}
                        />
                    </div>
                )}
                {!isFetchingUser || user ? (
                    <SearchBar isMobile={isMobile} />
                ) : (
                    <FullScreenLoader />
                )}
                {user && (
                    <>
                        {!isPickingLocation ? (
                            <div className="absolute z-40 right-12 bottom-2 p-4 pointer-events-auto right-2">
                                <div className="flex gap-3">
                                    {demoStep === 0 && (
                                        <button
                                            onClick={handleGuideClick}
                                            className={`font-semibold flex items-center justify-center p-3 bg-white border-2 border-black rounded-full hover:bg-primary transition-all duration-150 ease-in-out 
                                        ${!hasSeenGuide ? 'blink' : ''}`}
                                        >
                                            Annotator Guide
                                        </button>
                                    )}
                                    <button
                                        onClick={pickLocation}
                                        className="flex items-center justify-center p-3 bg-primary border-2 border-black rounded-full transition-all duration-100 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <Icon
                                            icon="material-symbols:add-location-outline"
                                            className="w-6 h-6"
                                        />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex p-4 gap-3 absolute z-40 bottom-0 w-full justify-between items-center pointer-events-auto">
                                {pickedCoordinates ? (
                                    <div className="p-3 rounded-3xl bg-white border border-black shadow-lg">
                                        {center.latitude}, {center.longitude}
                                    </div>
                                ) : (
                                    <div className="p-2 border-4 rounded-md border-black bg-primary">
                                        <h1 className="sm:text-3xl text-xl font-bold">
                                            Pick a location
                                        </h1>
                                    </div>
                                )}
                                <div className="flex gap-3 mr-12">
                                    <button
                                        onClick={cancelPickLocation}
                                        className="rounded-3xl p-3 bg-white shadow-lg hover:bg-slate-100 duration-100 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmLocation}
                                        disabled={disableConfirmButton}
                                        className={`flex items-center justify-center p-3 bg-primary border-2 border-black rounded-full transition-all duration-100 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
                                    ${
                                        disableConfirmButton
                                            ? 'opacity-50 cursor-not-allowed hover:-translate-x-0 hover:-translate-y-0 hover:shadow-none'
                                            : ''
                                    }`}
                                    >
                                        <Icon
                                            icon="material-symbols:check"
                                            className="w-6 h-6"
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {showAnnotationForm &&
                    pickedCoordinates &&
                    pickedLineSegment && (
                        <AnnotationForm
                            pickedCoordinates={pickedCoordinates}
                            setShowAnnotationForm={setShowAnnotationForm}
                            saveAnnotation={saveAnnotation}
                            pickedLineSegment={pickedLineSegment}
                        />
                    )}
                <AnimatePresence>
                    {isAccessibilityDataLoaded && selectedLineSegment && (
                        <motion.div
                            className="absolute z-50 w-full h-full"
                            key={JSON.stringify(selectedLineSegment)}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AnnotationDetails
                                selectedLineSegment={selectedLineSegment}
                                setSelectedLineSegment={setSelectedLineSegment}
                                closeAnnotationDetails={closeAnnotationDetails}
                                confirmLocation={confirmLocation}
                                removeAccessibilityScore={
                                    removeAccessibilityScore
                                }
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <DemoModal
                    isOpen={isDemoModalOpen}
                    onClose={() => setIsDemoModalOpen(false)}
                    onStartDemo={() => {
                        setIsDemoModalOpen(false)
                        runDemo()
                    }}
                />
            </div>
        )
    )
}

export default AppLayer
