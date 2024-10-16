import React from "react";
import { Icon } from "@iconify/react";
import { Menu } from "@headlessui/react";

function SearchBar() {
    return (
        <div className="px-4 py-0 w-full flex items-center gap-3 rounded-3xl border border-black shadow-lg">
            <input
                type="text"
                placeholder="Search for a location"
                className="p-3 border-0 grow rounded-3xl focus:outline-none"
            />
            <button>
                <Icon
                    icon="material-symbols:mic-rounded"
                    className="w-5 h-5 text-slate-400"
                />
            </button>
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/en/c/c2/Ph_seal_cebucity.png"
                        alt="profile picture"
                        className="w-6 h-6 rounded-full"
                    />
                    {/* <ChevronDown className="ml-1 w-4 h-4" /> */}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-[190px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? "bg-slate-100" : ""
                                    } group flex w-full items-center gap-1 rounded-md py-2 px-4 text-sm duration-100`}
                                >
                                    <Icon
                                        icon="material-symbols:format-list-bulleted-rounded"
                                        className="w-4 h-4"
                                    />
                                    View all annotations
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? "bg-red-100" : ""
                                    } text-red-600 group flex w-full items-center gap-1 rounded-md py-2 px-4 text-sm duration-100`}
                                >
                                    <Icon
                                        icon="material-symbols:power-settings-new"
                                        className="w-4 h-4"
                                    />
                                    Log out
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Menu>
        </div>
    );
}

export default SearchBar;
