import { MapComponent } from "@/components/Map";
import { colonGeoJSONData } from "@/data/colon";
import { MapProvider } from "@/providers/map-provider";

export default function Home() {

  return (
    <MapProvider> 
      <MapComponent geojsonData={colonGeoJSONData}/>
    </MapProvider>
  );
}