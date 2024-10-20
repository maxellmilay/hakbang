'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import useAuthStore from '@/store/auth'

export default function RouteChangeHandler() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { getUser } = useAuthStore()

    useEffect(() => {
        const handleRouteChange = () => {
            getUser()
        }

        handleRouteChange() // Run on initial load

        // This effect will run on every route change
    }, [pathname, searchParams, getUser])

    return null // This component doesn't render anything
}
