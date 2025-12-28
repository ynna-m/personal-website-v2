"use client"
import {  useField } from '@payloadcms/ui';
import * as React from 'react';
import {
  ColorArea,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorThumb,
  SliderTrack,
} from "@/components/ui/color"
// import { Dialog, DialogTrigger } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/field"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { parseColor } from "react-aria-components"
import { useEffect, useState } from 'react';
// import { PopoverContent } from '@radix-ui/react-popover';
// import { Input } from "@/components/ui/textfield"
export const ColorPickerRGBAField: React.FC<{ path: string, field: {label:string} }> = ({ path, field }) => {
    const { value, setValue } = useField<string>({ path });
    console.log("ColorPickerRGBAField.tsx - value", value);
    const [color, setColor] = useState(value ? parseColor(value) : parseColor("rgba(0,0, 0, 1)"));
    
    useEffect(()=>{
        const rgbaString = color?.toString("rgba")
        console.log("ColorPickerRGBAField.tsx - rgbaString", rgbaString)
        setValue(rgbaString)
    },[color])
    return (
    <div className={`color-picker`}>
        <Label>{field.label}</Label>
        <Input value={value} onChange={setValue} />
        <ColorPicker value={color} onChange={setColor}>
            <Popover  >
                <PopoverTrigger>
                    {/* <Button  className="flex h-fit items-center gap-2 p-1"> */}
                        <ColorSwatch className="size-8 rounded-md border-2" />
                        RGBA Color
                    {/* </Button> */}
                </PopoverTrigger>
                <PopoverContent>
                <div>
                <ColorArea
                    colorSpace="hsb"
                    xChannel="saturation"
                    yChannel="brightness"
                    className="h-[136px] rounded-b-none border-b-0"
                >
                    <ColorThumb className="z-50" />
                </ColorArea>
                <ColorSlider colorSpace="hsb" channel="hue">
                    <SliderTrack className="rounded-none border-y-0">
                    <ColorThumb className="top-1/2" />
                    </SliderTrack>
                </ColorSlider>
                <ColorSlider colorSpace="hsb" channel="alpha">
                    <SliderTrack
                    className="rounded-t-none border-t-0"
                    style={({ defaultStyle }) => ({
                        background: `${defaultStyle.background},
                repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
                    })}
                    >
                    <ColorThumb className="top-1/2" />
                    </SliderTrack>
                </ColorSlider>
                </div>


            </PopoverContent>
            </Popover>
        </ColorPicker>
    </div>
  )
}
export default ColorPickerRGBAField;