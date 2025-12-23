import type { Block } from 'payload'

export const SkillsCloudBlock: Block = {
    slug: 'skillsCloudBlock',
    interfaceName: 'SkillsCloudBlock',
    fields: [
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
        {
            name:'width',
            type:'number'
        },
        {
            name:'height',
            type:'number'
        }
    ],
}