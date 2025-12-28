import { cn } from '@/utilities/ui'
import React from 'react'

import type { SectionBlock as SectionBlockProps, Media as MediaProps } from '@/payload-types'

import { RichTextBlock } from '../RichTextBlock/Component'
import { MediaBlock } from '../MediaBlock/Component'
import { BlogBlock } from '../BlogBlock/Component'
import { SkillsCloudBlock } from '../SkillsCloudBlock/Component'
import { CarouselBlock } from '../CarouselBlock/Component'
import { SkillsTileBlock } from '../SkillsTileBlock/Component'
import { SocialMediaBlock } from '../SocialMediaBlock/Component'
import { SkillsLayoutBlock } from '../SkillsLayoutBlock/Component'
import { CustomFormType, FormBlock } from '../Form/Component'
import { SingleDocumentBlock } from '../SingleDocumentBlock/Component'
import ParallaxImage from '@/components/ParallaxImage'
import { Media } from '@/components/Media'


export const SectionBlock: React.FC<SectionBlockProps> = async (props) => {
    const { columns, customClassNames, enableParallax, parallaxOrientation, bgImage, parallaxScale, enableParallaxOver, parallaxOverlay } = props

    const colsSpanClasses = {
        full: '12',
        elevenTwelfths:'11',
        tenTwelfths:'10',
        nineTwelfths:'9',
        twoThirds: '8',
        sevenTwelfths:'7',
        half: '6',
        fiveTwelfths:'5',
        oneThird: '4',
        threeTwelfths:'3',
        twoTwelfths:'2',
        oneTwelfth:'1',
    }

    // console.log("SectionBlock.tsx - props", props)
    const parallaxOverlayClass = `after:content-[''] after:w-full after:h-full after:z-20 
    after:col-start-1 after:row-start-1 after:bg-dynamic`
    // const parallaxOverlayClass = ``
    const backgroundImage = bgImage as MediaProps 
    return (
        <div className={`section-block ${cn((enableParallax || backgroundImage?.url) && `relative`)} ${customClassNames ?? ``}`}>
            {
                enableParallax && backgroundImage?.url && (
                    <div 
                        className={`parallax-background absolute top-0 w-full h-full hidden col-start-1 lg:grid ${cn((enableParallax && enableParallaxOver) && parallaxOverlayClass)}`}
                        style={{
                            // Only apply if overlay is enabled and color exists
                            ...(enableParallaxOver && parallaxOverlay && {
                            '--dynamic-overlay': parallaxOverlay,  // e.g., "rgba(0,0,0,0.4)" or "#00000080"
                            }),
                        } as React.CSSProperties}
                    >
                        <ParallaxImage 
                            src={backgroundImage.url}  
                            {...parallaxOrientation && {orientation:parallaxOrientation}}
                            {...parallaxScale && {scale:parallaxScale}}
                        />
                    </div>
                )
            }
            {
                backgroundImage?.url && ( 
                    <div className={`background-image absolute top-0 w-full h-full flex ${cn((enableParallax && enableParallaxOver) && parallaxOverlayClass, enableParallax && `lg:hidden parallax-background`)}`}>
                        <Media resource={backgroundImage} pictureClassName='h-full' imgClassName='h-full object-cover'/>
                    </div>
                )
            }
            <div className={`container z-30 ${cn((enableParallax || backgroundImage?.url) && `relative`)}`}>
                {/* <div>Section Block PV</div> */}
                {columns &&
                columns.length > 0 &&
                columns.map((col, index) => {
                    const { blocks, size, customClassNames:colClassNames } = col
                    
                    // console.log("SectionBlock.tsx - blocks", blocks)
                    return (
                        <div className={`section-column ${cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                                                'col-span-12': size !== 'full',
                                })} ${colClassNames ?? ``}`} key={index} >
                                
                            
                            {
                                blocks?.map((block, key)=>{
                                    // console.log("SectionBlock.tsx - blockMap",block)
                                    return(
                                        <React.Fragment key={key}>
                                        
                                        {
                                            block.blockType == "richTextBlock" && (
                                                <div className={`rich-text-block-container`} key={key}>
                                                    <RichTextBlock {...block}/>
                                                </div>
                                                
                                            )
                                        }
                                        {
                                            block.blockType == "mediaBlock"  && (
                                                <div className={`media-block-container`} key={key}>
                                                    <MediaBlock {...block} className={`section-media-block`} enableGutter={true} />
                                                </div>
                                            )
                                        }
                                        {
                                            block.blockType == "blogBlock"  && (
                                                <div className={`blog-block-container`} key={key}>
                                                    <BlogBlock  {...block} />
                                                </div>
                                            )
                                        }
                                        {
                                            block.blockType == "skillsCloudBlock"  && (
                                                <div className={`skills-cloud-block-container`} key={key}>
                                                    <SkillsCloudBlock  {...block}/>
                                                </div>
                                            )
                                        }
                                        {
                                            block.blockType == "carouselBlock"  && (
                                                <div className={`carousel-block-container`} key={key}>
                                                    <CarouselBlock  {...block}   />
                                                </div>
                                            )
                                        }
                                        {
                                            block.blockType == "skillsTileBlock"  && (
                                                <div className={`skills-tile-block-container`} key={key}>
                                                    <SkillsTileBlock  {...block}  />
                                                </div>
                                            )
                                        }
                                        {
                                            block.blockType == "socialMediaBlock"  && (
                                                <div className={`social-media-block-container`} key={key}>
                                                    <SocialMediaBlock  {...block}  />
                                                </div>
                                            )
                                        }
                                        {
                                            block.blockType == "skillsLayoutBlock"  && (
                                                <div className={`skills-layout-block-container`} key={key}>
                                                    <SkillsLayoutBlock  {...block} />
                                                </div>
                                            )
                                        }
                                        {
                                            block.blockType == "formBlock"  && (
                                                <div className={`form-block-container`} key={key}>
                                                    {
                                                        block?.form 
                                                            && typeof block?.form != "number" 
                                                            && (
                                                                <FormBlock enableIntro={false} form={block.form as unknown as CustomFormType } />
                                                            )
                                                    }
                                                </div>
                                            )
                                        }
                                        {
                                            block.blockType == "singleDocumentBlock"  && (
                                                <div className={`single-document-block-container`} key={key}>
                                                    <SingleDocumentBlock  {...block} />
                                                </div>
                                            )
                                        }
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
