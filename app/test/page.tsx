"use client";
import React from "react";
import { Icon } from "@iconify/react";

import Sidebar from "@/components/Sidebar";

function page() {
    return (
        <div>
            <Sidebar expand={true} />
            <button className="absolute right-3 bottom-3 flex items-center justify-center p-3 bg-primary border-2 border-black rounded-full transition-all duration-100 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <Icon
                    icon="material-symbols:add-location-outline"
                    className="w-6 h-6"
                />
            </button>
        </div>
    );
}

export default page;
