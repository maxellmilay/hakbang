export interface MapCoordinate {
    latitude: number
    longitude: number
}

export interface MapLineSegment {
    id?: number
    start_coordinates: MapCoordinate
    end_coordinates: MapCoordinate
    accessibility_score?: number
    adjacent_street?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
    removed?: boolean
}

export interface JSONFeature {
    type: string
    properties: {
        weight: string | null
        nearestStreet: string
    }
    geometry: {
        type: string
        coordinates: number[][]
    }
}

export interface JSONFeatureCollection {
    type: string
    features: JSONFeature[]
}

export interface APICoordinate {
    id: number
    latitude: string
    longitude: string
    removed: boolean
}

export interface Sidewalk {
    id: number
    score: number
    startCoordinates: APICoordinate
    endCoordinates: APICoordinate
}
