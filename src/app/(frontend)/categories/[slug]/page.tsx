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
type Args = {
  params: Promise<{
    slug?: string
  }>
}
const bgImage = {
    src:'/media/bg_halftone_yellowv3.png',
    size: "33vw",
    width: 2550,
    height: 3300
}
export default async function Page({ params: paramsPromise }: Args) {
const { slug = '' } = await paramsPromise
const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config: configPromise })
    const categories = await payload.find({
        collection:'categories',
        depth:1,
        limit:12,
        overrideAccess:false,
        where:{
            slug:{
                equals:decodedSlug
            }
        }
    })
  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 12,
    where:{
        categories:{
           equals:categories?.docs?.[0].id
        }
    },
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
      <div className="container relative z-10 mb-16 bg-[#18181abd]">
        <div className="prose dark:prose-invert max-w-none text-center text-primary-yellow font-bold">
          <h1 className="font-bold uppercase">Blog Categories</h1>
          <h2 className="font-bold uppercase">{categories?.docs?.[0].title}</h2>
        </div>
      </div>
      <CollectionArchive posts={posts.docs} />
      <div className="container relative z-10 text-tertiary-gray-500 ">
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
    const { slug } = await paramsPromise
    const decodedSlug = slug && decodeURIComponent(slug)
    const payload = await getPayload({ config: configPromise })
    const categories = decodedSlug && await payload.find({
        collection:'categories',
        depth:1,
        limit:12,
        overrideAccess:false,
        where:{
            slug:{
                equals:decodedSlug
            }
        }
    })
    const categoryTitle = categories && categories?.docs?.[0].title
  return {
    title: `Ynna Maurer | Developer Portfolio Website ${categoryTitle ? categoryTitle : slug ? slug?.charAt(0).toUpperCase() + slug?.slice(1) : ''} Category`,
  }
}
