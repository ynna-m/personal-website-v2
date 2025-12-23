import { Block } from "payload";

export const SocialMediaBlock: Block = {
    slug:'socialMediaBlock',
    interfaceName:'SocialMediaBlock',
    fields:[
        {
            name:'customClassNames',
            type:'text'
        },
        {
            name:"orientation",
            type:"select",
            options:[
                {
                    label:"Vertical",
                    value:"vertical"
                },
                {
                    label:"Horizontal",
                    value:"horizontal"
                }
            ]
        }
    ]
}