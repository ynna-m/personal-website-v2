import type { Metadata } from 'next'


import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { Inter, Funnel_Sans as FunnelSans} from 'next/font/google'
import { PageLoaderProgress } from '@/components/PageLoaderProgress'
import { getPayload } from 'payload'
import config from '@payload-config'
import { UnderConstructionMode } from '@/components/UnderConstructionMode'

import { getMeUser } from '@/utilities/getMeUser'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
})
const funnelSans = FunnelSans({
    variable: '--font-funnel-sans',
    subsets: ['latin'],
})


export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const { isEnabled } = await draftMode()
    const payload = await getPayload({config});
    const siteSettings = await payload.findGlobal({
        slug: 'siteSettings',
        depth: 2, // To populate upload fields
    })
    const { general } = siteSettings
    const { user } = await getMeUser();
    // console.log("RootLayout - siteSettings", siteSettings);
    return (
        <html className={`${inter.variable} ${funnelSans.variable}`} lang="en" suppressHydrationWarning>
            <head>
                <InitTheme />
                <link href="/favicon.png" rel="icon" sizes="32x32" />
                <link href="/favicon.png" rel="icon" type="image/png" />
            </head>
            <body>
                <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID || ``} />
                {
                    (general?.isUnderConst && !user) && (
                        <UnderConstructionMode {...general} />
                    )
                }
                {
                    (!general?.isUnderConst || user)  && (
                        <Providers>
                            <PageLoaderProgress />
                            <AdminBar
                                adminBarProps={{
                                    preview: isEnabled,
                                }}
                            />

                            <Header />
                                {children}
                            <Footer />
                        </Providers>
                    )
                }
            </body>
        </html>
    )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
