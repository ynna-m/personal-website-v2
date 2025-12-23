import type { Skill, SkillsTileBlock as SkillsTileBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import {
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const SkillsTileBlock: React.FC<SkillsTileBlockProps> = (props) => {
    // console.log("SkillsTileBlock.tsx - props", props)
    const {
        skills,
        customClassNames
    } = props
    const skillsFormat = skills as Skill[] | null
    // const images = skillsFormat?.map((skill)=>{
    //     return skill?.image
    // })
    // console.log("SkillsTileBlock.tsx - images", images)
    return (
        <div className={`render-block skills-tile-block ${customClassNames ?? ``}`}>
            <TooltipProvider>
            {
                skillsFormat?.map((skill,index)=>{
                    // console.log("SkillsTileBlock.tsx - image sizes", image?.sizes)
                    return (
                        <div 
                            className="skills-tile-container" 
                            key={index}
                        >
                            {
                                skill?.tooltip 
                                ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Media
                                                className='skills-tile'
                                                resource={skill.image}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{skill?.tooltip}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )
                                : (
                                    <Media
                                        className='skills-tile'
                                        resource={skill.image}
                                    />
                                )
                            }
                        </div>
                        
                    )
                })
            }
            </TooltipProvider>
        </div>
    )
}

// export default SkillsTileBlock