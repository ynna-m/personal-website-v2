// globals/SocialLinks.ts
import { fullLexical } from '@/fields/fullLexical'
import { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs:[
        {
            name:'general',
            label: 'General Settings',
            fields:[
                {
                    type:'collapsible',
                    label:'Under Construction Settings',
                    fields:[
                        {
                            name:'isUnderConst',
                            label:'Enable Under Construction / Coming Soon Mode?',
                            type:'checkbox'
                        },
                        {
                            name:'underConstTitle',
                            type: 'text',
                            label: 'Coming Soon Title',
                            defaultValue: 'Coming Soon',
                            admin: { 
                                condition: (_, sibling) => sibling.isUnderConst 
                            }
                        },
                        {
                            name: 'underConstMessage',
                            type: 'richText',
                            label: 'Coming Soon Message',
                            editor:fullLexical,
                            admin: { 
                                condition: (_, sibling) => sibling.isUnderConst 
                            },
                        },
                        {
                            name: 'underConstBackgroundColor',
                            type: 'text',
                            label: 'Background Color',
                            defaultValue:'rgba(41, 41, 41, 1)',
                            admin: { 
                                components:{
                                    Field:'@/components/ColorPickerRGBAField'
                                }
                            },
                        },
                    ]
                }
            ]
        }
      ]
    },
  ],
}