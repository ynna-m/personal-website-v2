import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

export type ButtonAppearances = 'primary-btn' | 'secondary-btn' | 'tertiary-btn' | 'quartenary-btn' | 'disabled-btn'

export const appearanceOptions: Record<ButtonAppearances, { label: string; value: string }> = {
  'primary-btn': {
    label: 'Primary',
    value: 'primary-btn',
  },
  'secondary-btn': {
    label: 'Secondary',
    value: 'secondary-btn',
  },
  'tertiary-btn': {
    label: 'Tertiary',
    value: 'tertiary-btn',
  },
  'quartenary-btn': {
    label: 'Quartenary',
    value: 'quartenary-btn',
  },
  'disabled-btn': {
    label: 'Disabled',
    value: 'disabled-btn',
  }
}

type ButtonType = (options?: {
  appearances?: ButtonAppearances[] | false
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const button: ButtonType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: GroupField = {
    name: 'button',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      relationTo: ['pages', 'posts', 'experience','portfolio'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions['primary-btn'], appearanceOptions['secondary-btn'], appearanceOptions['tertiary-btn'], appearanceOptions['quartenary-btn'], appearanceOptions['disabled-btn']]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the button should be rendered.',
      },
      defaultValue: 'primary-btn',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
