// import type { TextFieldSingleValidation } from 'payload'
// import {
//   BoldFeature,
//   ItalicFeature,
//   LinkFeature,
//   ParagraphFeature,
//   lexicalEditor,
//   UnderlineFeature,
//   type LinkFields,
// } from '@payloadcms/richtext-lexical'
import { 
    AlignFeature, 
    BlockquoteFeature, 
    BlocksFeature, 
    BoldFeature, 
    ChecklistFeature, 
    FixedToolbarFeature, 
    HeadingFeature, 
    HorizontalRuleFeature, 
    IndentFeature, 
    InlineCodeFeature, 
    InlineToolbarFeature, 
    ItalicFeature, 
    lexicalEditor, 
    LinkFeature, 
    OrderedListFeature, 
    ParagraphFeature, 
    StrikethroughFeature, 
    SubscriptFeature, 
    SuperscriptFeature, 
    UnderlineFeature, 
    UnorderedListFeature 
} from '@payloadcms/richtext-lexical'

import { Code } from '@/blocks/Code/config'
import { Banner } from '@/blocks/Banner/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'

export const fullLexical = lexicalEditor({
  features: ({rootFeatures})=>{
        return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
            BoldFeature(),
            ItalicFeature(),
            StrikethroughFeature(),
            UnderlineFeature(),
            SubscriptFeature(),
            SuperscriptFeature(),
            InlineCodeFeature(),
            ParagraphFeature(),
            AlignFeature(),
            IndentFeature(),
            UnorderedListFeature(),
            OrderedListFeature(),
            ChecklistFeature(),
            LinkFeature(),
            BlockquoteFeature(),
        ]
    },
})
