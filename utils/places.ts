import axios from 'axios'

interface AddressComponent {
    long_name: string
    short_name: string
    types: string[]
}

export const getNearestStreet = async (lat: number, lng: number) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
    try {
        const response = await axios.get(geocodeUrl)
        if (response.data.results.length > 0) {
            const addressComponents =
                response.data.results[0].address_components

            // Filter for the street name (which has the 'route' type)
            const streetComponent = addressComponents.find(
                (component: AddressComponent) =>
                    component.types.includes('route')
            )

            if (streetComponent) {
                console.log(streetComponent.long_name) // This will be the street name
            } else {
                console.log('Street name not found', streetComponent.short_name)
            }
        } else {
            console.log('No address found')
        }
    } catch (error) {
        console.error('Error fetching the nearest street:', error)
    }
}
