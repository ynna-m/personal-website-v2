import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import ParallaxImage from '@/components/ParallaxImage'
import { ImageMedia } from '@/components/Media/ImageMedia'

export const dynamic = 'force-dynamic'
export const revalidate = 600
const bgImage = {
    src:'/media/bg_halftone_yellowv3.png',
    size: "33vw",
    width: 2550,
    height: 3300
}
export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    
  })

  return (
    <div className="pt-24 pb-24 blog relative bg-primary-dark-800">
      <PageClient />
      <div 
            className={`parallax-background absolute top-0 w-full h-full hidden col-start-1 lg:grid `}
        >
            <ParallaxImage 
                src={bgImage.src}  
                className='h-full object-cover w-full'
                scale={1.2}
            />
        </div>
        <div className={`background-image absolute top-0 w-full h-full flex lg:hidden parallax-background`}>
            <ImageMedia src={bgImage} pictureClassName='h-full' imgClassName='h-full w-full object-cover'/>
        </div>
      <div className="container relative z-10  mb-16 bg-[#18181abd]">
        <div className="prose dark:prose-invert max-w-none text-center text-primary-yellow font-bold">
          <h1 className="font-bold uppercase">Blog</h1>
        </div>
      </div>
      <CollectionArchive posts={posts.docs} />
      <div className="container relative z-10  text-tertiary-gray-500 ">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
      <div className="container relative z-10 mb-8 text-tertiary-gray-500 text-center bg-[#18181abd]">
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

export function generateMetadata(): Metadata {
  return {
    title: `Ynna Maurer | Developer Portfolio Website Blog Page`,
  }
}
