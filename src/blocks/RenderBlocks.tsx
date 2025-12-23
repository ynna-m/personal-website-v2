import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SectionBlock } from '@/blocks/SectionBlock/Component'
import { CallToActionBtnsBlock } from './CallToActionBtns/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  sectionBlock: SectionBlock,
  ctabtns: CallToActionBtnsBlock
}
/**
 * Blocks to add:
 * / SectionBlock - Generic Section Block for sections/rows
 * / BlogBlock - Contains latest blog posts 
 * / SkillsCloudBlock - A tag cloud animation for skillset
 * / CarouselBlock - A Carousel Block for collections
 * / SkillsTileBlock - A list of skills in square tiles
 * / SkillsLayoutBlock - Basically the list for the entire skills, searchable, and filterable
 * / SocialMediaBlock - This based on globals, but basically the list of social media account I have available 
 */

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <React.Fragment key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </React.Fragment>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
