import axios from 'axios'

export const getNearestRoad = async (lat: number, lng: number) => {
    const roadsUrl = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
    try {
        const response = await axios.get(roadsUrl)
        if (
            response.data.snappedPoints &&
            response.data.snappedPoints.length > 0
        ) {
            const placeId = response.data.snappedPoints[0].placeId
            // Use the Place ID to get road name via the Places API
            const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
            const placeResponse = await axios.get(placeDetailsUrl)
            const roadName = placeResponse.data.result.name
            return roadName
        } else {
            console.error('No road found')
            return 'N/A'
        }
    } catch (error) {
        console.error('Error fetching the nearest road:', error)
        return 'N/A'
    }
}

interface Place {
    types: string[]
}

interface CountByType {
    [key: string]: number
}

export const getNearestPlaces = async (lat = 37.7749, lng = -122.4194) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
    const radius = 1200 // Define the radius in meters
    const types = 'restaurant|cafe|bank|hospital|entertainment' // Types of establishments you're interested in

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${types}&key=${apiKey}`

    try {
        const response = await axios.get(url)
        const placesData: Place[] = response.data.results

        const countByType = placesData.reduce<CountByType>((acc, place) => {
            place.types.forEach((type) => {
                acc[type] = (acc[type] || 0) + 1
            })
            return acc
        }, {})

        return countByType
    } catch (error) {
        console.error('Error fetching places data:', error)
        return {}
    }
}
