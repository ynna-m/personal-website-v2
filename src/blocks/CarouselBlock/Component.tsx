import React from 'react'
import { CarouselBlock as CarouselBlockProps, Portfolio } from "@/payload-types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media } from '@/components/Media'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { ThemeImage } from '@/components/ThemeImage'

export const CarouselBlock = async (props: CarouselBlockProps) => {
    // console.log("CarouselBlock.tsx - props", props)
    const payload = await getPayload({config});
    const { collectionType, numberOfDocuments, sort, customClassNames } = props;
    const  {docs: documents} : {docs: Portfolio[]} = await payload.find({
        collection: collectionType,
        limit: numberOfDocuments ?? 5,
        sort: sort  == "latest" ? "-publishedAt" : 'publishedAt',
        pagination: false
    }) 
    
    // console.log("CarouselBlock.tsx - docs", documents)
    return (
        <div className={`render-block carousel-block ${customClassNames ?? ``}`}>
            <Carousel 
                opts={{
                    loop: true,
                }}
                className='carousel'
            >
                <CarouselContent className='carousel-content'>
                    {
                        documents?.map((doc, key) => {
                            // console.log("CarouselBlock.tsx - doc", doc)
                            const plainTextContent = doc?.content 
                                ? convertLexicalToPlaintext({data:doc.content})
                                : ""
                            const contentTrim = plainTextContent.trim().split(/\s+/)
                            const content = contentTrim.length > 15 
                                ? contentTrim.slice(0, 15).join(' ') + '...'
                                : plainTextContent
                            return (
                                <CarouselItem className='carousel-item' key={key}>
                                    <div className="document-container">
                                        <div className="document-image-container">
                                            {
                                                doc?.image 
                                                ? (<ThemeImage resource={doc.image} />)
                                                : (<ThemeImage />)
                                            }
                                            
                                            {/* <div className="document-image">
                                                {
                                                    doc?.image && (
                                                        <Media
                                                            // imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
                                                            resource = {doc?.image}
                                                        />
                                                    )
                                                }
                                            </div> */}
                                        </div>
                                        <div className="document-text-container">
                                            <div className="document-title">
                                                {doc?.title}
                                            </div>
                                            <div className="document-excerpt">
                                                {content}
                                            </div>
                                            <div className="document-read-more-link">
                                                <a href={`/${collectionType}/${doc?.slug}`} className="read-more">
                                                    Read More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </CarouselItem>
                            )
                        })
                    }
                    
                </CarouselContent>
                <CarouselPrevious className='carousel-button carousel-button-previous' />
                <CarouselNext className='carousel-button carousel-button-next' />
            </Carousel>
        </div>
    )
}