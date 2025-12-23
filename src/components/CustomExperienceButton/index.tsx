'use client'

import type { ClientCollectionConfig, PublishButtonClientProps } from 'payload'

// import { useModal } from '@faceless-ui/modal'
import * as qs from 'qs-esm'
import React, { useCallback, useEffect, useState } from 'react'

import { 
    useForm, 
    useFormModified,
    useHotkey,
    useDocumentInfo,
    useEditDepth,
    useLocale,
    useOperation,
    useTranslation,
    FormSubmit,
    PopupList,
    useConfig,
    useModal
 } from '@payloadcms/ui'
import type { ClientField } from 'payload'
import { ScheduleDrawer } from './ScheduleDrawer'
import { payloadGraphQL } from '@/utilities/payloadGraphQL'
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from '../ui/alert-dialog'

export const traverseForLocalizedFields = (fields: ClientField[]): boolean => {
  for (const field of fields) {
    if ('localized' in field && field.localized) {
      return true
    }

    switch (field.type) {
      case 'array':
      case 'collapsible':
      case 'group':
      case 'row':
        if (field.fields && traverseForLocalizedFields(field.fields)) {
          return true
        }
        break

      case 'blocks':
        if (field.blocks) {
          for (const block of field.blocks) {
            if (block.fields && traverseForLocalizedFields(block.fields)) {
              return true
            }
          }
        }
        break

      case 'tabs':
        if (field.tabs) {
          for (const tab of field.tabs) {
            if ('localized' in tab && tab.localized) {
              return true
            }
            if ('fields' in tab && tab.fields && traverseForLocalizedFields(tab.fields)) {
              return true
            }
          }
        }
        break
    }
  }

  return false
}
// -import { useForm, useFormModified } from '../../forms/Form/context.js'
// -import { FormSubmit } from '../../forms/Submit/index.js'
// -import { useHotkey } from '../../hooks/useHotkey.js'
// -import { useConfig } from '../../providers/Config/index.js'
// -import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
// -import { useEditDepth } from '../../providers/EditDepth/index.js'
// -import { useLocale } from '../../providers/Locale/index.js'
// -import { useOperation } from '../../providers/Operation/index.js'
// -import { useTranslation } from '../../providers/Translation/index.js'
// import { traverseForLocalizedFields } from '../../utilities/traverseForLocalizedFields.js'
// -import { PopupList } from '../Popup/index.js'
// import { ScheduleDrawer } from './ScheduleDrawer/index.js'

