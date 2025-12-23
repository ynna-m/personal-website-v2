'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

export const HeaderNav: React.FC<{ data: HeaderType, className?:string, linkClassName?:string }> = ({ data, className, linkClassName }) => {
  const navItems = data?.navItems || []

  return (
    <nav className={`${cn(`flex gap-3 items-center`, className)} `}>
      {navItems.map(({ link }, i) => {
        return <CMSLink 
            key={i} 
            {...link} 
            {...linkClassName && {className:linkClassName}} 
            appearance="link" 
        />
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
