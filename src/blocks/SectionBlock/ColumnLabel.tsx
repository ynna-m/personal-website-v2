'use client'

import React from 'react'
// import type { RowLabelProps } from 'payload/components/fields/Array'  // For type safety
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import { SectionBlock } from '@/payload-types'
export const ColumnLabel: React.FC<RowLabelProps> = () => {
  // Read the label from row data; fallback to numbered default
//   const rowLabel = data?.label || `Column ${index + 1}`

//   return (
//     <span className="font-medium">
//       {rowLabel}
//     </span>
//   )
    const data = useRowLabel<NonNullable<SectionBlock['columns']>[number]>()

    const label = data?.data?.columnLabel
        ? `Column ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.columnLabel}`
        : 'Column'

    return <div>{label}</div>
}