export function CustomExperienceButton({ label: labelProp }: PublishButtonClientProps) {
    const [openDialog, setOpenDialog] = useState(false)
    const [conflictingDocs, setConflictingDocs] = useState<any[]>([])
    const [schedulePublishUse, setSchedulePublishUse] = useState(false);
    const {
        id,
        collectionSlug,
        docConfig,
        globalSlug,
        hasPublishedDoc,
        hasPublishPermission,
        setHasPublishedDoc,
        setMostRecentVersionIsAutosaved,
        setUnpublishedVersionCount,
        unpublishedVersionCount,
        uploadStatus,
    } = useDocumentInfo()

    const { config, getEntityConfig } = useConfig()
    const { submit } = useForm()
    const modified = useFormModified()
    const editDepth = useEditDepth()
    const { code: localeCode } = useLocale()
    const { isModalOpen, toggleModal } = useModal()

    const drawerSlug = `schedule-publish-${id}`

    const {
        localization,
        routes: { api },
        serverURL,
    } = config

    const { t } = useTranslation()
    const label = labelProp || t('version:publishChanges')

    const entityConfig = React.useMemo(() => {
        if (collectionSlug) {
        return getEntityConfig({ collectionSlug })
        }

        if (globalSlug) {
        return getEntityConfig({ globalSlug })
        }
    }, [collectionSlug, globalSlug, getEntityConfig]) as ClientCollectionConfig

    const hasNewerVersions = unpublishedVersionCount > 0

    const schedulePublish =
        typeof entityConfig?.versions?.drafts === 'object' &&
        entityConfig?.versions?.drafts.schedulePublish

    const canPublish =
        hasPublishPermission &&
        (modified || hasNewerVersions || !hasPublishedDoc) &&
        uploadStatus !== 'uploading'

    const scheduledPublishEnabled = Boolean(schedulePublish)

    // If autosave is enabled the modified will always be true so only conditionally check on modified state
    const hasAutosave = Boolean(
        typeof entityConfig?.versions?.drafts === 'object' && entityConfig?.versions?.drafts.autosave,
    )

    const canSchedulePublish = Boolean(
        scheduledPublishEnabled &&
        hasPublishPermission &&
        (globalSlug || (collectionSlug && id)) &&
        (hasAutosave || !modified),
    )

    const [hasLocalizedFields, setHasLocalizedFields] = useState(false)

    useEffect(() => {
        const hasLocalizedField = traverseForLocalizedFields(entityConfig?.fields)
        setHasLocalizedFields(hasLocalizedField)
    }, [entityConfig?.fields])

    const isSpecificLocalePublishEnabled = localization && hasLocalizedFields && hasPublishPermission

    const operation = useOperation()

    const disabled = operation === 'update' && !modified



    const collectionNameSingular = entityConfig?.labels?.singular as string
    const collectionNamePlural = entityConfig?.labels?.plural as string


    const findCurrentConflictingDoc = useCallback(async () =>{
        const query = `
            query FindCurrent${collectionNamePlural}Docs($where: ${collectionNameSingular}_where) {
                ${collectionNamePlural}(where: $where, limit: 1) {
                    docs {
                        id
                        title
                        current
                    }
                }
            }
        `
        const variables = id
            ? { 
                AND:[
                    {
                        current:{
                            equals:true
                        }
                    },
                    {
                        _status:{
                            equals:"published"
                        }
                    },
                    {
                        id: { 
                            not_equals: id 
                        } 
                    }
                ]
            }
            : {
                AND:[
                    {
                        current:{
                            equals:true
                        }
                    },
                    {
                        _status:{
                            equals:"published"
                        }
                    }
                ]
            }
        console.log("CustomExperienceButton.tsx - queryString", query)
        const data = await payloadGraphQL(query, { where: variables })

        return data;
    },[collectionNamePlural, collectionNameSingular, id])
    const saveDraft = useCallback(async () => {
        if (disabled) {
        return
        }

        const search = `?locale=${localeCode}&depth=0&fallback-locale=null&draft=true`
        let action
        let method = 'POST'

        if (collectionSlug) {
        action = `${serverURL}${api}/${collectionSlug}${id ? `/${id}` : ''}${search}`
        if (id) {
            method = 'PATCH'
        }
        }

        if (globalSlug) {
        action = `${serverURL}${api}/globals/${globalSlug}${search}`
        }

        await submit({
        action,
        method,
        overrides: {
            _status: 'draft',
        },
        skipValidation: true,
        })
    }, [submit, collectionSlug, globalSlug, serverURL, api, localeCode, id, disabled])

    useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (saveDraft && docConfig.versions?.drafts && docConfig.versions?.drafts?.autosave) {
        void saveDraft()
        }
    })
    const publish = useCallback(async () => {
        if (uploadStatus === 'uploading') {
            return
        }

        const formData = new FormData(document.querySelector('form') as HTMLFormElement)
        const isCurrent = formData.get('current') === 'on';

        if(!isCurrent){
            const result = await submit({
                overrides: {
                    _status: 'published',
                },
            })
            if (result) {
                setUnpublishedVersionCount(0)
                setMostRecentVersionIsAutosaved(false)
                setHasPublishedDoc(true)
            }
        }
    

        const data = await findCurrentConflictingDoc();
        
        const conflicts = (collectionNamePlural && data?.[collectionNamePlural]?.docs) || []
        console.log("CustomExperienceButton.tsx - await payloadGraphQL",data,conflicts, conflicts.length)
        if (conflicts.length == 0) {
            // No conflicts; submit
            const result = await submit({
                overrides:{
                    _status:'published'
                }
            });
            if (result) {
                setUnpublishedVersionCount(0)
                setMostRecentVersionIsAutosaved(false)
                setHasPublishedDoc(true)
            }
        } else {
            // Show dialog with conflicts
            setConflictingDocs(conflicts)
            setOpenDialog(true)
        }
    }, [uploadStatus, 
        findCurrentConflictingDoc, 
        collectionNamePlural, 
        submit, 
        setUnpublishedVersionCount, 
        setMostRecentVersionIsAutosaved, 
        setHasPublishedDoc])

    const publishSpecificLocale = useCallback(
        async (locale) => {
        if (uploadStatus === 'uploading') {
            return
        }

        const params = qs.stringify({
            depth: 0,
            publishSpecificLocale: locale,
        })

        const action = `${serverURL}${api}${
            globalSlug ? `/globals/${globalSlug}` : `/${collectionSlug}${id ? `/${id}` : ''}`
        }${params ? '?' + params : ''}`

        const result = await submit({
            action,
            overrides: {
            _status: 'published',
            },
        })

        if (result) {
            setHasPublishedDoc(true)
        }
        },
        [api, collectionSlug, globalSlug, id, serverURL, setHasPublishedDoc, submit, uploadStatus],
    )
    const handleConfirm = async () =>{
        setOpenDialog(false)
        await Promise.all(
            conflictingDocs.map(async (doc)=>{
                console.log("CustomExperienceButton.tsx - mutation string GraphQL",doc);
                const mutation = `
                    mutation Update${collectionNameSingular} ($id : Int!, $data:mutation${collectionNameSingular}UpdateInput!){
                        update${collectionNameSingular}(id:$id, data:$data){
                            id
                            current
                        }
                    }
                `
                const variables = {
                    id:doc.id,
                    data:{  
                        current:false
                    }   
                }
                await payloadGraphQL(mutation,variables)
            })
        )
        const result = await submit({
            overrides:{
                _status:'published'
            }
        });
        if (result) {
            setUnpublishedVersionCount(0)
            setMostRecentVersionIsAutosaved(false)
            setHasPublishedDoc(true)
        }
    }
    useEffect( ()=>{
        const schedulePublishConflictsConfirm = async () =>{
            if(schedulePublishUse == true){
                const data = await findCurrentConflictingDoc();
                await Promise.all(
                    data.map(async (doc: any)=>{
                        console.log("CustomExperienceButton.tsx - mutation string GraphQL",doc);
                        const mutation = `
                            mutation Update${collectionNameSingular} ($id : Int!, $data:mutation${collectionNameSingular}UpdateInput!){
                                update${collectionNameSingular}(id:$id, data:$data){
                                    id
                                    current
                                }
                            }
                        `
                        const variables = {
                            id:doc.id,
                            data:{  
                                current:false
                            }   
                        }
                        await payloadGraphQL(mutation,variables)
                    })
                )
                const result = await submit({
                    overrides:{
                        _status:'published'
                    }
                });
                if (result) {
                    setUnpublishedVersionCount(0)
                    setMostRecentVersionIsAutosaved(false)
                    setHasPublishedDoc(true)
                }
                setSchedulePublishUse(false)
            }
        }
        schedulePublishConflictsConfirm();
    },[collectionNameSingular, 
        findCurrentConflictingDoc, 
        schedulePublishUse, 
        setHasPublishedDoc, 
        setMostRecentVersionIsAutosaved, 
        setUnpublishedVersionCount, 
        submit])
    // Publish to all locales unless there are localized fields AND defaultLocalePublishOption is 'active'
    const isDefaultPublishAll =
        !isSpecificLocalePublishEnabled ||
        (localization && localization?.defaultLocalePublishOption !== 'active')

    const activeLocale =
        localization &&
        localization?.locales.find((locale) =>
        typeof locale === 'string' ? locale === localeCode : locale.code === localeCode,
        )

    const activeLocaleLabel =
        activeLocale &&
        (typeof activeLocale.label === 'string'
        ? activeLocale.label
        : (activeLocale.label?.[localeCode] ?? undefined))

    if (!hasPublishPermission) {
        return null
    }
    console.log("CustomExperienceButton.tsx - isModalOpen",isModalOpen, toggleModal)
    return (
        <React.Fragment>
            <FormSubmit
                buttonId="action-save"
                disabled={!canPublish}
                enableSubMenu={canSchedulePublish}
                onClick={isDefaultPublishAll ? publish : () => publishSpecificLocale(activeLocale.code)}
                size="medium"
                SubMenuPopupContent={
                isSpecificLocalePublishEnabled || canSchedulePublish
                    ? ({ close }) => {
                        return (
                        <React.Fragment>
                            {canSchedulePublish && (
                            <PopupList.ButtonGroup key="schedule-publish">
                                <PopupList.Button
                                id="schedule-publish"
                                onClick={() => [toggleModal(drawerSlug), close()]}
                                >
                                {t('version:schedulePublish')}
                                </PopupList.Button>
                            </PopupList.ButtonGroup>
                            )}
                            {isSpecificLocalePublishEnabled && (
                            <PopupList.ButtonGroup>
                                <PopupList.Button
                                id="publish-locale"
                                onClick={
                                    isDefaultPublishAll
                                    ? () => publishSpecificLocale(activeLocale.code)
                                    : publish
                                }
                                >
                                {isDefaultPublishAll
                                    ? t('version:publishIn', { locale: activeLocaleLabel })
                                    : t('version:publishAllLocales')}
                                </PopupList.Button>
                            </PopupList.ButtonGroup>
                            )}
                        </React.Fragment>
                        )
                    }
                    : undefined
                }
                type="button"
            >
                {!isDefaultPublishAll ? t('version:publishIn', { locale: activeLocaleLabel }) : label}
            </FormSubmit>
            {canSchedulePublish && isModalOpen(drawerSlug) && (
                <ScheduleDrawer
                    defaultType={!hasNewerVersions ? 'unpublish' : 'publish'}
                    schedulePublishConfig={typeof schedulePublish === 'object' && schedulePublish}
                    slug={drawerSlug} 
                    schedulePublishUse={schedulePublishUse} 
                    setSchedulePublishUse={setSchedulePublishUse}
                />
            )}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Another experience document was found to have &apos;Still working here...&apos; checked. 
                            Clicking Proceed will uncheck that document and mark this as the latest.
                            Proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Proceed</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    )
}
export default CustomExperienceButton