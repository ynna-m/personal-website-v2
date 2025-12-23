'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Portfolio, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { ImageMedia } from '../Media/ImageMedia'
import { format } from 'date-fns'
import { ThemeImage } from '../ThemeImage'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

// const placeholderSrc = 
const placeholder = {
    src:'/media/No_Image_Available.jpg',
    size: "33vw",
    width: 547,
    height: 547
}

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedAt'>
export type CardPortfolioData = Pick<Portfolio, 'slug' | 'title' | 'content' | 'image'>



export const CardPost: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  showCategories?: boolean
  title?: string
}> = (props) => {
    const { card, link } = useClickableCard({})
    const { className, doc, showCategories, title: titleFromProps } = props

    const { slug, categories, meta, title, publishedAt } = doc || {}
    const { description, image: metaImage } = meta || {}
        
    const hasCategories = categories && Array.isArray(categories) && categories.length > 0
    const titleToUse = titleFromProps || title
    const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
    const href = `/posts/${slug}`

    return (
        <article
            className={`card ${cn(
                'overflow-hidden bg-card hover:cursor-pointer px-20 py-12 bg-primary-dark text-tertiary-white text-center',
                className,
            )}`}
            ref={card.ref}
        >
            <div className="relative w-full mb-12 ">
                {!metaImage 
                    && <ThemeImage styling='style2'/>
                }
                {metaImage && typeof metaImage !== 'string'  
                    && <ThemeImage resource={metaImage} styling='style2'/>
                }   
            </div>
            <div className="p-4">
                {showCategories && hasCategories && (
                <div className="categories uppercase text-sm mb-4 grid gap-1 place-content-center grid-flow-col">
                    {showCategories && hasCategories && (
                        categories?.map((category, index) => {
                        if (typeof category === 'object') {
                            const { title: titleFromCategory } = category

                            const categoryTitle = titleFromCategory || 'Untitled category'
                            const categoryLink = `/categories/${category.slug}`


                            return (
                                <Link href={categoryLink} className={`bg-primary-dark-gray text-tertiary-white px-4 py-1 rounded-xl`} key={index}>
                                    {categoryTitle}
                                </Link>
                            )
                        }

                        return null
                        })
                    )}
                </div>
                )}
                {titleToUse && (
                <div className="text-primary-yellow font-bold">
                    <h3>
                    <Link className="not-prose" href={href} ref={link.ref}>
                        {titleToUse}
                    </Link>
                    </h3>
                </div>
                )}
                {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
                <div className="meta-container grid lg:grid-cols-3 pt-4">
                    <div className="date-time lg:col-start-1 lg:place-self-start text-tertiary-gray-400">
                        {publishedAt && format(new Date(publishedAt), "MM/dd/yyyy hh:mm:ssa")}
                    </div>
                    <div className="read-more-link lg:col-start-4 text-primary-yellow">
                        <Link href={href} ref={link.ref}>
                            Read More
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}
export const CardPortfolio: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPortfolioData
  showCategories?: boolean
  title?: string
}> = (props) => {
    const { card, link } = useClickableCard({})
    const { className, doc, showCategories, title: titleFromProps } = props

    const { slug, content, title, image } = doc || {}
        
    const titleToUse = titleFromProps || title
    const plainTextContent = convertLexicalToPlaintext({data:content as DefaultTypedEditorState})
    const contentTrim = plainTextContent.trim().split(/\s+/)
    const sanitizedDescription = contentTrim.length > 15 
        ? contentTrim.slice(0, 15).join(' ') + '...'
        : plainTextContent
    // const sanitizedDescription = content?.replace(/\s/g, ' ') // replace non-breaking space with white space
    const href = `/portfolio/${slug}`

    return (
        <article
            className={`card ${cn(
                'overflow-hidden bg-card hover:cursor-pointer px-20 py-12 bg-primary-dark text-tertiary-white text-center',
                className,
            )}`}
            ref={card.ref}
        >
            <div className="relative w-full mb-12 ">
                {!image 
                    && <ThemeImage />
                }
                {image && typeof image !== 'string'  
                    && <ThemeImage resource={image} />
                }   
            </div>
            <div className="p-4">
                {titleToUse && (
                <div className="text-primary-yellow font-bold">
                    <h3>
                    <Link className="not-prose" href={href} ref={link.ref}>
                        {titleToUse}
                    </Link>
                    </h3>
                </div>
                )}
                {content && <div className="mt-2">{content && <p>{sanitizedDescription}</p>}</div>}
                <div className="meta-container grid grid-cols-3 pt-4">
                    <div className="read-more-link col-start-2 place-self-center text-primary-yellow">
                        <Link href={href} ref={link.ref}>
                            Read More
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}

const components = {
  posts: CardPost,
  portfolio: CardPortfolio,
} as const;

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPortfolioData
  relationTo?: 'posts'|'portfolio'
  showCategories?: boolean
  title?: string
}>  = (props) =>{
    const {relationTo} = props
    const Component = relationTo && components[relationTo]
    if(!Component) return (<div>Rendering Error</div>)
    return (
        <Component {...props} />
    )
}