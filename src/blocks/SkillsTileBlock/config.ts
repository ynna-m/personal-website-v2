import { Block } from "payload";

export const SkillsTileBlock: Block = {
    slug:'skillsTileBlock',
    interfaceName:'SkillsTileBlock',
    fields:[
        {
            name:'customClassNames',
            type:'text'
        },
        {
            name: 'skills',
            type: 'relationship',
            relationTo: 'skills',
            hasMany:true
        },
    ]
}