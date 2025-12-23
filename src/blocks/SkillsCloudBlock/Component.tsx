import React from 'react'
import type { Media, Skill, SkillsCloudBlock as SkillsCloudBlockProps } from '@/payload-types'
import { IconCloud } from '@/components/ui/icon-cloud'



export const SkillsCloudBlock: React.FC<SkillsCloudBlockProps> = async (props) => {
    console.log("SkillsCloudBlock.tsx - props",props)
    const { skills, customClassNames, width, height } = props
    const skillsFormat = skills as Skill[] | null
    const images = skillsFormat?.map((skill)=>{
        const skillImage = skill?.image as Media
        return skillImage?.url ?? "/public/No_Image_Available.jpg"
    })
    return (
        <div
            className={`render-block skills-cloud-block ${customClassNames ?? ``}`}
        >
            <IconCloud 
                images={images} 
                {...width!=null && {width:width}} 
                {...height!=null && {height:height}} 
            />
        </div>
    )
}
