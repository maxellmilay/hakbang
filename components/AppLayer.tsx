/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
// React and related
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Third party libraries
import { Icon } from '@iconify/react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

// Components
import Sidebar from '@/components/Sidebar'
import AnnotationForm from '@/components/AnnotationForm'
import SearchBar from '@/components/SearchBar'
import FullScreenLoader from '@/components/FullScreenLoader'
import AnnotationDetails from './AnnotationDetails'
import DemoModal from './DemoModal'

// Types and interfaces
import { MapLineSegment } from '@/interface/map'
import { AccessibilityScoreData } from '@/tests/mock-api/mock-map-api'

// Store
import useAuthStore from '@/store/auth'
import useAnnotationStore from '@/store/annotation'

interface PropsInterface {
    isPickingSidewalk: boolean
    setIsPickingSidewalk: Dispatch<SetStateAction<boolean>>
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
    handleSaveSidewalk: () => void
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
    const { getSidewalkDetails, setDemoMode, demoStep, setDemoStep } =
        useAnnotationStore()
    const {
        center,
        isPickingSidewalk,
        setIsPickingSidewalk,
        setPickedCoordinates,
        pickedCoordinates,
        handleSaveSidewalk,
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
    const [previousAnnotationData, setPreviousAnnotationData] =
        useState<any>(null)
    const [isFetchingUser, setIsFetchingUser] = useState(false)
    const [hasSeenGuide, setHasSeenGuide] = useState(false)
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
    const [finishedDemo, setFinishedDemo] = useState(false)
    const [disableConfirmButton, setDisableConfirmButton] = useState(true)

    const disableInteraction = demoStep !== 0

    const runDemo = () => {
        let currentStep = 1
        setDemoStep(currentStep)
        setDemoMode(true)

        const steps = [
            {
                element: '#demo-app-layer',
                popover: {
                    title: 'Exploring the Map',
                    description:
                        'This is the interactive map displaying sidewalk segments. Each segment is colored based on its accessibility score\
                        <p>- <b>Green</b>: Highly accessible</p>\
                        <p>- <b>Yellow</b>: Moderately accessible</p>\
                        <p>- <b>Red</b>: Low accessibility</p>\
                        <p>- <b>Gray</b>: Not yet annotated</p>',
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        setExpandSidebar(true)
                        setTimeout(() => {
                            driverObj.moveNext()
                        }, 100)
                    },
                },
            },
            {
                element: '#demo-sidebar',
                popover: {
                    title: 'The Sidebar Menu',
                    description:
                        "On the left, you'll find the sidebar containing all your previous annotations. It's your personal log of contributions.",
                    onPrevClick: () => {
                        currentStep--
                        setDemoStep(currentStep)
                        setExpandSidebar(false)
                        driverObj.movePrevious()
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        driverObj.moveNext()
                    },
                },
            },
            {
                element: '#demo-sidebar-item-1',
                popover: {
                    title: 'Revisiting Annotations',
                    description:
                        "Click on any annotation in the sidebar to view its details again. It's a quick way to track and edit your past contributions.",
                    onPrevClick: () => {
                        currentStep--
                        setDemoStep(currentStep)
                        driverObj.movePrevious()
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        setExpandSidebar(false)
                        driverObj.moveNext()
                    },
                },
            },
            {
                element: '#nothing',
                popover: {
                    title: 'Adding a New Annotation',
                    description:
                        'Ready to contribute more? You can add a new annotation by:\
                        <p>1. Clicking on a <b>gray</b> sidewalk segment directly on the map.</p>\
                        <p>2. Clicking the <b>Sidewalk button</b> button at the bottom right.</p>',
                    onPrevClick: () => {
                        currentStep--
                        setDemoStep(currentStep)
                        setExpandSidebar(true)
                        setTimeout(() => {
                            driverObj.movePrevious()
                        }, 100)
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        driverObj.moveNext()
                    },
                },
            },
            {
                element: '#demo-add-annotation',
                popover: {
                    // title: 'Adding a New Annotation',
                    description: 'Click this button to add new annotation',
                    onPrevClick: () => {
                        currentStep--
                        setDemoStep(currentStep)
                        driverObj.movePrevious()
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        pickSidewalk()
                        setPickedCoordinates({
                            latitude: 10.295669,
                            longitude: 123.898039,
                        })
                        setPickedLineSegment({
                            start_coordinates: {
                                latitude: 10.327617498790715,
                                longitude: 123.94347949585345,
                            },
                            end_coordinates: {
                                latitude: 10.327645638697822,
                                longitude: 123.94341718779336,
                            },
                        })
                        driverObj.moveNext()
                    },
                },
            },
            {
                element: '#demo-app-layer',
                popover: {
                    title: 'Selecting a Sidewalk',
                    description:
                        'Use the sidewalk picker to choose a sidewalk segment you want to annotate. You can zoom and pan the map to find the exact location.',
                    onPrevClick: () => {
                        setPickedCoordinates({ latitude: 0, longitude: 0 })
                        setPickedLineSegment(null)
                        currentStep--
                        setDemoStep(currentStep)
                        cancelPickSidewalk()
                        driverObj.movePrevious()
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        driverObj.moveNext()
                    },
                },
            },
            {
                element: '#demo-confirm-location',
                popover: {
                    title: 'Confirming Your Choice',
                    description:
                        "Once you've selected a sidewalk, click the check to proceed to the annotation form.",
                    onPrevClick: () => {
                        currentStep--
                        setDemoStep(currentStep)
                        driverObj.movePrevious()
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        setShowAnnotationForm(true)
                        setTimeout(() => {
                            driverObj.moveNext()
                        }, 100)
                    },
                },
            },
            {
                element: '#demo-annotation-form',
                popover: {
                    title: 'Filling Out the Annotation Form',
                    description:
                        "Complete the form with details about the sidewalk: <br/><br/> • <b>Is there a sidewalk?</b> Select <b>'Yes'</b> or <b>'No.'</b><br/> - If <b>'Yes,'</b> additional fields will appear for more details.<br/> - If <b>'No,'</b> you can proceed to submit.<br/><br/> • Provide information on features like curb ramps, surface conditions, and obstructions.",
                    onPrevClick: () => {
                        currentStep--
                        setDemoStep(currentStep)
                        setShowAnnotationForm(false)
                        driverObj.movePrevious()
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        driverObj.moveNext()
                    },
                },
            },
            {
                element: '#demo-annotation-form',
                popover: {
                    title: 'Filling Out the Annotation Form',
                    // description:
                    //     "",
                    onPrevClick: () => {
                        currentStep--
                        setDemoStep(currentStep)
                        driverObj.movePrevious()
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        driverObj.moveNext()
                    },
                },
            },
            {
                element: '#demo-annotation-save',
                popover: {
                    title: 'Submitting Your Annotation',
                    description:
                        'After filling out the form, click <b>Save</b> to submit your annotation.',
                    onPrevClick: () => {
                        currentStep--
                        setDemoStep(currentStep)
                        driverObj.movePrevious()
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        setShowAnnotationForm(false)
                        setSelectedLineSegment({
                            start_coordinates: {
                                latitude: 10.328018163252343,
                                longitude: 123.94428332322309,
                            },
                            end_coordinates: {
                                latitude: 10.327956547419772,
                                longitude: 123.94425543303178,
                            },
                        })
                        setTimeout(() => {
                            driverObj.moveNext()
                        }, 100)
                    },
                },
            },
            {
                element: '#demo-annotation-details',
                popover: {
                    title: 'Reviewing Your Submission',
                    description:
                        "Your annotation is now saved! You'll see the sidewalk's updated details, including the new accessibility score. Feel free to explore how the score was calculated by clicking the provided link.",
                    onPrevClick: () => {
                        currentStep--
                        setDemoStep(currentStep)
                        setShowAnnotationForm(false)
                        driverObj.movePrevious()
                    },
                    onNextClick: () => {
                        currentStep++
                        setDemoStep(currentStep)
                        setSelectedLineSegment(null)
                        driverObj.moveNext()
                    },
                },
            },
        ]
        const driverObj = driver({
            steps,
            popoverClass: 'driverjs-theme',
            disableActiveInteraction: false,
            nextBtnText: 'Next',
            prevBtnText: 'Back',
            doneBtnText: 'Close',
            onDestroyStarted: () => {
                setDemoStep(0)
                setDemoMode(false)
                setFinishedDemo(true)
                setIsDemoModalOpen(true)
                driverObj.destroy()
            },
            allowClose: false,
            showProgress: true,
            showButtons: ['next'],
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

    const pickSidewalk = () => {
        setIsPickingSidewalk(true)
        setExpandSidebar(false)
        setSelectedLineSegment(null)
    }

    const cancelPickSidewalk = () => {
        setPickedLineSegment(null)
        resetFeatureStyles()
        setIsPickingSidewalk(false)
        if (!isMobile) {
            setExpandSidebar(true)
        }
    }

    const removeAccessibilityScore = (lineSegment: AccessibilityScoreData) => {
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
        sidewalkId: number
    ) => {
        const sidewalk = await getSidewalkDetails(sidewalkId)
        const prev = accessibilityScores.filter(
            (score) =>
                score.start_coordinates.latitude !==
                    sidewalk.start_coordinates.latitude &&
                score.start_coordinates.longitude !==
                    sidewalk.start_coordinates.longitude &&
                score.end_coordinates.latitude !==
                    sidewalk.end_coordinates.latitude &&
                score.end_coordinates.longitude !==
                    sidewalk.end_coordinates.longitude
        )
        setAccessibilityScores([
            ...prev,
            {
                score: sidewalk.accessibility_score,
                start_coordinates: {
                    latitude: sidewalk.start_coordinates.latitude,
                    longitude: sidewalk.start_coordinates.longitude,
                },
                end_coordinates: {
                    latitude: sidewalk.end_coordinates.latitude,
                    longitude: sidewalk.end_coordinates.longitude,
                },
            },
        ])

        setShowAnnotationForm(false)
        setIsPickingSidewalk(false)
        setExpandSidebar(true)
        setSelectedLineSegment(lineSegment)
    }

    const closeAnnotationDetails = () => {
        setSelectedLineSegment(null)
        if (!isMobile) {
            setExpandSidebar(true)
        }
    }

    const editAnnotation = (formData: any) => {
        setPreviousAnnotationData(formData)
        setShowAnnotationForm(true)
    }

    const confirmSidewalk = () => {
        resetFeatureStyles()
        handleSaveSidewalk()
        setShowAnnotationForm(true)
        setSelectedLineSegment(null)
    }

    useEffect(() => {
        setDisableConfirmButton(
            !pickedLineSegment || Object.keys(pickedLineSegment).length === 0
        )
    }, [pickedLineSegment])

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
            setIsPickingSidewalk(false)
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
                id="demo-app-layer"
                className={`absolute top-0 left-0 right-0 bottom-0 z-[100] ${!showAnnotationForm && 'pointer-events-none'}`}
            >
                {selectedLineSegment === null && (
                    <div className="pointer-events-auto">
                        <Sidebar
                            isMobile={isMobile}
                            expand={expandSidebar}
                            setExpandSidebar={setExpandSidebar}
                            pickSidewalk={pickSidewalk}
                            setSelectedLineSegment={setSelectedLineSegment}
                            isPickingSidewalk={isPickingSidewalk}
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
                        {!isPickingSidewalk ? (
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
                                        id="demo-add-annotation"
                                        onClick={() => {
                                            if (!disableInteraction) {
                                                pickSidewalk()
                                            }
                                        }}
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
                                            Pick a sidewalk
                                        </h1>
                                    </div>
                                )}
                                <div className="flex gap-3 mr-12">
                                    <button
                                        onClick={() => {
                                            if (!disableInteraction) {
                                                cancelPickSidewalk()
                                            }
                                        }}
                                        className="rounded-3xl p-3 bg-white shadow-lg hover:bg-slate-100 duration-100 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        id="demo-confirm-location"
                                        onClick={() => {
                                            if (!disableInteraction) {
                                                confirmSidewalk()
                                            }
                                        }}
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
                            previousAnnotationData={previousAnnotationData}
                            cancelEditing={() => {
                                setPreviousAnnotationData(null)
                                setShowAnnotationForm(false)
                            }}
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
                                confirmSidewalk={confirmSidewalk}
                                removeAccessibilityScore={
                                    removeAccessibilityScore
                                }
                                editAnnotation={editAnnotation}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <DemoModal
                    isOpen={isDemoModalOpen}
                    isFinished={finishedDemo}
                    setFinishedDemo={setFinishedDemo}
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
