import axios from 'axios'

export const getNearestRoad = async (latitude: number, longitude: number) => {
    const roadsUrl = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${process.env.GOOGLE_MAP_API_KEY}`
    try {
        const response = await axios.get(roadsUrl)
        if (
            response.data.snappedPoints &&
            response.data.snappedPoints.length > 0
        ) {
            const placeId = response.data.snappedPoints[0].placeId
            // Use the Place ID to get road name via the Places API
            const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAP_API_KEY}`
            const placeResponse = await axios.get(placeDetailsUrl)
            const roadName = placeResponse.data.result.name
            console.log('Nearest road found:', roadName)
            return roadName
        } else {
            console.log('No road found')
            return 'N/A'
        }
    } catch (error) {
        console.error('Error fetching the nearest road:', error)
        return 'N/A'
    }
}
