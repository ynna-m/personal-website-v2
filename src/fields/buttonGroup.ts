import type { ArrayField, Field } from 'payload'

import type { ButtonAppearances } from './button'

import deepMerge from '@/utilities/deepMerge'
import { button } from './button'

type ButtonGroupType = (options?: {
  appearances?: ButtonAppearances[] | false
  overrides?: Partial<ArrayField>
}) => Field

export const buttonGroup: ButtonGroupType = ({ appearances, overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'buttons',
    type: 'array',
    fields: [
      button({
        appearances,
      }),
    ],
    admin: {
      initCollapsed: true,
    },
  }

  return deepMerge(generatedLinkGroup, overrides)
}
