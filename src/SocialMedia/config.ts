// globals/SocialLinks.ts
import { GlobalConfig } from 'payload'

export const SocialMedia: GlobalConfig = {
  slug: 'socialMedia',
  access: { read: () => true },
  fields: [
    {
      name: 'platforms',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Platform', plural: 'Platforms' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'GitHub', value: 'github' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter / X', value: 'twitter' },
            // add more as needed
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { placeholder: 'https://...' },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional custom icon' },
        },
      ],
    },
  ],
}