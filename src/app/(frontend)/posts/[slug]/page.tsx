import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ThemeImage } from '@/components/ThemeImage'
import { format } from 'date-fns'
import { formatAuthors } from '@/utilities/formatAuthors'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16 bg-primary-dark-800 post">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* <PostHero post={post} /> */}
    
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container bg-primary-dark ">
            <div className="back-to-portfolio-link mt-12">
                <Link href={'/posts/'}>← Back to Blog</Link>
            </div>
            <div className="post-hero-container">
                <div className="post-image mt-12">
                    <ThemeImage 
                    {
                        ...post?.heroImage 
                        ? {resource:post.heroImage}
                        : post?.meta?.image
                        ? {resource:post?.meta?.image}
                        : ''    
                    
                    }
                        styling='style2'
                    />
                </div>
            
                <div className="post-title">
                    <h1 className='font-bold text-center'>{post.title}</h1>
                </div>
                <div className="post-meta grid mx-auto max-w-[78rem] my-4 lg:grid-cols-3 lg:grid-rows-2 grid-rows-3 justify-center">
                    <div className="post-categories row-start-1 col-span-3 grid gap-1 place-content-center grid-flow-col">
                        {
                            post?.categories 
                            && post.categories?.map((category, index) => {
                                if (typeof category === 'object') {
                                    const { title: titleFromCategory } = category

                                    const categoryTitle = titleFromCategory || 'Untitled category'



                                    return (
                                        <div className={`bg-primary-dark-gray px-4 py-1 rounded-xl`} key={index}>
                                            {categoryTitle}
                                        </div>
                                    )
                                }

                                return null
                            })
                        }
                    </div>
                    <div className="post-publishedat lg:col-start-1 lg:row-start-2 row-start-2 lg:place-self-start place-self-center  text-tertiary-gray-400">{post?.publishedAt && format(new Date(post.publishedAt), "MM/dd/yyyy hh:mm:ssa")}</div>
                    <div className="post-author lg:col-start-3 lg:row-start-2 row-start-3 lg:place-self-end place-self-center text-tertiary-gray-400">{post?.populatedAuthors && formatAuthors(post?.populatedAuthors)}</div>
                        
                </div>
            </div>
            <RichText className="max-w-[78rem] mx-auto" data={post.content} enableGutter={false} />
            {post.relatedPosts && post.relatedPosts.length > 0 && (
                <RelatedPosts
                className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                docs={post.relatedPosts.filter((post) => typeof post === 'object')}
                />
            )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
