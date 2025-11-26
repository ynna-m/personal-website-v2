import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField, type CollectionConfig } from 'payload'


export const Skills: CollectionConfig = {
    slug:'skills',
    admin:{
        group:'Developer Collection',
        useAsTitle:'title',
        description:'Developer skills collection'
    },
    access:{
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },
    defaultSort:[
        'title'
    ],
    labels:{
        singular:'Skill',
        plural:'Skills'
    },
    fields:[
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name:'description',
            type:'textarea'
        },
        {
            name:'tooltip',
            type:'textarea'
        },
        {
            name:'image',
            type: 'upload',
            relationTo: 'media'
        },
       
        slugField()
    ]
}
//  {
//             name: 'categories',
//             type: 'relationship',
//             admin: {
//             position: 'sidebar',
//             },
//             hasMany: true,
//             relationTo: 'skills-categories',
//         },