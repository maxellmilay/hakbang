'use client'

import { useState, useEffect } from 'react'

const useIOSDetection = () => {
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        const detectIOS = () => {
            const userAgent = window.navigator.userAgent.toLowerCase()
            const isIPad = /ipad/.test(userAgent)
            const isIPhone = /iphone/.test(userAgent)
            const isIPod = /ipod/.test(userAgent)
            const isMacOS =
                /macintosh/.test(userAgent) && navigator.maxTouchPoints > 0

            return isIPad || isIPhone || isIPod || isMacOS
        }

        setIsIOS(detectIOS())
    }, [])

    return isIOS
}

export default useIOSDetection
