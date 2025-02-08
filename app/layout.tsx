import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.scss'
import RouteChangeHandler from '@/components/RouteChangeHandler'
import { Suspense } from 'react'
import FullScreenLoader from '@/components/FullScreenLoader'
import { Analytics } from '@vercel/analytics/react'

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
})

const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
})

export const metadata: Metadata = {
    title: 'Lakbai',
    description:
        'Interactive dashboard for a Dynamic Pedestrian Accessibility Index using Fuzzy Logic Systems and Real Time Data for Sustainable and Inclusive Urban Mobility in the Philippines',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Suspense fallback={<FullScreenLoader />}>
                    <RouteChangeHandler />
                    {children}
                </Suspense>
                <Analytics />
            </body>
        </html>
    )
}
