import { getPayload, Option, type Block } from 'payload'
import payload from 'payload'
import config from "@payload-config"


export const CarouselBlock: Block = {
    slug:'carouselBlock',
    interfaceName:'CarouselBlock',
    fields:[
        {
            name:"collectionType",
            type:"select",
            options:[
                {
                    label:"Posts",
                    value:"posts"
                },
                {
                    label:"Skills",
                    value:"skills"
                },
                {
                    label:"Experiences",
                    value:"experience"
                },
                {
                    label:"Portfolio",
                    value:"portfolio"
                }
            ],
            required:true
        },
        {
            name:"numberOfDocuments",
            type:"number",
            min:1,
            max:10,
            defaultValue:5,
            admin:{
                step:1,
                description: "How many documents to show (1-10)"
            },
            validate: (value: number | undefined | null)=>{
                if (!value) return 'Please input a number'
                if (value > 10) return 'Maximum 10 documentt allowed'
                if (value < 1) return 'At least 1 document required'
                return true
            }
        },
        {
            name:"customClassNames",
            type:"text"
        },
        {
            name: 'sort',
            type: 'select',
            defaultValue: 'latest',
            options: [
                { label: 'Latest First', value: 'latest' },
                { label: 'Oldest First', value: 'oldest' },
            ],
        }
    ]
}