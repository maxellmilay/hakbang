'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import debounce from 'lodash.debounce'

import { Icon } from '@iconify/react'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { MapLineSegment } from '@/interface/map'
import StaticMap from './StaticMap'

import useAnnotationStore from '@/store/annotation'
import useAuthStore from '@/store/auth'

import formDataTest from '@/form_data_test.json'

interface PropsInterface {
    setShowAnnotationForm: (show: boolean) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveAnnotation: (lineSegment: MapLineSegment) => void
    pickedCoordinates: {
        latitude: number
        longitude: number
    }
    pickedLineSegment: MapLineSegment
}

function AnnotationForm(props: PropsInterface) {
    const {
        createFile,
        createAnnotation,
        createAnnotationImage,
        getLocations,
        checkAnnotationNameAvailability,
    } = useAnnotationStore()
    const { user } = useAuthStore()

    const {
        pickedCoordinates,
        setShowAnnotationForm,
        saveAnnotation,
        pickedLineSegment,
    } = props

    const walkabiltyChoices = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
    const [choosenWalkabilityIndex, setChoosenWalkabilityIndex] = useState(0)
    const [images, setImages] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)

    const [title, setTitle] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isTitleAvailable, setIsTitleAvailable] = useState(true)

    const disableSave = !title || !isTitleAvailable || isTyping

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
        const check = async () => {
            setIsTyping(true)
            await checkTitleAvailability(title)
            setIsTyping(false)
        }
        check()
    }, [title])

    const [accessibilityFeatures, setAccessibilityFeatures] = useState([
        { checked: false, label: 'Ramp' },
        { checked: false, label: 'Tactile paving' },
        { checked: false, label: 'Audible signals' },
        { checked: false, label: 'Braille signs' },
        { checked: false, label: 'Wide doorways' },
        { checked: false, label: 'Elevators' },
        { checked: false, label: 'Accessible toilets' },
        { checked: false, label: 'Handrails' },
        { checked: false, label: 'Lowered counters' },
        { checked: false, label: 'Accessible parking' },
    ])

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
            if (locations.length > 0) {
                return locations.objects[0].id
            }
            return null
        } catch (error) {
            console.error('Error in getLocationId function:', error)
            return null
        }
    }

    const save = async () => {
        return
        setIsSaving(true)
        try {
            const uploadedUrls = (await uploadImages()) || []
            console.log('All uploaded URLs:', uploadedUrls)
            const files_id = await Promise.all(
                uploadedUrls.map(async (url) => {
                    try {
                        const res = await createFile({ url })
                        return res.id
                    } catch (error) {
                        console.error('Error in createFile function:', error)
                    }
                })
            )

            const annotationData = {
                location_id: await getLocationId(),
                annotator_id: user.id,
                form_template_id: 1,
                coordinates_id: 1, // temp
                name: title,
                form_data: formDataTest, // temp
            }

            const annotation = await createAnnotation(annotationData)
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

            saveAnnotation(pickedLineSegment)
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
            <div className="flex flex-col bg-white rounded-md shadow-lg w-[520px] h-[700px]">
                <div className="flex items-start justify-between px-6 py-4">
                    <h1 className="font-semibold text-2xl">New annotation</h1>
                    <button
                        onClick={() => {
                            setShowAnnotationForm(false)
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
                <div className="flex flex-col px-6 py-2 gap-3 overflow-y-auto">
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
                        label="Annotation title"
                        variant="outlined"
                        size="small"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {!isTitleAvailable && (
                        <p className="text-red-500 text-sm">
                            Annotation title is already taken
                        </p>
                    )}
                    {/* <TextField
                        label="Annotated by"
                        variant="outlined"
                        size="small"
                    /> */}
                    <div className="flex flex-col gap-2">
                        <p className="text-slate-600">Walkability</p>
                        <div className="flex gap-1 flex-wrap text-sm">
                            {walkabiltyChoices.map((choice, index) => (
                                <button
                                    onClick={() =>
                                        setChoosenWalkabilityIndex(index)
                                    }
                                    key={index}
                                    className={`flex p-2 gap-2 items-center rounded-md border-2 hover:bg-primary-light transition-all duration-200 ease-in-out
                                        ${
                                            index === choosenWalkabilityIndex
                                                ? 'border-primary bg-primary-light'
                                                : 'border-transparent'
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 rounded-md border-2 border-black
                                            bg-level-${index + 1}`}
                                    ></div>
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                    <TextField
                        label="Sidewalk width"
                        variant="outlined"
                        size="small"
                    />
                    <div className="flex flex-col gap-2">
                        <p className="text-slate-600">Accessibility features</p>
                        <div className="flex flex-col px-3 text-sm">
                            {accessibilityFeatures.map((feature, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={feature.checked}
                                            onChange={(e) => {
                                                const updatedFeatures = [
                                                    ...accessibilityFeatures,
                                                ]
                                                updatedFeatures[index].checked =
                                                    e.target.checked
                                                setAccessibilityFeatures(
                                                    updatedFeatures
                                                )
                                            }}
                                            name={feature.label}
                                        />
                                    }
                                    label={feature.label}
                                />
                            ))}
                        </div>
                    </div>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Comments"
                        multiline
                        maxRows={4}
                    />
                    <p className="text-slate-600">Images</p>
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
                </div>
                <div className="w-full flex justify-end gap-2 px-6 py-4">
                    <button
                        onClick={() => {
                            setShowAnnotationForm(false)
                        }}
                        className="flex gap-1 items-center px-3 py-2 border-2 border-black rounded-md bg-white
                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Icon
                            icon="material-symbols:my-location"
                            className="w-4 h-4"
                        />
                        Reposition
                    </button>
                    <button
                        onClick={save}
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
    )
}

export default AnnotationForm
