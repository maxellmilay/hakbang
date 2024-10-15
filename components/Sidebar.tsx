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
        <div>
            <Icon
                icon="material-symbols:view-sidebar-outline"
                className="w-[24px] h-[24px]"
            />
        </div>
    );
}

export default Sidebar;
