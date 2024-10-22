/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { MapLineSegment } from '@/interface/map'
import Divider from '@mui/material/Divider'

import useAnnotationStore from '@/store/annotation'
import useAuthStore from '@/store/auth'

import { StaticImport } from 'next/dist/shared/lib/get-img-props'

interface PropsInterface {
    setSelectedLineSegment: Dispatch<SetStateAction<MapLineSegment | null>>
    closeAnnotationDetails: () => void
    selectedLineSegment: MapLineSegment | null
    confirmLocation: () => void
}

function AnnotationDetails(props: PropsInterface) {
    const { getAnnotations, getAccessibilityColor, getAccessibilityLabel } =
        useAnnotationStore()
    const { user } = useAuthStore()
    const {
        closeAnnotationDetails,
        setSelectedLineSegment,
        selectedLineSegment,
        confirmLocation,
    } = props

    const [isLoading, setIsLoading] = useState(true)
    const [noAnnotation, setNoAnnotation] = useState(false)
    const [annotationDetails, setSelectedLineSegmentAnnotation] =
        useState<any>(null)

    const formData = annotationDetails?.form_data

    const close = () => {
        closeAnnotationDetails()
        setSelectedLineSegment(null)
    }

    useEffect(() => {
        console.log(selectedLineSegment)
        const location__start_coordinates__latitude =
            selectedLineSegment?.start_coordinates.latitude.toString()
        const location__start_coordinates__longitude =
            selectedLineSegment?.start_coordinates.longitude.toString()
        const location__end_coordinates__latitude =
            selectedLineSegment?.end_coordinates.latitude.toString()
        const location__end_coordinates__longitude =
            selectedLineSegment?.end_coordinates.longitude.toString()
        if (
            !location__start_coordinates__latitude ||
            !location__start_coordinates__longitude ||
            !location__end_coordinates__latitude ||
            !location__end_coordinates__longitude
        ) {
            setIsLoading(false)
            return
        }
        const filters = {
            location__start_coordinates__latitude,
            location__start_coordinates__longitude,
            location__end_coordinates__latitude,
            location__end_coordinates__longitude,
        }

        getAnnotations(filters)
            .then((res: any) => {
                if (res.total_count !== 0) {
                    setSelectedLineSegmentAnnotation(res.objects[0])
                    console.log(res.objects[0].form_data)
                    setNoAnnotation(false)
                } else {
                    setNoAnnotation(true)
                }
            })
            .catch((err: any) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    return (
        <div className="absolute z-50 left-0 top-0 h-lvh p-4 w-full sm:w-fit pointer-events-auto">
            <div className="flex flex-col p-3 gap-2 bg-white border border-black rounded-md shadow-2xl h-full w-full sm:w-[470px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <h1>Loading...</h1>
                    </div>
                ) : !annotationDetails ? (
                    <>
                        <div className="flex justify-end items-start p-2">
                            <button
                                onClick={close}
                                className="bg-primary rounded-md border-2 border-black
                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <Icon
                                    icon="material-symbols:close-rounded"
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>
                        <div className="flex justify-center items-center h-full">
                            {!noAnnotation ? (
                                <h1>404 Not found</h1>
                            ) : user !== null ? (
                                <div className="flex flex-col gap-3 items-center">
                                    <h1 className="text-lg font-bold">
                                        No annotations found
                                    </h1>
                                    <button
                                        onClick={confirmLocation}
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
                                </div>
                            ) : (
                                <h1>No Annotation</h1>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-start p-2">
                            <h1 className="font-semibold text-2xl">
                                {annotationDetails.name}
                            </h1>
                            <button
                                onClick={close}
                                className="bg-primary rounded-md border-2 border-black
                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <Icon
                                    icon="material-symbols:close-rounded"
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>

                        <div className="flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar gap-2 grow">
                            <div className="flex flex-col px-3">
                                <p className="text-slate-600 text-sm">
                                    Annotated by:{' '}
                                    <span className="">
                                        {annotationDetails.annotator.full_name}
                                    </span>
                                </p>
                                <p className="text-slate-600 text-sm mb-2">
                                    Nearest Street:{' '}
                                    {annotationDetails.location.adjacent_street}
                                </p>
                                <div className="flex gap-5 bg-gray-100 p-2 rounded-md">
                                    <p className="text-slate-600 text-xs sm:text-sm">
                                        Start Coordinates: <br /> (
                                        {
                                            annotationDetails.location
                                                .start_coordinates.latitude
                                        }
                                        ,{' '}
                                        {
                                            annotationDetails.location
                                                .start_coordinates.longitude
                                        }{' '}
                                        )
                                    </p>
                                    <p className="text-slate-600 text-xs sm:text-sm">
                                        End Coordinates: <br />(
                                        {
                                            annotationDetails.location
                                                .end_coordinates.latitude
                                        }
                                        ,{' '}
                                        {
                                            annotationDetails.location
                                                .end_coordinates.longitude
                                        }{' '}
                                        )
                                    </p>
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="text-lg font-semibold">
                                    ACCESSIBILITY SCORE
                                </h3>
                                <div className="flex px-3 gap-3 font-semibold text-lg items-center">
                                    <div
                                        className={`w-6 h-6 rounded-md border-2 border-black
                            bg-level-${getAccessibilityColor(annotationDetails.location.accessibility_score)}`}
                                    ></div>
                                    {getAccessibilityLabel(
                                        annotationDetails.location
                                            .accessibility_score
                                    )}
                                </div>
                            </div>
                            <Divider variant="middle" />
                            {formData?.sidewalkPresence ? (
                                <div className="p-3 flex flex-col gap-3 text-slate-700">
                                    <div>
                                        <h3 className="font-semibold">
                                            SIDEWALK WIDTH
                                        </h3>
                                        <ul className="list-disc pl-5">
                                            <li>
                                                {formData?.sidewalkWidth?.value}
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            SIDEWALK CONDITION
                                        </h3>
                                        <ul className="list-disc pl-5">
                                            <li>
                                                {
                                                    formData?.sidewalkCondition
                                                        ?.value
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            RAMP GRADIENT
                                        </h3>
                                        <ul className="list-disc pl-5">
                                            <li>
                                                {formData?.rampGradient?.value}
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            STREET FURNITURE
                                        </h3>
                                        <ul className="list-disc pl-5">
                                            <li>
                                                {
                                                    formData?.streetFurniture
                                                        ?.value
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            BORDER BUFFER
                                        </h3>
                                        <ul className="list-disc pl-5">
                                            <li>
                                                {formData?.borderBuffer?.value}
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            LIGHTING CONDITION
                                        </h3>
                                        <ul className="list-disc pl-5">
                                            <li>
                                                {
                                                    formData?.lightingCondition
                                                        ?.value
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <h3 className="text-lg font-semibold text-center py-3">
                                    No sidewalk 🚧
                                </h3>
                            )}
                        </div>
                        <div className="min-h-[210px] flex gap-2 overflow-x-auto custom-scrollbar overflow-y-hidden pb-4">
                            {annotationDetails.images?.map(
                                (
                                    image: {
                                        file: { url: string | StaticImport }
                                    },
                                    index: React.Key | null | undefined
                                ) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 w-[150px] h-[200px] relative"
                                    >
                                        <Image
                                            src={image.file.url}
                                            alt={`annotation image ${Number(index) + 1}`}
                                            fill
                                            sizes="150px"
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            className="rounded-md"
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AnnotationDetails
