'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Menu, X } from 'lucide-react'
// import { Button } from 'react-aria-components'
export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])
  const handleOnClickBurger = (open:boolean) =>{
    setMobileDrawerOpen(!open)
  }
  return (
    <header className="ynna-dev-header z-[99] sticky top-0 " {...(theme ? { 'data-theme': theme } : {})}>
      <div className="header-content container py-4 flex justify-between ">
        <Link href="/">
          <Logo loading="eager" priority="high" />
        </Link>
        <HeaderNav data={data} className={`lg:flex hidden`}/>
        <a href="#" onClick={()=>handleOnClickBurger(isMobileDrawerOpen)} className={`ml-auto lg:hidden sm:grid`}>
            <Menu />
        </a>
        <div className="mobile-drawer lg:hidden ">
            <Drawer open={isMobileDrawerOpen} onOpenChange={handleOnClickBurger} direction='right'>
                <DrawerContent className='border-0 rounded-none bg-primary-dark text-primary-yellow absolute left-12 top-0 bottom-0 mt-0'>
                    <div className="h-full py-5">
                        
                        <div className="content-header flex flex-row">
                            <button onClick={()=>handleOnClickBurger(isMobileDrawerOpen)}>
                                <X />
                            </button>
                        </div>
                        <DrawerTitle>
                        </DrawerTitle>
                        <DrawerDescription>
                        </DrawerDescription>
                        <h2 className='ml-auto mr-auto text-center mb-5 text-4xl font-bold'>Menu</h2>
                        
                        <div className="content-nav" onClick={()=>handleOnClickBurger(isMobileDrawerOpen)}>
                            <HeaderNav data={data} className={`flex-col`} linkClassName={`text-3xl py-4`} />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
      </div>
    </header>
  )
}
