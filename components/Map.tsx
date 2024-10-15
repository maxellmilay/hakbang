/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

import { defaultMapCenter, defaultMapZoom, defaultMapOptions } from "@/constants/map-properties";
//Map component Component from library
import { GoogleMap } from "@react-google-maps/api";

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
          </GoogleMap>
        </div>
    )
};

export { MapComponent };