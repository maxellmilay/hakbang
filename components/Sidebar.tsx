'use client'

import { Icon } from '@iconify/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { MapLineSegment } from '@/interface/map'
import { motion, AnimatePresence } from 'framer-motion'
import Skeleton from '@mui/material/Skeleton'
import Image from 'next/image'

import useAuthStore from '@/store/auth'
import useAnnotationStore from '@/store/annotation'

import mockSidebarAnnotations from '@/data/coachmarks/sidebarAnnotations.json'
// import Image from 'next/image'

interface PropsInterface {
    isMobile: boolean
    expand: boolean
    pickLocation: () => void
    setExpandSidebar: (expand: boolean) => void
    setSelectedLineSegment: Dispatch<SetStateAction<MapLineSegment | null>>
    isPickingLocation: boolean
}

interface Annotation {
    id: number
    level: number
    name: string
    lineSegment: MapLineSegment
}

interface AnnotationItem {
    date: string
    annotations: Annotation[]
}

function Sidebar(props: PropsInterface) {
    const { user, getUser } = useAuthStore()
    const {
        sidebarAnnotations,
        getSidebarAnnotations,
        getAccessibilityColor,
        sidebarAnnotationsPage,
        sidebarAnnotationsMaxPage,
        fetchMoreSidebarAnnotations,
        demoStep,
    } = useAnnotationStore()

    const [isLoading, setIsLoading] = useState(true)
    const {
        isMobile,
        expand = true,
        setExpandSidebar,
        pickLocation,
        setSelectedLineSegment,
        isPickingLocation,
    } = props

    const disableInteraction = demoStep !== 0

    const annotations =
        demoStep === 0
            ? sidebarAnnotations
            : mockSidebarAnnotations.sidebarAnnotations

    const data: AnnotationItem[] = Object.entries(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        annotations.reduce((acc: any, annotation: any) => {
            const date = new Date(annotation.updated_on)
            const today = new Date()

            let dateKey
            if (date.toDateString() === today.toDateString()) {
                dateKey = 'Today'
            } else {
                dateKey = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
            }

            if (!acc[dateKey]) {
                acc[dateKey] = []
            }

            acc[dateKey].push({
                id: annotation.id,
                level: getAccessibilityColor(
                    annotation.location.accessibility_score
                ),
                name: annotation.name,
                lineSegment: {
                    id: annotation.location.id,
                    start_coordinates: {
                        latitude:
                            annotation.location.start_coordinates.latitude,
                        longitude:
                            annotation.location.start_coordinates.longitude,
                    },
                    end_coordinates: {
                        latitude: annotation.location.end_coordinates.latitude,
                        longitude:
                            annotation.location.end_coordinates.longitude,
                    },
                },
            })

            return acc
        }, {})
    ).map(([date, annotations]) => ({
        date,
        annotations: annotations as Annotation[],
    }))

    const toggleSidebar = () => {
        if (isPickingLocation) {
            return
        }
        setExpandSidebar(!expand)
    }

    const inspectAnnotation = (annotation: Annotation) => {
        setSelectedLineSegment(annotation.lineSegment)
    }

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            if (!user) {
                await getUser()
            }
            await getSidebarAnnotations()
            setIsLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div>
            <div
                className={`z-20 top-[26px] left-[30px] absolute flex gap-3 px-3 py-3 items-end rounded-md border-2
                ${!expand || !user ? 'border-black shadow-lg bg-primary' : 'border-transparent bg-white'}`}
            >
                {user && (
                    <button
                        onClick={toggleSidebar}
                        className={`${isPickingLocation && 'pointer-events-none'}`}
                    >
                        <Icon
                            icon="material-symbols:view-sidebar-outline"
                            className="w-8 h-8"
                        />
                    </button>
                )}

                {!isMobile && (
                    <Image
                        src="/logo-text.png"
                        alt="Lakbai Logo Text"
                        width={100}
                        height={35}
                        priority={true} // Optional: to preload the image
                        layout="intrinsic" // This ensures the aspect ratio is maintained
                    />
                )}
                {/* <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">lakb</h1>
                    <div className="relative w-9 h-9 scale-[.9]">
                        <div
                            className="absolute inset-0 bg-primary transform scale-[1.3] translate-y-[-1.5px]"
                            style={{
                                clipPath:
                                    'polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)',
                            }}
                        ></div>
                        <div
                            className="absolute inset-0 bg-black transform scale-[1.15] translate-y-[-1.5px]"
                            style={{
                                clipPath:
                                    'polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)',
                            }}
                        ></div>

                        <div
                            className="relative w-full h-full bg-primary flex items-end justify-center text-2xl font-bold translate-y-[-1.5px] tracking-wide"
                            style={{
                                clipPath:
                                    'polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)',
                            }}
                        >
                            AI
                        </div>
                    </div>
                </div> */}
            </div>
            {user && (
                <>
                    <AnimatePresence>
                        {expand && demoStep !== 1 && (
                            <motion.div
                                className="absolute h-lvh p-4 z-10"
                                key={1}
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                            >
                                <nav
                                    id="demo-sidebar"
                                    className={`bg-white w-[320px] h-full rounded-md border-2 border-black p-3 flex flex-col gap-2 transition-transform duration-300 ease-in-out ${
                                        expand
                                            ? 'translate-x-0'
                                            : '-translate-x-[calc(100%+1rem)]'
                                    }`}
                                >
                                    {/* ignore this, do not remove */}
                                    <div className="bg-level-0 bg-level-1 bg-level-2 bg-level-3 bg-level-4 bg-level-5 bg-level-6 bg-level-7 bg-level-8 bg-level-9 bg-level-10 bg-level-11 bg-level-12 hidden"></div>

                                    {/* <div className="h-[130px] min-h-[130px]"></div> */}
                                    <div className="h-[60px] min-h-[60px]"></div>
                                    <button
                                        onClick={() => {
                                            if (!disableInteraction) {
                                                pickLocation()
                                            }
                                        }}
                                        className="flex gap-3 p-3 items-center rounded-md border-2 border-black bg-primary transition-all duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <Icon
                                            icon="material-symbols:add-location-outline"
                                            className="w-6 h-6"
                                        />
                                        <p className="font-medium">
                                            Add annotation
                                        </p>
                                    </button>
                                    <div className="flex flex-col items-center gap-6 overflow-y-auto custom-scrollbar">
                                        {!isLoading ? (
                                            <>
                                                {data.map((set, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex flex-col gap-2 w-full"
                                                    >
                                                        <div className="p-2">
                                                            <p className="font-medium text-slate-600">
                                                                {set.date}
                                                            </p>
                                                        </div>
                                                        {set.annotations.map(
                                                            (
                                                                annotation,
                                                                index
                                                            ) => (
                                                                <button
                                                                    id={`demo-sidebar-item-${annotation.id}`}
                                                                    onClick={() => {
                                                                        if (
                                                                            !disableInteraction
                                                                        ) {
                                                                            inspectAnnotation(
                                                                                annotation
                                                                            )
                                                                        }
                                                                    }}
                                                                    key={index}
                                                                    className="rounded-md border border-transparent p-2 flex gap-2 items-center w-full hover:bg-primary-light hover:border hover:border-primary"
                                                                >
                                                                    <div
                                                                        className={`rounded-md min-w-6 w-6 h-6 border-2 border-black bg-level-${annotation.level}`}
                                                                    ></div>
                                                                    <p className="truncate max-w-[230px]">
                                                                        {
                                                                            annotation.name
                                                                        }
                                                                    </p>
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center w-full gap-3">
                                                {[...Array(10)].map(
                                                    (_, index) => (
                                                        <Skeleton
                                                            key={index}
                                                            variant="rounded"
                                                            width={280}
                                                            height={40}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {sidebarAnnotationsPage <
                                        sidebarAnnotationsMaxPage && (
                                        <button
                                            onClick={
                                                fetchMoreSidebarAnnotations
                                            }
                                            className="text-slate-600 hover:text-primary-dark duration-100"
                                        >
                                            Show more
                                        </button>
                                    )}
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    )
}

export default Sidebar
