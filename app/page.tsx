import AppLayer from "@/components/AppLayer";
import { MapComponent } from "@/components/Map";
import { colonGeoJSONData } from "@/data/colon";
import { MapProvider } from "@/providers/map-provider";

const Home = () => {

  return (
    <>
      <AppLayer/>
      <MapProvider> 
        <MapComponent geojsonData={colonGeoJSONData}/>
      </MapProvider>
    </>
  );
}

export default Home;