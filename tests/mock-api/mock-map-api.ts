import colonGeoJSONData from '@/data/geojson/colon.json'
import { MapCoordinate } from '@/interface/map'

interface AccessibilityScoreData {
    score: number
    start: MapCoordinate
    end: MapCoordinate
}

const getRandomWeight = () => {
    return Math.floor(Math.random() * (20 - 5 + 1)) + 5
}

export const fetchMockAccessibilityScores = () => {
    const mapData: AccessibilityScoreData[] = colonGeoJSONData.features.map(
        (feature) => {
            return {
                score: getRandomWeight(),
                start: {
                    lat: feature.geometry.coordinates[0][1],
                    lng: feature.geometry.coordinates[0][0],
                },
                end: {
                    lat: feature.geometry.coordinates[1][1],
                    lng: feature.geometry.coordinates[1][0],
                },
            }
        }
    )

    return mapData
}
