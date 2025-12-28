'use client'
import React, { useEffect, useState } from 'react'
import type {  Skill, SkillsCategory, SkillsLayoutBlock as SkillsLayoutBlockProps } from "@/payload-types"
import { payloadGraphQL } from '@/utilities/payloadGraphQL'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/utilities/useDebounce'
import { Filters } from './Filters'
import { Media } from '@/components/Media'
import { Search } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export type Option = {
    label:string,
    value:string
}
export type FilterList = {
    slug:string,
    title:string,
    type:"checkbox" | "select"
    options?:Option[]
}
export type SelectedFilters = {
    slug:string,
    selectedOptions?:string[] 
}

export const SkillsLayoutBlock:React.FC<SkillsLayoutBlockProps> = (props) => {
    // console.log("SkillsLayoutBlock.tsx - props", props)
    const {
        customClassNames
    } = props
    const [ searchValue, setSearchValue ] = useState("");
    const [ filterValues, setFilterValues ] = useState<SelectedFilters[] | null>(null);
    const [ filtersList, setFiltersList ] = useState<FilterList[] | null>(null)
    const [ skillsLayout, setSkillsLayout ] = useState<any>(null);
    const [ progress, setProgress ] = useState(50);
    const [ isLoading, setIsLoading ] = useState(true);

    const debouncedSearchValue = useDebounce(searchValue, 800)
    const initFilterList = async () => {
        const filterList:FilterList[] = []
        // Categories
        const queryCategories = `
            query {
                SkillsCategories(limit:120, sort:"title"){
                    docs{
                        id
                        title
                    }
                }
            }
        `
        const resultCategories = await payloadGraphQL(queryCategories)
        const skillsCategories : SkillsCategory[] = resultCategories?.SkillsCategories?.docs
        filterList.push(
            {
                slug:"skills-categories",
                title:"Skills Categories",
                type:"checkbox",
                options:skillsCategories?.map((cat)=>{
                    return {
                        label:cat.title,
                        value:cat.id?.toString()
                    }
                })
            }
        )
        setFiltersList(filterList)
        // console.log("SkillsLayoutBlock.tsx - filterList", filterList)
    }
    const initSkills = async () =>{
        // const payload = await getPayload({config});
        // Step 1: Get all categories (usually only 5–10)
        const categoriesFromSelectionList = filtersList
            ?.find(filters=>filters.slug === "skills-categories")
        // console.log("SkillsLayouBlock.tsx - initSKills categoriesFromSelectionList", filtersList, categoriesFromSelectionList)
        const categoriesWithSkills = categoriesFromSelectionList?.options && await Promise.all(
            categoriesFromSelectionList
                ?.options
                ?.map(async (category) => {
                    const querySkills = `
                        query FindCurrentSkillsDocs($where: Skill_where) {
                            Skills(where: $where, limit:120){
                                docs{
                                    id
                                    title
                                    tooltip
                                    description
                                    image{
                                        id
                                        url
                                        alt
                                        thumbnailURL
                                        filename
                                        mimeType
                                        caption
                                        width
                                        height
                                        focalX
                                        focalY
                                    }
                                    categories {
                                        id
                                        title
                                    }
                                }
                            }
                        }
                    `
                    const variablesSkills = {
                        where:{
                            categories: {
                                equals: Number.parseInt(category.value),
                            }
                        }
                    }
                    const resultSkills = await payloadGraphQL(querySkills, variablesSkills)
                    const skills = resultSkills?.Skills?.docs
                    return {
                        category:category,
                        skills:skills,
                    }
                }
            )
        )
        setSkillsLayout(categoriesWithSkills)
        // console.log("SkillsLayoutBlock.tsx - initSkills()", 
        //     // skillsCategories, 
        //     categoriesWithSkills
        // )
    }
    const searchFilterSkills = async () =>{
        const categoriesFromSelectionList = filtersList
            ?.find(filters=>filters.slug === "skills-categories")
            ?.options
            ?.map(opts=>{
                return {
                    label:opts.label,
                    value:Number.parseInt(opts.value)
                }
            })
            
        const categoriesFromSelectionListMapped = categoriesFromSelectionList
            ?.map((opts)=>{
                return opts?.value
            })
        const categoriesFilter = filterValues
            ?.find(filters=>filters.slug === "skills-categories")
            ?.selectedOptions
            ?.map((opts)=>{
                return Number.parseInt(opts)
            })
        const categoriesSelect = (categoriesFilter && categoriesFilter.length > 0) 
            ? categoriesFilter
            : categoriesFromSelectionListMapped
        const categoriesWithSkills = categoriesSelect && await Promise.all(
            categoriesSelect.map(async (category) => {
                const categoryDetails = categoriesFromSelectionList
                    ?.find(options => options.value == category)
                const querySkills = `
                    query FindCurrentSkillsDocs($where: Skill_where) {
                        Skills(where: $where, limit:120){
                            docs{
                                id
                                title
                                tooltip
                                description
                                image{
                                    id
                                    url
                                    alt
                                    thumbnailURL
                                    filename
                                    mimeType
                                    caption
                                    width
                                    height
                                    focalX
                                    focalY
                                }
                                categories {
                                    id
                                    title
                                }
                            }
                        }
                    }
                `
                const variablesSkills : {where:{AND:any[]}} = {
                    where:{
                        AND: [
                            {
                                categories: {
                                    equals: category,
                                }
                            },
                            
                        ]
                        
                    }
                }
                if(searchValue){
                    variablesSkills.where.AND.push({
                        title: {
                            like: searchValue
                        }
                    })
                }
                const resultSkills = await payloadGraphQL(querySkills, variablesSkills)
                const skills = resultSkills?.Skills?.docs
                

                return {
                    category:categoryDetails,
                    skills:skills,
                }
            })
        )
        setSkillsLayout(categoriesWithSkills)
        // console.log("SkillsLayoutBlock.tsx - skills - searchFilterSkills", 
        //     // skillsCategories,
        //     // searchValue, 
        //     categoriesWithSkills
        // )
    }
    useEffect(()=>{
        //Init
        setProgress(0);
        setIsLoading(true);
        const timer = setInterval(() => {
            setProgress((old) => {
                if (old >= 90) return old; // Slow down near the end
                const diff = Math.random() * 10;
                return Math.min(old + diff, 90);
            });
        }, 100);
        initFilterList().finally(()=>{
            setProgress(100);

            setTimeout(()=>{
                setIsLoading(false)
                clearInterval(timer)
            }, 1000)
        })
    }, []);
    useEffect(()=>{
        initSkills()
        if(filtersList){
            setFilterValues(
                filtersList?.map((filter)=>{
                    return {
                        slug:filter.slug,
                        selectedOptions:[]
                    }
                })
            )
        }
    },[filtersList])
    useEffect(()=>{
        setProgress(0);
        setIsLoading(true);
        const timer = setInterval(() => {
            setProgress((old) => {
                if (old >= 90) return old; // Slow down near the end
                const diff = Math.random() * 10;
                return Math.min(old + diff, 90);
            });
        }, 300);
        const checkIfFilterValuesHaveArray = filterValues?.filter(filter =>{
            return filter?.selectedOptions && filter?.selectedOptions?.length > 0
        })
        if(debouncedSearchValue || (checkIfFilterValuesHaveArray && checkIfFilterValuesHaveArray?.length > 0)){
            searchFilterSkills().finally(()=>{
                setProgress(100);

                setTimeout(()=>{
                    setIsLoading(false)
                    clearInterval(timer)
                }, 1000)
            })
        }
        else{
            initSkills().finally(()=>{
                setProgress(100);

                setTimeout(()=>{
                    setIsLoading(false)
                    clearInterval(timer)
                }, 1000)
            })
        }
    },
        [debouncedSearchValue, filterValues]
    )
    // useEffect(()=>{
        
    // },[])
    return (
        <div className={`render-block skills-layout-block ${customClassNames ?? ``}`}>
            {/* Skills Layout Block */}
            <div className="skills-layout-title">
                <h2>Skills</h2>
            </div>
            <div className="skills-layout-search-and-filter-container">
                <div className="skills-layout-input-container">
                    <Input 
                        value={searchValue}
                        onChange={(event)=>setSearchValue(event.target.value)}
                        className={`skills-layout-search`}
                        placeholder='Search...'
                    />
                    <div className="skills-layout-search-icon">
                        <Search />
                    </div>
                </div>
                <Filters filterValues={filterValues} filtersList={filtersList} setFilterValues={setFilterValues} />
            </div>
            <div className={`skills-set `}>
                
                    {isLoading && (
                        <div className='loading-progress  col-span-2 w-full h-full justify-center items-center'>
                            <Progress value={progress} className="w-full " />
                        </div>
                    )}
                {
                    skillsLayout
                        ?.filter((skillsCategory: { skills: string | any[] | null })=>!(skillsCategory.skills == null || skillsCategory.skills?.length === 0))
                        ?.map((skillsCategory: { category: { label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }; skills: Skill[]}, index: React.Key | null | undefined)=>{
                        return(
                            <div className="skills-category" key={index}>
                                <div className="skills-heading"><h3>{skillsCategory?.category?.label}</h3></div>
                                <div className="skills-layout-set">
                                    <TooltipProvider>
                                    {
                                        skillsCategory?.skills?.map((skill: Skill,key: React.Key | null | undefined)=>{
                                            return(
                                                 <div 
                                                    className="skills-tile-container" 
                                                    key={key}
                                                >
                                                    {
                                                        skill?.tooltip 
                                                        ? (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Media
                                                                        className='skills-tile'
                                                                        resource={skill.image}
                                                                    />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{skill?.tooltip}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )
                                                        : (
                                                            <Media
                                                                className='skills-tile'
                                                                resource={skill.image}
                                                            />
                                                        )
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                    </TooltipProvider>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}