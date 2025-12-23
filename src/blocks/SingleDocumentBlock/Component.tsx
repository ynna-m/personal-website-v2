import React from 'react'
import { SingleDocumentBlock as SingleDocumentBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { DataFromCollectionSlug, getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { SingleExperienceTemplate } from '@/components/SingleExperienceTemplate'

type SingleDocumentType = DataFromCollectionSlug<"posts" | "experience" | "skills" | "portfolio"> & {
    content?:DefaultTypedEditorState | null,
    description?: string | null
}

export const SingleDocumentBlock = async (props : SingleDocumentBlockProps) => {
    const payload = await getPayload({ config: configPromise }) 
    const {id, selectPosts, selectExperience, selectSkills, selectPortfolio, collectionSource, headingEl} = props
    const singleDocumentId = collectionSource === "posts"
        ? selectPosts
        : collectionSource === "skills"
        ? selectSkills
        : collectionSource === "experience"
        ? selectExperience
        : collectionSource === "portfolio"
        ? selectPortfolio
        : null;
    const result = collectionSource && await payload.find({
        collection: collectionSource,
        limit: 1,
        pagination: false,
        where: {
            id: {
                equals: typeof singleDocumentId?.value === "number" 
                    ? singleDocumentId?.value
                    : singleDocumentId?.value?.id
            },
        },
    })
    const singleDocumentDoc = result.docs?.map((data : SingleDocumentType)=>{
        const content = Object.hasOwn(data, "content")
            ? data.content
            : Object.hasOwn(data, "description")
            ? data.description
            : ""
        const typeOfText = Object.hasOwn(data, "content")
            ? "DefaultTypedEditorState"
            : Object.hasOwn(data, "description")
            ? "string"
            : null
        return {
            ...data,
            collection: collectionSource,
            textContent: content,
            typeOfText: typeOfText
        }
    })?.[0]
    return (
        <div className="single-document-block" id={`block-${id}`}>
          {
            collectionSource === "experience"
            ? (
                <SingleExperienceTemplate 
                    {...result.docs?.[0]} 
                    {...headingEl && {headingEl:headingEl}} 
                />
            )
            : singleDocumentDoc?.typeOfText === "DefaultTypedEditorState"  
            ? (
                <RichText data={singleDocumentDoc?.textContent as DefaultTypedEditorState} />
            )
            : singleDocumentDoc?.typeOfText === "string"
            ? (
                <div>
                    {singleDocumentDoc?.textContent as string}
                </div>
            )
            : ""
          }
          
        </div>
      )
}

// export default Component