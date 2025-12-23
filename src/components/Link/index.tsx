import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post, Experience, Portfolio } from '@/payload-types'

type CMSLinkType = {
    appearance?: 'inline' | ButtonProps['variant'] | ('primary-btn' | 'secondary-btn' | 'tertiary-btn' | 'quartenary-btn' | 'disabled-btn') | null
    children?: React.ReactNode
    className?: string
    label?: string | null
    newTab?: boolean | null
    reference?: {
        relationTo: 'pages' | 'posts' | 'experience' | 'portfolio'
        value: Page | Post | Experience | Portfolio | string | number
    } | null
    size?: ButtonProps['size'] | null
    type?: 'custom' | 'reference' | null
    url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
    const {
        type,
        appearance = 'inline',
        children,
        className,
        label,
        newTab,
        reference,
        size: sizeFromProps,
        url,
    } = props

    const href =
        type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
        ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
            reference.value.slug
            }`
        : url

    if (!href) return null

    const size = appearance === 'link' ? 'clear' : sizeFromProps
    const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

    /* Ensure we don't break any styles set by richText */
    if (appearance === 'inline') {
        return (
        <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
            {label && label}
            {children && children}
        </Link>
        )
    }
    if ( 
        appearance === 'default' 
        || appearance === 'destructive'
        || appearance === 'ghost'
        || appearance === 'link'
        || appearance === 'outline'
        || appearance ===  'secondary'
    )
    return (
        <Button asChild className={className} size={size} variant={appearance}>
        <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
            {label && label}
            {children && children}
        </Link>
        </Button>
    )
    if ( 
        appearance === 'primary-btn' 
        || appearance === 'secondary-btn'
        || appearance === 'tertiary-btn'
        || appearance === 'quartenary-btn'
        || appearance === 'disabled-btn'
    )
    return (
        <Button asChild className={className} size={size} >
        <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
            {label && label}
            {children && children}
        </Link>
        </Button>
    )
}
