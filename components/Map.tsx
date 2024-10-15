/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

import { heatmapData } from "@/constants/heatmap-data";
import { heatmapGradient } from "@/constants/heatmap-gradients";
import { defaultMapCenter, defaultMapZoom, defaultMapOptions } from "@/constants/map-properties";
//Map component Component from library
import { GoogleMap, HeatmapLayer } from "@react-google-maps/api";

//Map's styling
export const defaultMapContainerStyle = {
    width: '100vw',
    height: '100vh',
};

const MapComponent = () => {
    return (
        <div className="w-full">
          <GoogleMap
              mapContainerStyle={defaultMapContainerStyle}
              center={defaultMapCenter}
              zoom={defaultMapZoom}
              options={defaultMapOptions}>
                <HeatmapLayer 
                  data={heatmapData}
                  options={{
                    radius: 30,
                    opacity: 0.7,
                    gradient: heatmapGradient
                  }}
                />
          </GoogleMap>
        </div>
    )
};

export { MapComponent };