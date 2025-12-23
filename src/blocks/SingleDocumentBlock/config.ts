import type { Block } from 'payload'

export const SingleDocumentBlock: Block = {
    slug: 'singleDocumentBlock',
    interfaceName: 'SingleDocumentBlock',
    fields: [
        {
            name:'customClassNames',
            type:'text'
        },
        {
            name: 'collectionSource',
            type: 'select',
            defaultValue: 'posts',
            label: 'Collection to select Single Document from',
            options: [
                {
                    label: 'Posts',
                    value: 'posts',
                },
                {
                    label: 'Skills',
                    value: 'skills',
                },
                {
                    label: 'Portfolio',
                    value: 'portfolio',
                },
                {
                    label: 'Experiences',
                    value: 'experience',
                }
            ],
            required:true,
            hasMany:false
        },
        {
            name: 'selectPosts',
            type: 'relationship',
            relationTo: ['posts'],
            hasMany:false,
            admin:{
                condition: (_, siblingData) => siblingData.collectionSource === 'posts'
            },
            required:true
        },
        {
            name: 'selectSkills',
            type: 'relationship',
            relationTo: ['skills'],
            hasMany:false,
            admin:{
                condition: (_, siblingData) => siblingData.collectionSource === 'skills'
            },
            required:true
        },
        {
            name: 'selectExperience',
            type: 'relationship',
            relationTo: ['experience'],
            hasMany:false,
            admin:{
                condition: (_, siblingData) => siblingData.collectionSource === 'experience'
            },
            required:true
        },
        {
            name: 'selectPortfolio',
            type: 'relationship',
            relationTo: ['portfolio'],
            hasMany:false,
            admin:{
                condition: (_, siblingData) => siblingData.collectionSource === 'portfolio'
            },
            required:true
        },
        {
            name: 'headingEl',
            label: 'Title Heading Element (If applicable)',
            type: 'select',
            options: [
                {
                    value:'none',
                    label: 'None'
                },
                {
                    value:'h1',
                    label: 'h1'
                },
                {
                    value:'h2',
                    label: 'h2'
                },
                {
                    value:'h3',
                    label: 'h3'
                },
                {
                    value:'h4',
                    label: 'h4'
                },
                {
                    value:'h5',
                    label: 'h5'
                },
                {
                    value:'h6',
                    label: 'h6'
                }
            ],
            admin:{
                condition: (_, siblingData) => siblingData.collectionSource === 'experience' || siblingData.collectionSource === 'portfolio'
            },
        },
        {
            name: 'isTechStackEnabled',
            label: 'Enable Tech Stack?',
            type: 'checkbox',
            admin:{
                condition: (_, siblingData) => siblingData.collectionSource === 'experience' || siblingData.collectionSource === 'portfolio'
            },
        },
        {
            name: 'isImageEnabled',
            label: 'Enable Image? (If applicable)',
            type: 'checkbox',
        }
    ],
}