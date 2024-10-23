import React from 'react'
import BaseLoader from './BaseLoader'

const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <BaseLoader />
        </div>
    )
}

export default FullScreenLoader
