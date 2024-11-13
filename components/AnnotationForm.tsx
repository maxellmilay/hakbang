/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import debounce from 'lodash.debounce'

import { Icon } from '@iconify/react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import { MapLineSegment } from '@/interface/map'
import StaticMap from './StaticMap'

import useAnnotationStore from '@/store/annotation'
import useAuthStore from '@/store/auth'
import RadioItem from './RadioItem'

interface PropsInterface {
    setShowAnnotationForm: (show: boolean) => void
    saveAnnotation: (lineSegment: MapLineSegment, locationId: number) => void
    pickedCoordinates: {
        latitude: number
        longitude: number
    }
    pickedLineSegment: MapLineSegment
    previousAnnotationData: any
    cancelEditing: () => void
}

function AnnotationForm(props: PropsInterface) {
    const {
        createFile,
        createAnnotation,
        updateAnnotation,
        createAnnotationImage,
        getLocations,
        checkAnnotationNameAvailability,
        demoStep,
    } = useAnnotationStore()
    const { user } = useAuthStore()

    const {
        pickedCoordinates,
        saveAnnotation,
        pickedLineSegment,
        previousAnnotationData,
        cancelEditing,
    } = props

    const [images, setImages] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)

    const [title, setTitle] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isTitleAvailable, setIsTitleAvailable] = useState(true)

    // form states
    const [date, setDate] = useState<string | null>(null)
    const [sidewalkPresence, setSidewalkPresence] = useState<string | null>(
        null
    )
    const [sidewalkWidth, setSidewalkWidth] = useState<number | null>(null)
    const [sidewalkCondition, setSidewalkCondition] = useState<number | null>(0)
    const [rampGradient, setRampGradient] = useState<number | null>(0)
    const [streetFurniture, setStreetFurniture] = useState<number | null>(0)
    const [borderBuffer, setBorderBuffer] = useState<string | null>(null)
    const [lightingCondition, setLightingCondition] = useState<string | null>(
        null
    )

    const [previousTitle, setPreviousTitle] = useState('')

    // remarks from form
    const [sidewalkWidthRemarks, setSidewalkWidthRemarks] = useState<
        string | null
    >(null)
    const [rampGradientRemarks, setRampGradientRemarks] = useState<
        string | null
    >(null)
    const [streetFurnitureRemarks, setStreetFurnitureRemarks] = useState<
        string | null
    >(null)
    const [borderBufferRemarks, setBorderBufferRemarks] = useState<
        string | null
    >(null)
    const [lightingConditionRemarks, setLightingConditionRemarks] = useState<
        string | null
    >(null)
    const [sidewalkCondionRemarks, setSidewalkConditionRemarks] = useState<
        string | null
    >(null)

    const disableSave =
        !title ||
        !isTitleAvailable ||
        isTyping ||
        !date ||
        !sidewalkPresence ||
        (sidewalkPresence === 'Yes' &&
            (sidewalkWidth === null ||
                sidewalkCondition === null ||
                rampGradient === null ||
                streetFurniture === null ||
                borderBuffer === null ||
                lightingCondition === null))

    const checkTitleAvailability = debounce(async (title: string) => {
        if (!title) {
            setIsTitleAvailable(true)
            return
        }
        const isAvailable = await checkAnnotationNameAvailability(title)
        console.log(isAvailable, 'here')
        setIsTitleAvailable(isAvailable)
    }, 500)

    useEffect(() => {
        if (previousAnnotationData) {
            console.log(previousAnnotationData, 'previous')
            setTitle(previousAnnotationData.name || '')
            setPreviousTitle(previousAnnotationData.name || '')
            const formData =
                typeof previousAnnotationData?.form_data === 'string'
                    ? JSON.parse(previousAnnotationData?.form_data || '{}')
                    : previousAnnotationData?.form_data || {}
            setSidewalkPresence(formData.sidewalkPresence ? 'Yes' : 'No')
            setDate(formData.dateAndTime || '')
            setSidewalkWidth(formData.sidewalkWidth?.value || null)
            setSidewalkWidthRemarks(formData.sidewalkWidth?.remarks || null)
            setSidewalkCondition(formData.sidewalkCondition?.value || null)
            setSidewalkConditionRemarks(
                formData.sidewalkCondition?.remarks || null
            )
            setRampGradient(formData.rampGradient?.value || null)
            setRampGradientRemarks(formData.rampGradient?.remarks || null)
            setStreetFurniture(formData.streetFurniture?.value || null)
            setStreetFurnitureRemarks(formData.streetFurniture?.remarks || null)
            setBorderBuffer(formData.borderBuffer?.value || null)
            setBorderBufferRemarks(formData.borderBuffer?.remarks || null)
            setLightingCondition(formData.lightingCondition?.value || null)
            setLightingConditionRemarks(
                formData.lightingCondition?.remarks || null
            )
        }
    }, [previousAnnotationData])

    useEffect(() => {
        console.log(lightingCondition, 'lighting')
    }, [lightingCondition])

    useEffect(() => {
        const check = async () => {
            setIsTyping(true)
            if (title !== previousTitle) {
                await checkTitleAvailability(title)
            }
            setIsTyping(false)
        }
        check()
    }, [title])

    useEffect(() => {
        if (demoStep === 9) {
            setSidewalkPresence('Yes')
        }
    }, [demoStep])

    const uploadImage = async (file: Blob, fileName: string) => {
        if (!file) {
            console.error('No file selected')
            return
        }

        const requestBody = {
            fileName: fileName,
            fileType: file.type,
        }

        console.log('Request body:', requestBody)

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(
                    errorData.error || `HTTP error! status: ${response.status}`
                )
            }

            const { signedUrl, actualFileUrl } = await response.json()
            console.log('Signed URL:', signedUrl)
            console.log('Actual File URL:', actualFileUrl)

            // Now use the signed URL to upload the file to S3
            const uploadResponse = await fetch(signedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
                mode: 'cors',
            })

            if (uploadResponse.ok) {
                console.log('File uploaded successfully')
                return actualFileUrl // Return the actual file URL instead of the signed URL
            } else {
                throw new Error('Failed to upload file to S3')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const uploadImages = async () => {
        if (images.length === 0) {
            return
        }
        const uploadedUrls = []
        for (let i = 0; i < images.length; i++) {
            const imageUrl = images[i]
            console.log('Processing image:', imageUrl)
            try {
                const response = await fetch(imageUrl)
                const blob = await response.blob()
                const fileName = `image_${i + 1}_${Date.now()}.${blob.type.split('/')[1]}`
                console.log('Created blob:', blob, 'with fileName:', fileName)
                const actualFileUrl = await uploadImage(blob, fileName)
                if (actualFileUrl) {
                    uploadedUrls.push(actualFileUrl)
                    console.log('Uploaded image:', actualFileUrl)
                }
            } catch (error) {
                console.error('Error processing image:', imageUrl, error)
            }
        }
        return uploadedUrls
    }

    const getLocationId = async () => {
        try {
            const filters = {
                start_coordinates__latitude:
                    pickedLineSegment.start_coordinates.latitude.toString(),
                start_coordinates__longitude:
                    pickedLineSegment.start_coordinates.longitude.toString(),
                end_coordinates__latitude:
                    pickedLineSegment.end_coordinates.latitude.toString(),
                end_coordinates__longitude:
                    pickedLineSegment.end_coordinates.longitude.toString(),
            }

            const locations = await getLocations(filters)
            if (locations.total_count > 0) {
                return locations.objects[0].id
            }
            throw new Error('Location not found')
        } catch (error) {
            console.error('Error in getLocationId function:', error)
            return -1
        }
    }

    const save = async () => {
        if (disableSave || demoStep !== 0) return
        setIsSaving(true)
        try {
            const location_id = await getLocationId()
            if (location_id === -1) {
                throw new Error('Location not found')
            }

            const formData = {
                dateAndTime: date,
                sidewalkPresence: sidewalkPresence === 'Yes' ? true : false,
            }

            const additionalFormData = {
                sidewalkWidth: {
                    value: sidewalkWidth,
                    remarks: sidewalkWidthRemarks,
                },
                sidewalkCondition: {
                    value: sidewalkCondition,
                    remarks: sidewalkCondionRemarks,
                },
                rampGradient: {
                    value: rampGradient,
                    remarks: rampGradientRemarks,
                },
                streetFurniture: {
                    value: streetFurniture,
                    remarks: streetFurnitureRemarks,
                },
                borderBuffer: {
                    value: borderBuffer,
                    remarks: borderBufferRemarks,
                },
                lightingCondition: {
                    value: lightingCondition,
                    remarks: lightingConditionRemarks,
                },
            }

            const annotationData = {
                location_id,
                annotator_id: user.id,
                form_template_id: 1,
                name: title,
                form_data: formData.sidewalkPresence
                    ? JSON.stringify({ ...formData, ...additionalFormData })
                    : JSON.stringify(formData),
            }

            const annotation = previousAnnotationData
                ? await updateAnnotation(
                      previousAnnotationData.id,
                      annotationData
                  )
                : await createAnnotation(annotationData)

            const uploadedUrls = (await uploadImages()) || []
            console.log('All uploaded URLs:', uploadedUrls)
            const files_id = await Promise.all(
                uploadedUrls.map(async (url) => {
                    try {
                        const res = await createFile({ url })
                        return res.id
                    } catch (error) {
                        console.error('Error in createFile function:', error)
                        throw null
                    }
                })
            )

            await Promise.all(
                files_id.map(async (file_id) => {
                    try {
                        await createAnnotationImage({
                            annotation_id: annotation.id,
                            file_id,
                        })
                    } catch (error) {
                        console.error(
                            'Error in createAnnotationImage function:',
                            error
                        )
                    }
                })
            )

            saveAnnotation(pickedLineSegment, location_id)
        } catch (error) {
            console.error('Error in save function:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImages((prevImages) => [
                        ...prevImages,
                        reader.result as string,
                    ])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index))
    }

    return (
        <div className="absolute right-0 top-0 z-[100] w-lvw h-lvh bg-black/[.7] flex items-center justify-center">
            <div
                id="demo-annotation-form"
                className="flex flex-col bg-white rounded-md shadow-lg w-[520px] h-full max-h-[700px]"
            >
                <div className="flex items-start justify-between px-6 py-4">
                    <h1 className="font-semibold text-2xl">
                        {previousAnnotationData
                            ? 'Edit annotation'
                            : 'New annotation'}
                    </h1>
                    <button
                        onClick={() => {
                            cancelEditing()
                        }}
                        className="bg-primary rounded-md border-2 border-black
                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Icon
                            icon="material-symbols:close-rounded"
                            className="w-5 h-5"
                        />
                    </button>
                </div>
                <div className="flex flex-col px-6 py-2 gap-3 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-2 p-3 bg-gray-100 rounded-md w-full">
                        <p className="text-slate-600 text-sm">
                            <b>Coordinates:</b> {pickedCoordinates.latitude},{' '}
                            {pickedCoordinates.longitude}
                        </p>
                        <p className="text-slate-600 text-sm font-bold">
                            Line Segment
                        </p>
                        <p className="text-slate-600 text-xs ps-2">
                            <span className="font-bold">Starts at </span>
                            {`(${pickedLineSegment.start_coordinates.latitude},${pickedLineSegment.start_coordinates.longitude})`}
                        </p>
                        <p className="text-slate-600 text-xs ps-2">
                            <span className="font-bold">Ends at </span>
                            {`(${pickedLineSegment.end_coordinates.latitude},${pickedLineSegment.end_coordinates.longitude})`}
                        </p>
                    </div>
                    <StaticMap lineSegment={pickedLineSegment} />
                    <Divider />
                    <TextField
                        label="Street name/address"
                        variant="outlined"
                        size="small"
                        value={title || ''}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {!isTitleAvailable && (
                        <p className="text-red-500 text-sm">
                            Street name/address is already taken
                        </p>
                    )}
                    {/* <TextField
                        label="Date and time annotated"
                        variant="outlined"
                        type="datetime-local"
                        size="small"
                        onChange={(e) => setDate(e.target.value)}
                    /> */}
                    <div className="flex flex-col gap-1">
                        <p className="text-gray-500 font-semibold text-lg">
                            Date and time annotated
                        </p>
                        <input
                            type="datetime-local"
                            className="p-2 border border-gray-300 rounded-md"
                            value={date || ''}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">
                            <h3 className="font-bold">SIDEWALK PRESENCE</h3>{' '}
                            <p className="text-sm">Is there a sidewalk?</p>
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            row
                            // value={'Yes'}
                            value={sidewalkPresence || ''}
                            onChange={(e) =>
                                setSidewalkPresence(e.target.value)
                            }
                        >
                            <FormControlLabel
                                value="Yes"
                                control={<Radio />}
                                label="Yes"
                            />
                            <FormControlLabel
                                value="No"
                                control={<Radio />}
                                label="No"
                            />
                        </RadioGroup>
                    </FormControl>

                    {sidewalkPresence === 'Yes' && (
                        <>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <h3 className="text-slate-600 text-lg font-semibold">
                                        SIDEWALK WIDTH
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        What are the specific measurements for
                                        the sidewalk width in meters?
                                    </p>
                                </div>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Width in meters"
                                    type="number"
                                    value={sidewalkWidth || ''}
                                    onChange={(e) =>
                                        setSidewalkWidth(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1 mb-4">
                                <p className="text-gray-500 font-semibold">
                                    REMARKS
                                </p>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Remarks"
                                    multiline
                                    maxRows={4}
                                    value={sidewalkWidthRemarks ?? ''}
                                    onChange={(e) =>
                                        setSidewalkWidthRemarks(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <h3 className="text-slate-600 text-lg font-semibold">
                                        SIDEWALK CONDITION
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        What is the size of the cracks observed
                                        in milimeters?
                                    </p>
                                </div>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Size in milimeters"
                                    type="number"
                                    value={sidewalkCondition ?? ''}
                                    onChange={(e) =>
                                        setSidewalkCondition(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1 mb-4">
                                <p className="text-gray-500 font-semibold">
                                    REMARKS
                                </p>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Remarks"
                                    multiline
                                    maxRows={4}
                                    value={sidewalkCondionRemarks ?? ''}
                                    onChange={(e) =>
                                        setSidewalkConditionRemarks(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <div>
                                    <h3 className="text-slate-600 text-lg font-semibold">
                                        RAMP GRADIENT
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        What is the estimated gradient of the
                                        ramp observed?
                                    </p>
                                </div>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Gradient in degrees"
                                    type="number"
                                    value={rampGradient ?? ''}
                                    onChange={(e) =>
                                        setRampGradient(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1 mb-4">
                                <p className="text-gray-500 font-semibold">
                                    REMARKS
                                </p>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Remarks"
                                    multiline
                                    maxRows={4}
                                    value={rampGradientRemarks ?? ''}
                                    onChange={(e) =>
                                        setRampGradientRemarks(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <div>
                                    <h3 className="text-slate-600 text-lg font-semibold">
                                        STREET FURNITURE
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        In the presence of street furniture
                                        (benches, posts, poles, etc.), Is there
                                        at least 0.90m of walking space on the
                                        sidewalk? If so how much ang lewway?
                                    </p>
                                </div>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Lewway in meters"
                                    type="number"
                                    value={streetFurniture ?? ''}
                                    onChange={(e) =>
                                        setStreetFurniture(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1 mb-4">
                                <p className="text-gray-500 font-semibold">
                                    REMARKS
                                </p>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Remarks"
                                    multiline
                                    maxRows={4}
                                    value={streetFurnitureRemarks ?? ''}
                                    onChange={(e) =>
                                        setStreetFurnitureRemarks(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <FormControl>
                                <FormLabel id="demo-controlled-radio-buttons-group">
                                    <h3 className="font-bold">BORDER BUFFER</h3>
                                    <p className="text-sm">
                                        Is there a clear division between the
                                        sidewalk and the road itself via
                                        elevation or bollards present?
                                    </p>
                                </FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    row
                                    // value={'Yes'}
                                    value={borderBuffer || ''}
                                    onChange={(e) =>
                                        setBorderBuffer(e.target.value)
                                    }
                                >
                                    <FormControlLabel
                                        value="Yes"
                                        control={<Radio />}
                                        label="Yes"
                                    />
                                    <FormControlLabel
                                        value="No"
                                        control={<Radio />}
                                        label="No"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <div className="flex flex-col gap-1 mb-4">
                                <p className="text-gray-500 font-semibold text">
                                    REMARKS
                                </p>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Remarks"
                                    multiline
                                    maxRows={4}
                                    value={borderBufferRemarks ?? ''}
                                    onChange={(e) =>
                                        setBorderBufferRemarks(e.target.value)
                                    }
                                />
                            </div>

                            <RadioItem
                                header="LIGHTING CONDITION"
                                label="How well lit is the area?"
                                options={['Poor', 'Adequate', 'Excellent']}
                                value={lightingCondition || ''}
                                allowOther={false}
                                setValue={setLightingCondition}
                            />
                            <div className="flex flex-col gap-1 mb-4">
                                <p className="text-gray-500 font-semibold">
                                    REMARKS
                                </p>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Remarks"
                                    multiline
                                    maxRows={4}
                                    value={lightingConditionRemarks ?? ''}
                                    onChange={(e) =>
                                        setLightingConditionRemarks(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </>
                    )}

                    <p className="text-slate-600 font-semibold">
                        IMAGES (optional)
                    </p>
                    <div className="min-h-[210px] flex gap-2 overflow-x-auto custom-scrollbar overflow-y-hidden pb-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[150px] h-[200px] relative group"
                            >
                                <Image
                                    src={image}
                                    alt={`annotation image ${index + 1}`}
                                    fill
                                    sizes="150px"
                                    style={{
                                        objectFit: 'cover',
                                    }}
                                    className="rounded-md"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Icon
                                        icon="material-symbols:close"
                                        className="w-4 h-4"
                                    />
                                </button>
                            </div>
                        ))}
                        <label className="flex-shrink-0 w-[150px] h-[200px] border-dashed border-2 border-sky-500 rounded-md relative flex items-center justify-center cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                multiple
                            />
                            <Icon
                                icon="material-symbols:add"
                                className="w-6 h-6 text-sky-500"
                            />
                        </label>
                    </div>

                    <div className="w-full flex justify-end gap-2 py-4">
                        <button
                            id="demo-annotation-save"
                            onClick={async () => {
                                await checkTitleAvailability(title)
                                save()
                            }}
                            disabled={isSaving || disableSave}
                            className={`flex gap-1 items-center px-3 py-2 border-2 border-black rounded-md bg-primary
                                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]
                                    ${isSaving || disableSave ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Icon
                                icon="material-symbols:check"
                                className="w-4 h-4"
                            />
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnnotationForm
