/* eslint-disable @next/next/no-img-element */
"use client"
import { cn } from '@/utilities/ui';
import React from 'react'
import SimpleParallax from "simple-parallax-js";
type Orientation = "up" | "right" | "down" | "left" | "up left" | "up right" | "down left" | "down right";

type ParallaxImageProps = {
    src:string,
    alt?:string,
    orientation?: Orientation,
    scale?:number,
    className?:string
}
export const ParallaxImage = ({src,alt,orientation='up',scale = 1.3, className}:ParallaxImageProps) => {

    return (
        <SimpleParallax
            orientation={orientation}
            scale={scale}
        >
            <img src={src} alt={alt} className={cn(className)} />
        </SimpleParallax>
    )
}

export default ParallaxImage