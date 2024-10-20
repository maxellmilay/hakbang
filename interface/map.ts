export interface MapCoordinate {
    lat: number
    lng: number
}

export interface MapLineSegment {
    start: MapCoordinate
    end: MapCoordinate
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
