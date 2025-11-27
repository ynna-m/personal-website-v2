import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { Access, slugField, type CollectionConfig } from 'payload'
import { revalidateDelete, revalidateExperience } from './hooks/revalidateExperience'

const canReadExperience: Access = async ({ req, id }) => {
  const { payload, user } = req;

  // If authenticated, allow access to all documents
  if (user) return true;

  // If not authenticated, allow only the latest document
  // First, get the newest one
  const latest = await payload.find({
    collection: 'experience',
    sort: '-date-from',
    where: {
        current:{
            equals:true
        }
    },
    limit: 1,
  });

  const latestID = latest.docs[0]?.id;

  // If this document IS the latest, allow access
  if (id && id === latestID) {
    return true;
  }

  // Otherwise block it for unauthenticated users
  return false;
};

export const Experiences: CollectionConfig = {
    slug:'experience',
    admin:{
        group:'Developer Collection',
        useAsTitle:'title',
        description:'Developer experience collection'
    },
    access:{
        create: authenticated,
        delete: authenticated,
        read: canReadExperience,
        update: authenticated,
    },
    labels:{
        singular:'Experience',
        plural:'Experiences'
    },
    fields:[
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name:'image',
            type: 'upload',
            relationTo: 'media'
        },
        {
            name:'date-from',
            type:'date'
        },
        {
            name:'date-to',
            type:'date',
            admin:{
                condition:(data) => !data?.current
            }
        },
        {
            name:'current',
            type:'checkbox',
            label: 'Still working here'
        },
        {
            name:'content',
            type:'richText'
        },
        {
            name: 'tech-stack',
            type: 'relationship',
            hasMany: true,
            relationTo: 'skills',
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                date: {
                pickerAppearance: 'dayAndTime',
                },
                position: 'sidebar',
            },
            hooks: {
                beforeChange: [
                ({ siblingData, value }) => {
                    if (siblingData._status === 'published' && !value) {
                    return new Date()
                    }
                    return value
                },
                ],
            },
        },
        slugField()
    ],
    versions: {
        drafts: {
            autosave: {
                interval: 100, // We set this interval for optimal live preview
            },
            schedulePublish: true,
        },
        maxPerDoc: 50,
    },
    hooks: {
        afterChange: [revalidateExperience],
        afterDelete: [revalidateDelete],
    },
    timestamps:true
}