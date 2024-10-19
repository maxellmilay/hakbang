import { MapComponent } from '@/components/Map'
import colonGeoJSONData from '@/data/geojson/colon.json'
import { MapProvider } from '@/providers/map-provider'

const Home = () => {
    return (
        <MapProvider>
            <MapComponent geojsonData={colonGeoJSONData} />
        </MapProvider>
    )
}

export default Home
