import type { Block } from 'payload'

export const BlogBlock: Block = {
    slug: 'blogBlock',
    interfaceName: 'BlogBlock',
    fields: [
        {
            name:"heading",
            type:"text"
        },
        {
            name:'numberOfPosts',
            type:'number',
            min:1,
            max:10,
            defaultValue: 5,
            admin:{
                step:1,
                description: "How many posts to show (1-10)"
            },
            validate: (value: number | undefined | null)=>{
                if (!value) return 'Please input a number'
                if (value > 10) return 'Maximum 10 posts allowed'
                if (value < 1) return 'At least 1 post required'
                return true
            }

        },
        {
            name:'category',
            type:'relationship',
            relationTo:'categories'
        },
        {
            name: 'sort',
            type: 'select',
            defaultValue: 'latest',
            options: [
                { label: 'Latest First', value: 'latest' },
                { label: 'Oldest First', value: 'oldest' },
            ],
        },
        {
            name:'customClassNames',
            type:'text'
        }
    ]
}
