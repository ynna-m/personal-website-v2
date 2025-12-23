import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPortfolioData, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[] | CardPortfolioData[],
  relationTo?: "posts" | "portfolio"
}

export const CollectionArchive: React.FC<Props> = ({posts, relationTo = "posts"}) => {
//   const { posts } = props

  return (
    <div className={cn('container  z-10 relative')}>
      <div>
        {/* <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8"> */}
        <div className="collection-archive grid grid-cols-[1fr_6fr_1fr] gap-y-4">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-start-2" key={index}>
                  <Card className="h-full" doc={result} relationTo={relationTo} showCategories />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
