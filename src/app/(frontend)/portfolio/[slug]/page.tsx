import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post, Skill } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ThemeImage } from '@/components/ThemeImage'
import { format } from 'date-fns'
import { formatAuthors } from '@/utilities/formatAuthors'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { SkillsTileBlock } from '@/blocks/SkillsTileBlock/Component'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'portfolio',
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

export default async function Portfolio({ params: paramsPromise }: Args) {
    const { isEnabled: draft } = await draftMode()
    const { slug = '' } = await paramsPromise
    // Decode to support slugs with special characters
    const decodedSlug = decodeURIComponent(slug)
    const url = '/portfolio/' + decodedSlug
    const post = await queryPostBySlug({ slug: decodedSlug })

    if (!post) return <PayloadRedirects url={url} />
    console.log("portfolio-page - tech stack",post['tech-stack'])
    return (
        <article className="pt-16 pb-16 post">
            <PageClient />

            {/* Allows redirects for valid pages too */}
            <PayloadRedirects disableNotFound url={url} />

            {draft && <LivePreviewListener />}

            {/* <PostHero post={post} /> */}
            
            <div className="flex flex-col items-center gap-4 pt-8">
                <div className="container bg-primary-dark ">
                    <div className="back-to-portfolio-link mt-12">
                        <Link href={'/portfolio'}>← Back to Portfolio List</Link>
                    </div>
                    <div className="portfolio-hero-container">
                        <div className="portfolio-image mt-12">
                            <ThemeImage 
                            {
                                ...post?.image 
                                ? {resource:post.image}
                                : ''    
                            
                            }
                            />
                        </div>
                    
                        <div className="portfolio-title">
                            <h1 className='font-bold text-center'>{post.title}</h1>
                        </div>
                    </div>
                    <RichText className="max-w-[78rem] mx-auto" data={post.content as DefaultTypedEditorState} enableGutter={false} />
                    <div className="portfolio-tech-stack max-w-[60rem] mx-auto my-12">
                        <div className="title text-center font-bold"><h2>Tech Stack</h2></div>
                        {
                            <SkillsTileBlock skills={post['tech-stack']}  blockType='skillsTileBlock' />
                        }
                    </div>

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
    collection: 'portfolio',
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
