export const dynamic = 'force-dynamic'

import { MapComponent } from '@/components/Map'
import colonGeoJSONData from '@/data/geojson/mandaue.json'
import { MapProvider } from '@/providers/map-provider'

const Home = () => {
    return (
        <MapProvider>
            <MapComponent geojsonData={colonGeoJSONData} />
        </MapProvider>
    )
}

export default Home
