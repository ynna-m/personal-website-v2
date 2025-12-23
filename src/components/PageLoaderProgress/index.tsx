'use client'

import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageLoaderProgress() {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Reset when page changes
    setProgress(0)
    setIsLoading(true)

    // Simulate smooth progress (you can make it faster/slower)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer)
          return 90 // Stop at 90% until navigation completes
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(timer)
  }, [pathname]) // Re-run on every route change

  // Hide when loading is "complete" (after navigation)
  useEffect(() => {
    if (!isLoading) return
    const complete = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {setIsLoading(false)}, 1000) // brief delay for smooth finish
    }, 1200) // adjust timing to match your average page load

    return () => clearTimeout(complete)
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed w-full h-full bg-primary-dark z-[9999] grid justify-center items-center">
      <Progress value={progress} className='absolute max-w-[72rem] place-self-center' />
    </div>
  )
}