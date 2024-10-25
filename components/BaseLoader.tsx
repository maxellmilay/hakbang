'use client'
import React, { useState, useEffect } from 'react'

const BaseLoader = () => {
    const [showCursor, setShowCursor] = useState(false)
    const [startPolygonAnim, setStartPolygonAnim] = useState(true)

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev)
        }, 500)

        setStartPolygonAnim(true)

        return () => clearInterval(cursorInterval)
    }, [])

    return (
        <div className="min-h-screen w-full bg-yellow-500 flex items-center justify-center">
            <div className="inline-flex items-center bg-white border-2 border-black rounded-lg p-6 gap-4">
                <h1
                    className={`text-4xl font-bold animate-typing overflow-hidden whitespace-nowrap ${showCursor ? 'border-r-4 border-black' : ''}`}
                >
                    lakb
                </h1>
                <div className="relative w-14 h-14">
                    {/* Black border polygon */}
                    <div
                        className={`absolute inset-0 bg-black transform scale-[1.2] ${startPolygonAnim ? 'animate-polygon-build' : 'clip-path-initial'} z-10`}
                        style={{
                            clipPath: startPolygonAnim
                                ? 'polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)'
                                : 'polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%)',
                            transformOrigin: 'center center',
                        }}
                    ></div>
                    {/* Yellow polygon */}
                    <div
                        className={`absolute inset-0 bg-primary transform scale-[1.15] ${startPolygonAnim ? 'animate-polygon-build-delay-1' : 'clip-path-initial'} z-0`}
                        style={{
                            clipPath: startPolygonAnim
                                ? 'polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)'
                                : 'polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%)',
                            transformOrigin: 'center center',
                        }}
                    ></div>
                    {/* Content polygon with AI text */}
                    <div
                        className={`relative w-full h-full bg-primary flex items-end justify-center text-4xl font-bold ${startPolygonAnim ? 'animate-polygon-build-delay-2' : 'clip-path-initial'} pb-1 z-10`}
                        style={{
                            clipPath: startPolygonAnim
                                ? 'polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)'
                                : 'polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%)',
                            transformOrigin: 'center center',
                        }}
                    >
                        AI
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes typing {
                    from {
                        width: 0;
                    }
                    to {
                        width: 3.6ch;
                    }
                }

                @keyframes polygon-build {
                    0% {
                        clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%);
                        transform: scale(1);
                    }
                    30% {
                        clip-path: polygon(
                            50% 100%,
                            100% 100%,
                            100% 100%,
                            0% 100%,
                            0% 100%
                        );
                        transform: scale(1);
                    }
                    60% {
                        clip-path: polygon(
                            50% 0%,
                            100% 40%,
                            100% 100%,
                            0% 100%,
                            0% 40%
                        );
                        transform: scale(1);
                    }
                    100% {
                        clip-path: polygon(
                            50% 0%,
                            100% 40%,
                            100% 100%,
                            0% 100%,
                            0% 40%
                        );
                        transform: scale(1.25);
                    }
                }

                @keyframes polygon-build-inner {
                    0% {
                        clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%);
                        transform: scale(1.15);
                    }
                    30% {
                        clip-path: polygon(
                            50% 100%,
                            100% 100%,
                            100% 100%,
                            0% 100%,
                            0% 100%
                        );
                        transform: scale(1.15);
                    }
                    60% {
                        clip-path: polygon(
                            50% 0%,
                            100% 40%,
                            100% 100%,
                            0% 100%,
                            0% 40%
                        );
                        transform: scale(1.15);
                    }
                    100% {
                        clip-path: polygon(
                            50% 0%,
                            100% 40%,
                            100% 100%,
                            0% 100%,
                            0% 40%
                        );
                        transform: scale(1.15);
                    }
                }

                @keyframes polygon-build-content {
                    0% {
                        clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%);
                        transform: scale(1.1);
                    }
                    30% {
                        clip-path: polygon(
                            50% 100%,
                            100% 100%,
                            100% 100%,
                            0% 100%,
                            0% 100%
                        );
                        transform: scale(1.1);
                    }
                    60% {
                        clip-path: polygon(
                            50% 0%,
                            100% 40%,
                            100% 100%,
                            0% 100%,
                            0% 40%
                        );
                        transform: scale(1.1);
                    }
                    100% {
                        clip-path: polygon(
                            50% 0%,
                            100% 40%,
                            100% 100%,
                            0% 100%,
                            0% 40%
                        );
                        transform: scale(1.1);
                    }
                }

                .animate-typing {
                    animation: typing 0.7s steps(4);
                    width: 3.8ch;
                }

                .animate-polygon-build {
                    animation: polygon-build 1.6s cubic-bezier(0.4, 0, 0.2, 1)
                        forwards;
                }

                .animate-polygon-build-delay-1 {
                    animation: polygon-build-inner 1.6s
                        cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .animate-polygon-build-delay-2 {
                    animation: polygon-build-content 1.6s
                        cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .clip-path-initial {
                    clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%);
                }
            `}</style>
        </div>
    )
}

export default BaseLoader
