'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Menu } from '@headlessui/react'

import useAuthStore from '@/store/auth'

interface PropsInterface {
    isMobile: boolean
}

function SearchBar(props: PropsInterface) {
    const { user, logout } = useAuthStore()

    const { isMobile } = props
    const [showFullSearchBar, setShowFullSearchBar] = useState(true)
    const fullSearchBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setShowFullSearchBar(!isMobile)
        console.log(isMobile, 'ismobile')
    }, [isMobile])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                fullSearchBarRef.current &&
                !fullSearchBarRef.current?.contains(event.target as Node) &&
                isMobile
            ) {
                setShowFullSearchBar(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMobile])

    if (showFullSearchBar)
        return (
            <div
                ref={fullSearchBarRef}
                className="pointer-events-auto absolute bg-white z-30 top-8 left-3 right-3 sm:left-auto sm:w-[400px] md:w-[450px] lg:w-[500px] px-2 flex items-center gap-3 rounded-3xl border border-black shadow-lg"
            >
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
                {user ? (
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="flex items-center mr-2">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/en/c/c2/Ph_seal_cebucity.png"
                                alt="profile picture"
                                className="w-6 h-6 rounded-full"
                            />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-[190px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ? 'bg-slate-100' : ''
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
                                            onClick={logout}
                                            className={`${
                                                active ? 'bg-red-100' : ''
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
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center bg-primary rounded-3xl border border-black h-full px-3 py-1"
                    >
                        Log in
                    </Link>
                )}
            </div>
        )
    else
        return (
            <div className="pointer-events-auto absolute z-30 top-8 right-3 px-2 py-3 flex items-center justify-end gap-3">
                <button onClick={() => setShowFullSearchBar(true)}>
                    <Icon icon="material-symbols:search" className="w-6 h-6" />
                </button>
                {user ? (
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="flex items-center mr-2">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/en/c/c2/Ph_seal_cebucity.png"
                                alt="profile picture"
                                className="w-6 h-6 rounded-full"
                            />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-[190px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ? 'bg-slate-100' : ''
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
                                            onClick={logout}
                                            className={`${
                                                active ? 'bg-red-100' : ''
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
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center bg-primary rounded-3xl border border-black h-full px-3 py-1"
                    >
                        Log in
                    </Link>
                )}
            </div>
        )
}

export default SearchBar
