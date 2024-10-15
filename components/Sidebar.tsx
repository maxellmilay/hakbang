"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface PropsInterface {
    expand: boolean;
}

function Sidebar(props: PropsInterface) {
    const { expand = true } = props;
    const [showSideBar, setShowSideBar] = useState(expand);

    useEffect(() => {
        setShowSideBar(expand);
    }, [expand]);

    const data = [
        {
            date: "Today",
            annotations: [
                {
                    level: 4,
                    name: "T Padilla St, Gaisano Saversmart",
                },
                {
                    level: 5,
                    name: "Lopez Jaena St, Upper Malibu",
                },
                {
                    level: 2,
                    name: "Hernan Cortes St, Jullie's Bakeshop & Restaurant",
                },
                {
                    level: 3,
                    name: "T Padilla St, Gaisano Saversmart side bridge",
                },
            ],
        },
        {
            date: "October 13, 2024",
            annotations: [
                {
                    level: 1,
                    name: "T Padilla St corner Lopez Jaena St",
                },
                {
                    level: 3,
                    name: "Mabolo St, Mabolo Church",
                },
                {
                    level: 2,
                    name: "Banilad Rd, Gaisano Country Mall",
                },
                {
                    level: 4,
                    name: "Mango Ave, Robinsons Cybergate",
                },
                {
                    level: 5,
                    name: "Colon St, Metro Colon",
                },
                {
                    level: 3,
                    name: "Osmeña Blvd, Fuente Osmeña Circle",
                },
                {
                    level: 2,
                    name: "Ayala Center Cebu, The Terraces",
                },
                {
                    level: 5,
                    name: "Colon St, Metro Colon",
                },
                {
                    level: 3,
                    name: "Osmeña Blvd, Fuente Osmeña Circle",
                },
            ],
        },
    ];

    return (
        <div>
            <div className="z-10 top-[26px] left-[26px] absolute flex gap-6 p-3 items-center">
                <button onClick={() => setShowSideBar(!showSideBar)}>
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
            <nav
                className={`z-0 bg-white w-[320px] h-[calc(100vh-24px)] rounded-md border-2 border-black absolute m-3 p-3 flex flex-col gap-2 transition-transform duration-300 ease-in-out ${
                    showSideBar
                        ? "translate-x-0"
                        : "-translate-x-[calc(100%+1rem)]"
                }`}
            >
                {/* ignore this, do not remove */}
                <div className="bg-level-1 bg-level-2 bg-level-3 bg-level-4 bg-level-5 hidden"></div>

                <div className="h-[60px]"></div>
                <button className="flex gap-3 p-3 items-center rounded-md border-2 border-black bg-primary transition-all duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]">
                    <Icon
                        icon="material-symbols:add-location-outline"
                        className="w-6 h-6"
                    />
                    <p className="font-medium">Add annotation</p>
                </button>
                <div className="flex flex-col gap-6">
                    {data.map((set, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <div className="p-2">
                                <p className="font-medium text-slate-600">
                                    {set.date}
                                </p>
                            </div>
                            {set.annotations.map((annotation, index) => (
                                <button
                                    key={index}
                                    className="rounded-md border border-transparent p-2 flex gap-2 items-center w-full hover:bg-primary-light hover:border hover:border-primary transition-all duration-200 ease-in-out"
                                >
                                    <div
                                        className={`rounded-md w-6 h-6 border-2 border-black bg-level-${annotation.level}`}
                                    ></div>
                                    <p className="truncate max-w-[230px]">
                                        {annotation.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
                <button className="text-slate-600">View all annotations</button>
            </nav>
        </div>
    );
}

export default Sidebar;
