import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import ParallaxImage from '@/components/ParallaxImage'
import { ImageMedia } from '@/components/Media/ImageMedia'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'portfolio',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })
const bgImage = {
    src:'/media/bg_halftone.png',
    size: "33vw",
    width: 2550,
    height: 3300
}
  return (
    <div className="pt-24 pb-24 relative bg-primary-dark-800">
      <PageClient />
      <div 
            className={`parallax-background absolute top-0 w-full h-full hidden col-start-1 lg:grid `}
        >
            <ParallaxImage 
                src={bgImage.src}  
                className='h-full w-full object-cover'
            />
        </div>
        <div className={`background-image absolute top-0 w-full h-full flex lg:hidden parallax-background`}>
            <ImageMedia src={bgImage} pictureClassName='h-full' imgClassName='h-full w-full object-cover'/>
        </div>
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center text-primary-dark font-bold">
          <h1 className="font-bold uppercase">Portfolio</h1>
        </div>
      </div>
      <CollectionArchive posts={posts.docs} relationTo='portfolio' />
      <div className="container text-primary-dark">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
      <div className="container mb-8 text-primary-dark text-center">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Ynna Maurer | Developer Portfolio Website Portfolio Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'portfolio',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
