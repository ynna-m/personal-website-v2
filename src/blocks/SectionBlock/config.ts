import type { Block, Field } from 'payload'


import { MediaBlock } from '../MediaBlock/config'
import { RichTextBlock } from '../RichTextBlock/config'
import { BlogBlock } from '../BlogBlock/config'
import { SkillsCloudBlock } from '../SkillsCloudBlock/config'
import { CarouselBlock } from '../CarouselBlock/config'
import { SkillsTileBlock } from '../SkillsTileBlock/config'
import { SocialMediaBlock } from '../SocialMediaBlock/config'
import { SkillsLayoutBlock } from '../SkillsLayoutBlock/config'
import { FormBlock } from '../Form/config'
import { SingleDocumentBlock } from '../SingleDocumentBlock/config'

const columnFields: Field[] = [
    {
        name:"columnLabel",
        type:"text"
    },
    {
        name: 'size',
        type: 'select',
        defaultValue: 'oneThird',
        options: [
            {
                label: '1/12',
                value: 'oneTwelfth',
            },
            {
                label: '2/12',
                value: 'twoTwelfths',
            },
            {
                label: '3/12',
                value: 'threeTwelfths',
            },
            {
                label: '4/12',
                value: 'oneThird',
            },
            {
                label: '5/12',
                value: 'fiveTwelfths',
            },
            {
                label: '6/12',
                value: 'half',
            },
            {
                label: '7/12',
                value: 'sevenTwelfths',
            },
            {
                label: '8/12',
                value: 'twoThirds',
            },
            {
                label: '9/12',
                value: 'nineTwelfths',
            },
            {
                label: '10/12',
                value: 'tenTwelfths',
            },
            {
                label: '11/12',
                value: 'elevenTwelfths',
            },
            {
                label: '12/12',
                value: 'full',
            }
        ],
    },
    {
        name:'customClassNames',
        type:'text'
    },
    {
        name:"blocks",
        type:"blocks",
        blocks:[
            RichTextBlock, 
            MediaBlock, 
            BlogBlock, 
            SkillsCloudBlock,
            SkillsTileBlock,
            SkillsLayoutBlock,
            CarouselBlock,
            SocialMediaBlock,
            FormBlock,
            SingleDocumentBlock
        ]
    }
]

export const SectionBlock: Block = {
  slug: 'sectionBlock',
  interfaceName: 'SectionBlock',
  fields: [
    {
        name:'customClassNames',
        type: 'text'
    },
    {
        name:'bgImage',
        type:'upload',
        relationTo:'media',
        label:'Background Image'
    },
    {
        name:'enableParallax',
        type:'checkbox',
        label:'Enable Parallax Effect?'
    },
    {
        name:'parallaxOrientation',
        type:'select',
        admin:{
            condition:(_, siblingData) => siblingData.enableParallax === true
        },
        label:'Parallax Orientation',
        defaultValue:'up',
        options:[
            {
                value:'up',
                label:'Up'
            },
            {
                value:'down',
                label:'Down'
            },
            {
                value:'left',
                label:'Left'
            },
            {
                value:'right',
                label:'Right'
            },
            {
                value:'up right',
                label:'Up Right'
            },
            {
                value:'up left',
                label:'Up Left'
            },
            {
                value:'down right',
                label:'Down Right'
            },
            {
                value:'down left',
                label:'Down Left'
            }
        ],
        required:true
    },
    {
        name:'parallaxScale',
        type:'number',
        max:3,
        admin:{
            condition:(_, siblingData) => siblingData.enableParallax === true,
            step:0.1,
        },
    },
    {
        name:'enableParallaxOver',
        type:'checkbox',
        label:'Enable Parallax Overlay?',
        admin:{
            condition:(_, siblingData) => siblingData.enableParallax === true 
        }
    },
    {
        name:'parallaxOverlay',
        type:'text',
        label:'Parallax Overlay Color',
        admin:{
            condition:(_, siblingData) => siblingData.enableParallax === true && siblingData.enableParallaxOver === true,
            components:{
                Field:'@/components/ColorPickerRGBAField'
            }
        },
    },
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/SectionBlock/ColumnLabel#ColumnLabel',
        },
      },
      fields: columnFields,
    },
  ],
}
