import type { Block } from 'payload'


import { buttonGroup } from '../../fields/buttonGroup'
import { fullLexical } from '@/fields/fullLexical'

export const CallToActionBtnsBlock: Block = {
  slug: 'ctabtns',
  interfaceName: 'CallToActionBtnsBlock',
  fields: [
    {
        name:'customClassNames',
        type:'text'
    },
    {
      name: 'richText',
      type: 'richText',
      editor: fullLexical,
      label: false,
    },
    buttonGroup({
      appearances: ['primary-btn', 'secondary-btn','tertiary-btn','quartenary-btn', 'disabled-btn'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action Buttons Block',
    singular: 'Call to Action Buttons Block',
  },
}
