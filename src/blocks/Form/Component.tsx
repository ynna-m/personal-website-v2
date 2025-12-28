'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { cn } from '@/utilities/ui'

export type CustomFormType = FormType & {
        enableCaptcha?:boolean,
        captchaProvider?:"hCaptcha" | null,
        captchaPosition?:"top" | "left" | "right"
    } 
export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: CustomFormType
  introContent?: DefaultTypedEditorState
}

export const FormBlock: React.FC<{ id?: string} & FormBlockType> = (props) => {
    const {
        enableIntro,
        form: formFromProps,
        form: { 
            id: formID, 
            confirmationMessage, 
            confirmationType, 
            redirect, 
            submitButtonLabel,
            enableCaptcha,
            //captchaProvider,
            captchaPosition
        } = {},
        introContent,
    } = props

    const formMethods = useForm({
        defaultValues: formFromProps.fields,
    })
    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
    } = formMethods

    const [isLoading, setIsLoading] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState<boolean>()
    const [error, setError] = useState<{ message: string; status?: string } | undefined>()
    const captchaRef = useRef<HCaptcha>(null)

    console.log("Form component", process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY)
    const router = useRouter()

    const onSubmit = useCallback(
        (data: FormFieldBlock[]) => {
            let loadingTimerID: ReturnType<typeof setTimeout>
            const submitForm = async () => {
                setError(undefined)

                const captchaValue = captchaRef.current ? captchaRef.current.getResponse() : undefined

                if(captchaRef && !captchaValue){
                    if(enableCaptcha){
                        setIsLoading(false)
                        setError({
                            message:'Please complete Captcha'
                        })
                        return
                    }
                }

                const dataToSend = Object.entries(data).map(([name, value]) => ({
                    field: name,
                    value,
                }))

                // delay loading indicator by 1s
                loadingTimerID = setTimeout(() => {
                    setIsLoading(true)
                }, 1000)

                try {
                    const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
                        body: JSON.stringify({
                            form: formID,
                            submissionData: dataToSend,
                            captcha:captchaValue
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                    })

                    const res = await req.json()

                    clearTimeout(loadingTimerID)

                    if (req.status >= 400) {
                        setIsLoading(false)

                        setError({
                            message: res.errors?.[0]?.message || 'Internal Server Error',
                            status: res.status,
                        })

                        return
                    }

                    setIsLoading(false)
                    setHasSubmitted(true)
                    captchaRef.current?.resetCaptcha?.()
                    if (confirmationType === 'redirect' && redirect) {
                        const { url } = redirect

                        const redirectUrl = url

                        if (redirectUrl) router.push(redirectUrl)
                    }
                } catch (err) {
                    console.warn(err)
                    setIsLoading(false)
                    setError({
                        message: 'Something went wrong.',
                    })
                    captchaRef.current?.resetCaptcha?.()
                }
            }

            void submitForm()
        },
        [router, formID, redirect, confirmationType, enableCaptcha],
    )

    return (
        <div className="form-block lg:max-w-[48rem]">
        {enableIntro && introContent && !hasSubmitted && (
            <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
        )}
        <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
            <FormProvider {...formMethods}>
            {!isLoading && hasSubmitted && confirmationType === 'message' && (
                <RichText data={confirmationMessage} />
            )}
            {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
            {error && <div className='text-red-600'>{`${error.status || '500'}: ${error.message || ''}`}</div>}
            {!hasSubmitted && (
                <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4 last:mb-0">
                        {formFromProps &&
                            formFromProps.fields &&
                            formFromProps.fields?.map((field, index) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                                if (Field) {
                                    return (
                                        <div className="mb-6 last:mb-0" key={index}>
                                            <Field
                                                form={formFromProps}
                                                {...field}
                                                {...formMethods}
                                                control={control}
                                                errors={errors}
                                                register={register}
                                            />
                                        </div>
                                    )
                                }
                                return null
                            })}
                    </div>
                    <div className="form-bottom-container grid">
                        {
                            enableCaptcha && (
                                <div 
                                    className={`captcha-container ${cn(`grid row-start-1 col-span-1`, 
                                        captchaPosition === "left" && `col-start-1 col-end-2`, 
                                        captchaPosition === "right" && `col-start-2 col-end-3`
                                    )}`}
                                >
                                    <HCaptcha 
                                        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string || ``} 
                                        ref={captchaRef}
                                    />
                                </div>
                            )
                        }
                        <div 
                            className={`button-container ${cn(`grid row-start-2 col-span-1`, 
                                        captchaPosition === "left" && `row-start-1 col-start-2 col-end-3 content-center`, 
                                        captchaPosition === "right" && `row-start-1 col-start-1 col-end-2`
                                    )}`}
                        >
                            <Button form={formID} type="submit" variant="default">
                                {submitButtonLabel}
                            </Button>
                        </div>
                    </div>
                
                </form>
            )}
            </FormProvider>
        </div>
        </div>
    )
}
