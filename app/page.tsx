import AppLayer from '@/components/AppLayer'
import Map from '@/components/map/Map'
import SidewalkSegments from '@/components/map/SidewalkSegments'

export default function Home() {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Map>
                    <SidewalkSegments />
                </Map>
            </div>
            <div className="relative z-10">
                <AppLayer />
            </div>
        </div>
    )
}
