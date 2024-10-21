import colonGeoJSONData from '@/data/geojson/mandaue.json'
import { MapCoordinate } from '@/interface/map'

export interface AccessibilityScoreData {
    score?: number
    start_coordinates: MapCoordinate
    end_coordinates: MapCoordinate
}

const getRandomWeight = () => {
    return Math.floor(Math.random() * (20 - 5 + 1)) + 5
}

export const fetchMockAccessibilityScores = () => {
    const mapData: AccessibilityScoreData[] = colonGeoJSONData.features.map(
        (feature) => {
            return {
                score: getRandomWeight(),
                start_coordinates: {
                    latitude: feature.geometry.coordinates[0][1],
                    longitude: feature.geometry.coordinates[0][0],
                },
                end_coordinates: {
                    latitude: feature.geometry.coordinates[1][1],
                    longitude: feature.geometry.coordinates[1][0],
                },
            }
        }
    )

    return mapData
}
