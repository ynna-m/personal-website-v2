import { Media } from '@/components/Media'
import type { Media as MediaProps } from '@/payload-types'
import React from 'react'
import { ImageMedia } from '../Media/ImageMedia'
import { cn } from '@/utilities/ui'

type ThemeImageProps = {
    resource?: number | MediaProps
    height?: string | number //number becomes px,
    styling?: "style1" | "style2" 
}
const placeholder = {
    src:'/media/No_Image_Available.jpg',
    size: "33vw",
    width: 547,
    height: 547
}
const cssLengthRegex = /^(-?\d*\.?\d+)(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|lh|rlh|svw|lvw|dvw|svh|lvh|dvh|vi|vb|svi|lvi|dvi|svb|lvb|dvb|cm|mm|Q|in|pt|pc)?$/i;

const isValidCssUnit = (str:string) => {
  return cssLengthRegex.test(str.trim());
}

const parseCssValue = (value: string): { number: number; unit: string } | null  =>{
  // Matches: optional minus, digits, optional decimal, then the unit (letters, %, etc.)
  const match = value.trim().match(/^(-?\d*\.?\d+)(.*)$/)

  if (!match) return null

  const [, numStr, unit] = match
  const number = parseFloat(numStr)

  // If parseFloat fails (e.g., empty string before unit), return null
  if (isNaN(number)) return null

  return { number, unit }
}

// Example usage
const addToCssValue  = (value: string, amount: number): string | null => {
  const parsed = parseCssValue(value)
  if (!parsed) return null

  return `\( {parsed.number + amount} \){parsed.unit}`
}

// Tests
// console.log(addToCssValue("24px", 16))     // "40px"
// console.log(addToCssValue("1.5rem", 0.5))  // "2rem"
// console.log(addToCssValue("-12.5vh", 10)) // "-2.5vh"
// console.log(addToCssValue("50%", -10))    // "40%"
// console.log(addToCssValue("0", 5))         // "5" (unit empty)
// console.log(addToCssValue("auto", 10))    // null (not numeric)
// console.log(addToCssValue("calc(100% - 20px)", 10)) // null (calc not supported)
export const ThemeImage = (props:ThemeImageProps) => {
    const {resource, height, styling} = props
    const imageHeight = typeof height === "string" 
        && isValidCssUnit(height)
        ? height
        : typeof height === "number"
        ? `${height}px`
        : "40rem"
    const bgHeight = addToCssValue(imageHeight,5)
    const picClassStyle1 = `items-center h-full before:content=[''] before:bg-primary-yellow before:w-full before:h-full before:col-start-2 before:col-end-3 
                            before:row-start-1 before:row-end-4`;
    const picClassStyle2 = `before:content=[''] before:bg-primary-yellow before:w-full before:h-full before:col-start-1 before:col-end-4 
                            before:row-start-2 before:row-end-3`
    const imgClassStyle1 = `col-start-1 col-end-4 row-start-2 row-end-3`
    const imgClassStyle2 = `col-start-2 col-end-3 row-start-1 row-end-4`
    return (
        <>
            <div 
                className="hidden"
                style={{
                    ...(
                        height 
                        ? {
                            '--dynamic-theme-pic-height': bgHeight, 
                            '--dynamic-theme-img-height': imageHeight
                        }
                        : {
                            '--dynamic-theme-pic-height': '45rem', 
                            '--dynamic-theme-img-height': '40rem'
                        }
                    ),
                } as React.CSSProperties}
            >
            </div>
            {
                !resource 
                && (
                        
                        <ImageMedia 
                            pictureClassName={`card-image-container grid grid-cols-[1fr_6fr_1fr]  grid-rows-[1fr_6fr_1fr] dynamic-pic-height 
                                    ${cn(picClassStyle1, styling === "style2" && picClassStyle2)} 
                                `} 
                            imgClassName={`card-image w-full dynamic-img-height h-full object-contain object-center 
                                ${cn(imgClassStyle1, styling === "style2" && imgClassStyle2)} 
                            `}
                            src={placeholder} 
                            priority={true}
                        />
                )
            }
            {
                resource
                && (
                    <Media
                        className={`media-container`}
                        pictureClassName={`card-image-container grid grid-cols-[1fr_6fr_1fr] grid-rows-[1fr_6fr_1fr] dynamic-pic-height 
                                            ${cn(picClassStyle1, styling === "style2" && picClassStyle2)} 
                                         `} 
                        imgClassName={`card-image w-full dynamic-img-height h-full object-cover object-center 
                            ${cn(imgClassStyle1, styling === "style2" && imgClassStyle2)} 
                        `} 
                        resource={resource}
                        priority={true}
                    />
                )
            }
        </>
        
    )
}
