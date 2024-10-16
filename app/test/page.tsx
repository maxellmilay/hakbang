"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";

import Sidebar from "@/components/Sidebar";

function Page() {
    const [expandSidebar, setExpandSidebar] = useState(true);
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    const pickLocation = () => {
        setIsPickingLocation(true);
        setExpandSidebar(false);
        console.log("here", isPickingLocation);
    };
    return (
        <div>
            <Sidebar
                expand={expandSidebar}
                setExpandSidebar={setExpandSidebar}
                pickLocation={pickLocation}
            />
            <button
                onClick={pickLocation}
                className="absolute right-3 bottom-3 flex items-center justify-center p-3 bg-primary border-2 border-black rounded-full transition-all duration-100 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
            >
                <Icon
                    icon="material-symbols:add-location-outline"
                    className="w-6 h-6"
                />
            </button>
        </div>
    );
}

export default Page;
