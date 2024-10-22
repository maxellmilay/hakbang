import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const getNearestPlaces = async (lat = 37.7749, lng = -122.4194) => {
    const apiKey = process.env.GOOGLE_MAP_API_KEY
    const radius = 1200 // Define the radius in meters
    const types = 'restaurant|cafe|bank|hospital|entertainment' // Types of establishments you're interested in

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${types}&key=${apiKey}`

    try {
        const response = await axios.get(url)
        const placesData = response.data.results

        // If `placesData` is an array, apply reduce

        const countByType = placesData.reduce((acc, place) => {
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

const places = await getNearestPlaces()

console.log(places)
