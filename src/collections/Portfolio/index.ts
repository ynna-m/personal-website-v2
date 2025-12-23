import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField, type CollectionConfig } from 'payload'
import { revalidateDelete, revalidatePortfolio } from './hooks/revalidatePortfolio'
import { fullLexical } from '@/fields/fullLexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Portfolio: CollectionConfig = {
    slug:'portfolio',
    admin:{
        group:'Developer Collection',
        useAsTitle:'title',
        description:'Developer portfolio list collection'
    },
    access:{
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },
    labels:{
        singular:'Portfolio',
        plural:'Portfolio'
    },
    fields:[
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            type:'tabs',
            tabs:[
                {
                    label:'Content',
                    fields:[
                        {
                            name:'image',
                            type: 'upload',
                            relationTo: 'media'
                        },
                        {
                            name:'content',
                            type:'richText',
                            editor: fullLexical,
                        },
                        {
                            name: 'tech-stack',
                            type: 'relationship',
                            hasMany: true,
                            relationTo: 'skills',
                        },
                    ]
                },
                {
                    name:'meta',
                    label:'SEO',
                    fields:[
                        OverviewField({
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                            imagePath: 'meta.image',
                        }),
                        MetaTitleField({
                            hasGenerateFn: true,
                        }),
                        MetaImageField({
                            relationTo: 'media',
                        }),
            
                        MetaDescriptionField({}),
                        PreviewField({
                            // if the `generateUrl` function is configured
                            hasGenerateFn: true,
            
                            // field paths to match the target field for data
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                        }),
                    ]
                }
            ]
        },
        
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                date: {
                pickerAppearance: 'dayAndTime',
                },
                position: 'sidebar',
            },
            hooks: {
                beforeChange: [
                ({ siblingData, value }) => {
                    if (siblingData._status === 'published' && !value) {
                    return new Date()
                    }
                    return value
                },
                ],
            },
        },
        slugField()
    ],
    versions: {
        drafts: {
            autosave: {
                interval: 100, // We set this interval for optimal live preview
            },
            schedulePublish: true,
        },
        maxPerDoc: 50,
    },
    hooks: {
        afterChange: [revalidatePortfolio],
        afterDelete: [revalidateDelete],
    },
    timestamps:true
}