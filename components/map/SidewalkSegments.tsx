'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { FeatureCollection, Feature } from 'geojson'

import useAnnotationStore from '@/store/annotation'

import { buildGeoJSON } from '@/utils/geojson'

const GeoJSON = dynamic(
    () => import('react-leaflet').then((mod) => mod.GeoJSON),
    { ssr: false }
)

const SidewalkSegments = () => {
    const {
        getSimpleSidewalks,
        getAnnotationIds,
        getSidewalkDetails,
        setIsAnnotationDetailModalOpen,
    } = useAnnotationStore()

    const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(
        null
    )

    useEffect(() => {
        const fetchRawSidewalkData = async () => {
            const res = await getSimpleSidewalks()
            const generatedGeojson = buildGeoJSON(res.objects)
            setGeojsonData(generatedGeojson)
        }
        fetchRawSidewalkData()
    }, [])

    const handleSidewalkClick = async (feature: Feature) => {
        const sidewalkId = feature.properties?.id
        await getAnnotationIds(sidewalkId)
        await getSidewalkDetails(sidewalkId)
        setIsAnnotationDetailModalOpen(true)
    }

    if (!geojsonData || !geojsonData.features) {
        return null
    }

    return (
        <GeoJSON
            data={geojsonData}
            style={() => ({
                color: 'blue',
                weight: 5,
            })}
            onEachFeature={(feature, layer) => {
                layer.on('click', () => {
                    handleSidewalkClick(feature)
                })

                if (feature.properties?.name) {
                    layer.bindPopup(`<b>${feature.properties.name}</b>`)
                }
            }}
        />
    )
}

export default SidewalkSegments
