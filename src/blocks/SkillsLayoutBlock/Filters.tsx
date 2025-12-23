"use client"
import React, { SetStateAction, useEffect, useState } from 'react'
import { FilterList, Option, SelectedFilters } from './Component'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckedState } from '@radix-ui/react-checkbox'
type FiltersProps = {
    filtersList?:FilterList[] | null,
    filterValues?:SelectedFilters[] | null
    setFilterValues:React.Dispatch<SetStateAction<SelectedFilters[] | null>>
}

export const Filters = (props:FiltersProps) => {
    const {
        filtersList,
        filterValues,
        setFilterValues
    } = props
    // const [selected, setSelected] = useState<SelectedFilters[] | undefined | null>(
    //     filterValues ?? 
    //     filtersList?.map((filter)=>{
    //         return {
    //             slug:filter.slug,
    //             selectedOptions:[]
    //         }
    //     })
    // );
    // const 
    // useEffect(()=>{
    //     // if(selected){
    //     //     setFilterValues(selected)
    //     // }
    //     if(!filterValues && filtersList){
    //         setFilterValues(
    //             filtersList?.map((filter)=>{
    //                 return {
    //                     slug:filter.slug,
    //                     selectedOptions:[]
    //                 }
    //             })
    //         )
    //     }
    // },[])
    const renderCheckbox = (option:Option, name:string, key: number | null | undefined = null) =>{
        const checked = filterValues
            ?.find(filter => filter.slug === name)
            ?.selectedOptions
            ?.find(opts => opts == option.value)
            ? true
            : false
        return(
            <div 
                className="check-box-container" 
                key={key}
            >
                <Checkbox 
                    name={name} 
                    value={option?.value} 
                    checked={checked}
                    onCheckedChange={(checkedState:CheckedState)=>{
                        const filterSelection = filterValues?.find(filter=>filter.slug == name)
                        console.log("Filters.tsx - filterSelection - ", filterValues, filterSelection)
                        const selectedOption = filterSelection
                            ?.selectedOptions
                            ?.find((opts)=>{
                                return opts == option?.value
                            })
                        if(checkedState){
                            if(!selectedOption){
                                filterSelection?.selectedOptions?.push(option?.value)
                            }
                        }
                        else{
                            if(selectedOption){
                                const index = filterSelection?.selectedOptions?.indexOf(selectedOption)
                                if(index != null){
                                    filterSelection?.selectedOptions?.splice(index,1)
                                }
                                
                            }
                        }
                        // setSelected((prev)=>{
                        //     const newSelection = prev?.map((selectedOptions)=>{
                        //         return (selectedOptions?.slug === name && filterSelection) 
                        //             ? filterSelection 
                        //             : selectedOptions
                        //     })
                        //     return newSelection
                        // })
                        if(filterValues){
                            setFilterValues((prev)=>{
                                const newSelection = prev?.map((selectedOptions)=>{
                                    return (selectedOptions?.slug === name && filterSelection) 
                                        ? filterSelection 
                                        : selectedOptions
                                }) 
                                return newSelection
                            })
                        }
                        else{
                            setFilterValues(()=>{
                                return filtersList?.map((filter)=>{
                                    return {
                                        slug:filter.slug,
                                        selectedOptions:filterSelection?.selectedOptions 
                                    }
                                })
                            })
                        }
                    }}
                />
                <Label>{option?.label}</Label>
            </div>
            
        )
    }
    const handleOnClear = (event: React.MouseEvent<HTMLButtonElement>) =>{
        setFilterValues((prev)=>{
            if(prev)
                return prev?.map((filter)=>{
                    filter.selectedOptions = []
                    return filter
                })
        })
    }
    // console.log("Filters.tsx - props", props)
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className={`filter-icon`}><FilterIcon /></Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="filters-container">
                    {
                        filtersList?.map((filter, index)=>{
                            return (
                                <div className={`filter-form filter-form-${filter.slug}`} key={index}>
                                    <div className="filter-heading">
                                        {filter.title}
                                    </div>
                                    <div className="filter-options">
                                        {
                                            filter.type === "checkbox" && (
                                                filter?.options?.map((opt, key)=>{
                                                    return renderCheckbox(opt, filter.slug, key)
                                                })
                                            )
                                        }
                                        <Button onClick={handleOnClear}>Clear Filters</Button>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </PopoverContent>
        </Popover>
    )
}