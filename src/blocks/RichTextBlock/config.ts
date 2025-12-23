import type { Block } from 'payload'
import { fullLexical } from '@/fields/fullLexical'

export const RichTextBlock: Block = {
    slug: 'richTextBlock',
    interfaceName: 'RichTextBlock',
    fields: [
        {
            name:'customClassNames',
            type:'text'
        },
        {
            name: 'richText',
            type: 'richText',
            editor: fullLexical
        },
    ],
}
