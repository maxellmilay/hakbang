'use client'
import React from 'react'
import Image from 'next/image'

const BaseLoader = () => {
    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center">
            <div
                className="inline-flex items-center bg-primary border-2 border-black rounded-lg p-6"
                style={{
                    animation:
                        'scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                }}
            >
                <div className="flex items-center gap-[0.2rem]">
                    <span
                        className="text-5xl font-medium font-inter"
                        style={{
                            animation: 'fadeInUp 0.6s ease-out forwards',
                            animationDelay: '0.2s',
                            opacity: 0,
                        }}
                    >
                        L
                    </span>
                    <div className="relative w-[38px] h-[38px]">
                        <Image
                            src="/Pedestrian.png"
                            alt="Pedestrian icon"
                            fill
                            priority
                            className="object-contain"
                            style={{
                                animation: 'fadeIn 0.6s ease-out forwards',
                                animationDelay: '0.4s',
                                opacity: 0,
                            }}
                        />
                    </div>
                    <span
                        className="text-5xl font-medium font-inter tracking-[0.2rem]"
                        style={{
                            animation: 'fadeInUp 0.6s ease-out forwards',
                            animationDelay: '0.6s',
                            opacity: 0,
                        }}
                    >
                        KBAI
                    </span>
                </div>
            </div>
            <style jsx>{`
                @keyframes scaleIn {
                    0% {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    0% {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}

export default BaseLoader