import { Media as MediaType, SocialMedia, SocialMediaBlock as SocialMediaBlockProps } from "@/payload-types"
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media } from "@/components/Media"
import { InlineSvg } from "@/components/InlineSvg"
import React from "react"
import { getServerSideURL } from "@/utilities/getURL"
import { cn } from "@/utilities/ui"

const  getImageType = async ( path: string) => {
    const baseUrl = getServerSideURL()
    const imageUrl = baseUrl+path
    // console.log("SocialMediaBlock.tsx - getImageType imageUrl", serverURL,imageUrl)
    const response = await fetch(imageUrl); // HEAD = no body download
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('svg')) return 'svg';
    if (contentType?.startsWith('image/')) return 'raster';
    return 'unknown';
}
export const SocialMediaBlock:React.FC<SocialMediaBlockProps> = async (props) => {
    // console.log("SocialMediaBlock.tsx - props", props);
    const { 
        customClassNames,
        orientation
     } = props
     const payload = await getPayload({config});
     const socialMedia = await payload.findGlobal({
        slug: 'socialMedia',
        depth: 1,
    }) as SocialMedia
    // console.log("SocialMediaBlock.tsx - socialMedia", socialMedia);
    const socialMediaIconMap = socialMedia?.platforms 
        ? await Promise.all(socialMedia?.platforms?.map(async (platform)=>{
            const platformIconTyped = platform?.icon as MediaType
            const imageType = platformIconTyped?.url 
                ? await getImageType(platformIconTyped?.url)
                : null
            return {
                ...platform,
                imageType:imageType
            }
        })) 
        : []
    return (
        <div className={`render-block social-media-block  ${customClassNames ?? ``}`}>
            <h2 className={`social-media-block-title`}>Social Media</h2>
            <div className={`social-media-link-container ${cn(orientation == "vertical" && `lg:block`)} md:grid md:grid-cols-4`}>
                {
                    socialMediaIconMap?.map((platform, index)=>{
                        const platformIconTyped = platform.icon as MediaType
                        if(platform?.imageType == "raster"){
                            return (
                                <div className="social-media-tile-container" key={index}>
                                    <a className={`social-media-external-link`} href={platform.url} target="_blank" >
                                        <Media
                                            resource={platform.icon}
                                        />
                                    </a>
                                </div>
                                
                            )
                        }
                        else if(platform?.imageType == "svg"){
                            return (
                                <div className="social-media-tile-container" key={index}>
                                    <a className={`social-media-external-link`} href={platform.url} target="_blank" >
                                        <InlineSvg src={platformIconTyped?.url} />
                                    </a>
                                </div>
                                
                            )
                        }
                        else{
                            return(<React.Fragment key={index}></React.Fragment>)
                        }
                    })
                }
            </div>
            
        </div>
    )
}

// export default Component