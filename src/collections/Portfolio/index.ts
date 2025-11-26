import { slugField, type CollectionConfig } from 'payload'


export const Portfolio: CollectionConfig = {
    slug:'portfolio',
    admin:{
        group:'Developer Collection',
        useAsTitle:'title',
        description:'Developer portfolio list collection'
    },
    fields:[
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name:'content',
            type:'richText'
        },
        {
            name:'image',
            type: 'upload',
            relationTo: 'media'
        },
        slugField()
    ]
}