import React from 'react'
// import { SiteSettings as SiteSettingsProps } from "@/payload-types"
import RichText from '../RichText'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { cn } from '@/utilities/ui'
type SiteSettingsProps = {
    isUnderConst?:boolean | null,
    underConstTitle?:string | null,
    underConstMessage?:DefaultTypedEditorState | null,
    underConstBackgroundColor?:string | null
}
export const UnderConstructionMode  : React.FC<SiteSettingsProps> = (props) => {
    const {
        underConstTitle,
        underConstMessage,
        underConstBackgroundColor
    } = props
    // console.log("UnderConstructionMode.tsx - props",props)

    return (
        <div className={`fixed w-full h-full z-[9999] grid justify-center items-center 
            ${cn(`bg-primary-dark`, underConstBackgroundColor)}`}>
            {/* <Progress value={progress} className='absolute max-w-[72rem] place-self-center' /> */}
            <div className="under-construction-container absolute max-w-[72rem] place-self-center text-primary-yellow">
                <div className="under-construction-title text-center font-bold">
                    <h1>
                        {underConstTitle}
                    </h1>
                </div>
                <div className="under-construction-content">
                    {
                        underConstMessage && (<RichText data={underConstMessage} />)
                    }
                    
                </div>
            </div>
        </div>
    )
}