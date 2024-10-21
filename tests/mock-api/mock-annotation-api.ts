import colonGeoJSONData from '@/data/geojson/mandaue.json'
import { MapLineSegment } from '@/interface/map'
import { extractJSONFeatureCoordinates } from '@/utils/geojson'

export const fetchAnnotationDetails = (lineSegment: MapLineSegment) => {
    const selectedFeature = colonGeoJSONData.features.find((feature) => {
        const lineSegmentCoordinates = extractJSONFeatureCoordinates(feature)

        const isMatch =
            lineSegmentCoordinates.start_coordinates.latitude ==
                lineSegment.start_coordinates.latitude &&
            lineSegmentCoordinates.start_coordinates.longitude ==
                lineSegment.start_coordinates.longitude &&
            lineSegmentCoordinates.end_coordinates.latitude ==
                lineSegment.end_coordinates.latitude &&
            lineSegmentCoordinates.end_coordinates.longitude ==
                lineSegment.end_coordinates.longitude

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
            start_coordinates: {
                latitude: 0,
                longitude: 0,
            },
            end_coordinates: {
                latitude: 0,
                longitude: 0,
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
