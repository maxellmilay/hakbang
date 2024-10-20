import colonGeoJSONData from '@/data/geojson/colon.json'
import { MapLineSegment } from '@/interface/map'
import { extractJSONFeatureCoordinates } from '@/utils/geojson'

export const fetchAnnotationDetails = (lineSegment: MapLineSegment) => {
    const selectedFeature = colonGeoJSONData.features.find((feature) => {
        const lineSegmentCoordinates = extractJSONFeatureCoordinates(feature)

        const isMatch =
            lineSegmentCoordinates.start.lat == lineSegment.start.lat &&
            lineSegmentCoordinates.start.lng == lineSegment.start.lng &&
            lineSegmentCoordinates.end.lat == lineSegment.end.lat &&
            lineSegmentCoordinates.end.lng == lineSegment.end.lng

        if (isMatch) {
            return feature
        }
    })

    if (selectedFeature) {
        const selectedLineSegmentCoordinates =
            extractJSONFeatureCoordinates(selectedFeature)

        const data = {
            name: 'Annotation Title',
            nearestStreet: selectedFeature.properties.nearestStreet,
            anotator: 'John Doe',
            coordinates: selectedLineSegmentCoordinates,
            sidewalkWidth: 36,
            level: 4,
            walkability: 'Fair',
            accessibility: [
                {
                    label: 'Ramp',
                    checked: true,
                },
                {
                    label: 'Tactile paving',
                    checked: true,
                },
                {
                    label: 'Audible signals',
                    checked: false,
                },
                {
                    label: 'Braille signs',
                    checked: false,
                },
                {
                    label: 'Wide doorways',
                    checked: true,
                },
                {
                    label: 'Elevators',
                    checked: false,
                },
            ],
            obstructions: ['Street vendors', 'Electric post', 'Trees', 'Other'],
            comments:
                'The sidewalk is wide enough for two people to walk side by side. The tactile paving is well-maintained and the ramp is accessible. The street vendors are obstructing the sidewalk.',
            imagesUrls: [
                'https://tranches.s3.amazonaws.com/assets/image_2024-10-16_212913278.png',
                'https://tranches.s3.amazonaws.com/assets/image_2024-10-16_212913278.png',
                'https://tranches.s3.amazonaws.com/assets/image_2024-10-16_212913278.png',
                'https://tranches.s3.amazonaws.com/assets/image_2024-10-16_212913278.png',
            ],
        }

        return data
    }

    return {
        name: '',
        nearestStreet: '',
        anotator: '',
        coordinates: {
            start: {
                lat: 0,
                lng: 0,
            },
            end: {
                lat: 0,
                lng: 0,
            },
        },
        sidewalkWidth: 0,
        level: 0,
        walkability: '',
        accessibility: [
            {
                label: 'Ramp',
                checked: false,
            },
            {
                label: 'Tactile paving',
                checked: false,
            },
            {
                label: 'Audible signals',
                checked: false,
            },
            {
                label: 'Braille signs',
                checked: false,
            },
            {
                label: 'Wide doorways',
                checked: false,
            },
            {
                label: 'Elevators',
                checked: false,
            },
        ],
        obstructions: ['', '', '', ''],
        comments: '',
        imagesUrls: [
            'https://tranches.s3.amazonaws.com/assets/image_2024-10-16_212913278.png',
            'https://tranches.s3.amazonaws.com/assets/image_2024-10-16_212913278.png',
            'https://tranches.s3.amazonaws.com/assets/image_2024-10-16_212913278.png',
            'https://tranches.s3.amazonaws.com/assets/image_2024-10-16_212913278.png',
        ],
    }
}
