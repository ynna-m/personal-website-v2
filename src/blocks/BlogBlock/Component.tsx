import React from 'react'
import type { BlogBlock as BlogBlockProps, Category, Post } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { format } from 'date-fns'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

export const BlogBlock: React.FC<BlogBlockProps>  = async (props) => {
    // const {size} = props
    const payload = await getPayload({config});
    const { numberOfPosts, category, sort, heading, customClassNames } = props;
    const categoryTyped = category as Category

    const {docs: posts} : {docs: Post[] | undefined | null} = await payload.find({
        collection:'posts',
        ...category && { 
            where: {
                categories: {
                    equals: categoryTyped?.id 
                }
            }
        },
        limit: numberOfPosts ?? 5,
        sort: sort  == "latest" ? "-publishedAt" : 'publishedAt',
        pagination: false,
        overrideAccess: false
    }) 
    return (
        <div className={`render-block posts-collection-latest-block ${customClassNames ?? ``}`}>
            <div className="posts-heading">
                {heading ?? "Posts"}
            </div>
            <div className="posts-collection-container" >
                <div className="posts-collection-inner-container">
                    {
                        posts.map((post, index)=>{
                            const plainTextContent = convertLexicalToPlaintext({data:post.content})
                            const contentTrim = plainTextContent.trim().split(/\s+/)
                            const content = contentTrim.length > 15 
                                ? contentTrim.slice(0, 15).join(' ') + '...'
                                : plainTextContent
                            // console.log("BlogBlock.tsx - posts content - ",content, contentTrim.length)
                            return(
                                <Link href={`/posts/${post.slug}`} className="read-more-link" key={index}>
                                    <div className={`post`} >
                                            <div className={`post-excerpt-container`}>
                                                <div className={`post-title`}>
                                                    {post.title}
                                                </div>
                                                <div className={`post-excerpt`}>
                                                    {content}
                                                </div>
                                            </div>
                                            <div className={`post-meta-container`}>
                                                <div className={`post-date`}>
                                                
                                                        {
                                                            post.publishedAt && format(new Date(post.publishedAt), "MM/dd/yyyy hh:mm:ssa")
                                                        }
                                                    
                                                </div>
                                                <div className={`post-origin-link`}>
                                                    {/* <Link href={`/posts/${post.slug}`} className="read-more-link"> */}
                                                        Read More
                                                    {/* </Link> */}
                                                </div>
                                            </div>
                                        
                                    </div>
                                </Link>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}