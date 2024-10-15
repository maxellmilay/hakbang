"use client";

import React from "react";
import { Icon } from "@iconify/react";

interface PropsInterface {
    expand: boolean;
}

function Sidebar(props: PropsInterface) {
    const { expand } = props;
    console.log(expand);
    return (
        <nav className="w-[320px] h-[calc(100vh-24px)] rounded-md border-2 border-black absolute m-3 p-3 flex flex-col gap-2">
            <div className="flex gap-6 p-3 items-center">
                <button>
                    <Icon
                        icon="material-symbols:view-sidebar-outline"
                        className="w-8 h-8"
                    />
                </button>
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold">Lakb.</h1>
                    <div className="font-bold text-2xl flex w-9 h-9 bg-primary border-2 border-black rounded-md  justify-center items-center">
                        AI
                    </div>
                </div>
            </div>
            <button className="flex gap-3 p-3 items-center rounded-md border-2 border-black bg-primary hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-none">
                <Icon
                    icon="material-symbols:add-location-outline"
                    className="w-6 h-6"
                />
                <p className="font-medium">Add annotation</p>
            </button>
        </nav>
    );
}

export default Sidebar;
