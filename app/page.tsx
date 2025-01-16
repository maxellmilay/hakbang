export const dynamic = 'force-dynamic'

import { MapComponent } from '@/components/Map'
import mandaueGeoJSONData from '@/data/geojson/mandaue.json'
import { MapProvider } from '@/providers/map-provider'

const Home = () => {
    return (
        <MapProvider>
            <MapComponent geojsonData={mandaueGeoJSONData} />
        </MapProvider>
    )
}

export default Home
