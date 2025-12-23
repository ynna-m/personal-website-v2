import type { Block } from 'payload'

export const DynamicTextarea: Block = {
  slug: 'dynamicTextarea',  // Unique slug for your custom block
  interfaceName:'DynamicTextarea',
  labels:{
    singular:"Dynamic Text Area",
    plural:"Dynamic Text Area"
  },    
  fields: [
    {
        type:"row",
        fields:[
            {
                name: 'name',
                type: 'text',
                label: 'Name (lowercase, no special characters)',
                required: true,
                admin:{
                    width:'50%'
                }
            },
            {
                name: 'label',
                type: 'text',
                label: 'Label',
                admin:{
                    width:'50%'
                }
            },
        ]
    },
    {
        type:"row",
        fields:[
            {
                name: 'width',
                type: 'number',
                label: 'Field Width',
                admin:{
                    width:'50%'
                }
            },
            {
                name: 'defaultValue',
                type: 'text',
                label: 'Default Value',
                admin:{
                    width:'50%'
                }
            }
        ]
    },
    {
        type:"row",
        fields:[
            {
                name: 'rows',  // ← Your new rows field
                type: 'number',
                label: 'Number of Rows',
                min: 1,
                max: 20,
                defaultValue: 3,  // Default like a standard textarea
                admin: {
                    description: 'Controls the height of the textarea (1-20 rows)',
                    width:'50%'
                }
            }
        ]
    },
    {
      name: 'required',
      type: 'checkbox',
      label: 'Required'
    },
    // Add more fields as needed (e.g., maxLength)
  ],
}