import React from 'react'

import type { CallToActionBtnsBlock as CallToActionBtnsBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBtnsBlock: React.FC<CallToActionBtnsBlockProps> = ({ customClassNames, buttons, richText }) => {
    const buttonClasses = {
        'primary-btn':'primary-button',
        'secondary-btn':'secondary-button',
        'tertiary-btn':'tertiary-button',
        'quartenary-btn':'quartenary-button',
        'disabled-btn':'disabled-button',
    }
    return (
        <div className={`call-to-action-btns-block-container ${customClassNames ?? ``}`}>
            <div className="container">
                <div className="call-to-action-btns-text">
                {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
                </div>
                <div className="call-to-action-btns-buttons">
                {(buttons || []).map(({ button }, i) => {
                    const { appearance } = button
                    return (
                        <CMSLink key={i} size="lg" {...button} className={`button ${appearance && buttonClasses?.[appearance]}`} />
                    )
                })}
                </div>
            </div>
        </div>
    )
}
