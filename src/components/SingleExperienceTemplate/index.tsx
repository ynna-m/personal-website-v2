import type { Experience as ExperienceProps, Media as MediaType } from '@/payload-types'
import React from 'react'
import RichText from '../RichText'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { Media } from '../Media'
import { format } from 'date-fns'


type SingleExperienceTemplateProps = ExperienceProps & {
    isTechStackEnable?:boolean,
    isImageEnable?:boolean,
    headingEl?:('none' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') | null
}

export const SingleExperienceTemplate = (props:SingleExperienceTemplateProps) => {
    const {
        content,
        dateFrom,
        dateTo,
        title,
        image,
        current,
        isTechStackEnable,
        isImageEnable,
        techStack,
        headingEl
    } = props
    return (
        <div className="single-experience-template">
            {
                isImageEnable && (
                    <div className="experience-image">
                        {image && (<Media {...image as MediaType} />)}
                    </div>
                )
            }
            <div className="experience-title">
                {
                    headingEl === 'h1'
                    ? ( <h1>{title}</h1> )
                    : headingEl === 'h2'
                    ? ( <h2>{title}</h2> )
                    : headingEl === 'h3'
                    ? ( <h3>{title}</h3> )
                    : headingEl === 'h4'
                    ? ( <h4>{title}</h4> )
                    : headingEl === 'h5'
                    ? ( <h5>{title}</h5> )
                    : headingEl === 'h6'
                    ? ( <h6>{title}</h6> )
                    : ``
                }
                
            </div>
            <div className="experience-date-range">
                {
                    dateFrom 
                    && format(new Date(dateFrom),"MMM yyyy") 
                } - 
                { 
                    current 
                    ? ' now' 
                    : dateTo
                    ?  format(new Date(dateTo)," MMM yyyy") 
                    : ' undefined'
                }
            </div>
            <div className="experience-content">
                <RichText data={content as DefaultTypedEditorState} enableGutter={false} />
            </div>
            {
                isTechStackEnable && (
                    <div className="experience-tech-stack">
                        {
                            techStack?.map((tech, index)=>{
                                return (
                                    <div className="tech-tile" key={index}>
                                        {tech?.image && (<Media {...tech?.image as MediaType} />)}
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
            
        </div>
        
    )
}
