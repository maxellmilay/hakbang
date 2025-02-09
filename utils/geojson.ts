import { JSONFeature, MapLineSegment, Sidewalk } from '@/interface/map'
import {
    FeatureCollection,
    Feature,
    LineString,
    GeoJsonProperties,
} from 'geojson'

export const extractFeatureCoordinates = (
    feature: google.maps.Data.Feature
) => {
    const geometry = feature.getGeometry()
    if (geometry && geometry.getType() === 'LineString') {
        const lineString = geometry as google.maps.Data.LineString
        const coordinates = lineString.getArray()

        const point1 = coordinates[0]
        const point2 = coordinates[1]

        const segmentCoordinates: MapLineSegment = {
            start_coordinates: {
                latitude: point1.lat(),
                longitude: point1.lng(),
            },
            end_coordinates: {
                latitude: point2.lat(),
                longitude: point2.lng(),
            },
        }

        return segmentCoordinates
    } else {
        const emptySegment: MapLineSegment = {
            start_coordinates: {
                latitude: 0,
                longitude: 0,
            },
            end_coordinates: {
                latitude: 0,
                longitude: 0,
            },
        }

        return emptySegment
    }
}

export const extractJSONFeatureCoordinates = (feature: JSONFeature) => {
    const coordinateList = feature.geometry.coordinates

    const lineSegmentCoordinates: MapLineSegment = {
        start_coordinates: {
            latitude: coordinateList[0][1],
            longitude: coordinateList[0][0],
        },
        end_coordinates: {
            latitude: coordinateList[1][1],
            longitude: coordinateList[1][0],
        },
    }

    return lineSegmentCoordinates
}

export const buildGeoJSON = (sidewalks: Sidewalk[]) => {
    const features: Feature<LineString, GeoJsonProperties>[] = sidewalks.map(
        (sidewalk) => {
            return {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [
                            parseFloat(sidewalk.start_coordinates.longitude),
                            parseFloat(sidewalk.start_coordinates.latitude),
                        ],
                        [
                            parseFloat(sidewalk.end_coordinates.longitude),
                            parseFloat(sidewalk.end_coordinates.latitude),
                        ],
                    ],
                },
                properties: {
                    id: sidewalk.id,
                },
            }
        }
    )

    const geoJson: FeatureCollection = {
        type: 'FeatureCollection',
        features,
    }

    return geoJson
}
