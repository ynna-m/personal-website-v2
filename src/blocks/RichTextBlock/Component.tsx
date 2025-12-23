import React from 'react'
import type { RichTextBlock as RichTextBlockProps } from '@/payload-types'
import RichText from '@/components/RichText';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

export const RichTextBlock: React.FC<RichTextBlockProps> = (props) => {
    const {
        richText,
        customClassNames
    } = props
    const richTextTyped = richText as DefaultTypedEditorState
    return (
        <div
            className={`render-block rich-text-block ${customClassNames ?? ``}`}
        >
            <RichText 
                data={richTextTyped} 
                enableGutter={false}            
            />
        </div>
    )
}
