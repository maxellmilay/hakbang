import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.OPEN_WEATHER_API_KEY

async function getWeatherData(lat, lng) {
    try {
        // OpenWeatherMap API endpoint with coordinates
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`

        // Fetch weather data
        const response = await axios.get(url)
        const data = response.data
        const temperature = data.main.temp
        const humidity = data.main.humidity
        const precipitation = data.rain ? data.rain['1h'] : 0 // Precipitation in mm/hr

        // Calculate the heat index
        const heatIndex = calculateHeatIndex(temperature, humidity)

        // Categorize heat index and precipitation
        const heatIndexCategory = getHeatIndexCategory(heatIndex)
        const precipitationCategory = getPrecipitationCategory(precipitation)

        // Log results
        console.log(`Temperature: ${temperature}°C`)
        console.log(`Humidity: ${humidity}%`)
        console.log(`Heat Index: ${heatIndex.toFixed(2)}°C`)
        console.log(`Heat Index Category: ${heatIndexCategory}`)
        console.log(`Precipitation: ${precipitation} mm/hr`)
        console.log(`Precipitation Category: ${precipitationCategory}`)
    } catch (error) {
        console.error('Error fetching weather data:', error)
    }
}

// Function to calculate heat index using temperature and humidity
function calculateHeatIndex(T, RH) {
    // Heat Index formula from NOAA
    const HI =
        -42.379 +
        2.04901523 * T +
        10.14333127 * RH -
        0.22475541 * T * RH -
        0.00683783 * T * T -
        0.05481717 * RH * RH +
        0.00122874 * T * T * RH +
        0.00085282 * T * RH * RH -
        0.00000199 * T * T * RH * RH

    return HI
}

// Function to categorize heat index
function getHeatIndexCategory(heatIndex) {
    if (heatIndex < 27) return 'Hazardous'
    if (heatIndex >= 27 && heatIndex <= 32) return 'Caution'
    if (heatIndex >= 33 && heatIndex <= 41) return 'Extreme Caution'
    if (heatIndex >= 42 && heatIndex <= 51) return 'Danger'
    if (heatIndex >= 52) return 'Extreme Danger'
}

// Function to categorize precipitation
function getPrecipitationCategory(precipitation) {
    if (precipitation == 0) return 'No Rain'
    if (precipitation <= 2.5) return 'Light Rain'
    if (precipitation > 2.5 && precipitation <= 7.5) return 'Moderate Rain'
    if (precipitation > 7.5) return 'Heavy Rain'
    return 'No Rain'
}

const latitude = 10.327653161715238 // Example: Mandaue City Hall
const longitude = 123.94290770399293 // Example: Mandaue City Hall
getWeatherData(latitude, longitude)
