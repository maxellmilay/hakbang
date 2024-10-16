"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

import Sidebar from "@/components/Sidebar";
import AnnotationForm from "@/components/AnnotationForm";

function Page() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const isMobile = screenWidth < 768;
    const [expandSidebar, setExpandSidebar] = useState(!isMobile);
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showAnnotationForm, setShowAnnotationForm] = useState(false);
    const pickLocation = () => {
        setIsPickingLocation(true);
        setExpandSidebar(false);
        console.log("here", isPickingLocation);
    };
    const cancelPickLocation = () => {
        setIsPickingLocation(false);
        if (!isMobile) {
            setExpandSidebar(true);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div>
            <Sidebar
                expand={expandSidebar}
                setExpandSidebar={setExpandSidebar}
                pickLocation={pickLocation}
            />
            {!isPickingLocation ? (
                <button
                    onClick={pickLocation}
                    className="absolute right-3 bottom-3 flex items-center justify-center p-3 bg-primary border-2 border-black rounded-full transition-all duration-100 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Icon
                        icon="material-symbols:add-location-outline"
                        className="w-6 h-6"
                    />
                </button>
            ) : (
                <div className="flex p-6 absolute bottom-0 w-full justify-between items-center">
                    <div className="p-3 rounded-3xl bg-white border border-black shadow-lg">
                        10.298684, 123.898283
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={cancelPickLocation}
                            className="rounded-3xl p-3 bg-white shadow-lg hover:bg-slate-100 duration-100 ease-in-out"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setShowAnnotationForm(true)}
                            className="flex items-center justify-center p-3 bg-primary border-2 border-black rounded-full transition-all duration-100 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <Icon
                                icon="material-symbols:check"
                                className="w-6 h-6"
                            />
                        </button>
                    </div>
                </div>
            )}
            {showAnnotationForm && <AnnotationForm />}
        </div>
    );
}

export default Page;
