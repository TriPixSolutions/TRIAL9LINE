import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { projectLayouts } from '../lib/project-presentation'
import { projectCoverFields, projectGalleryField } from './project-media-fields'
import { privateContent } from '../lib/access'

const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'showOnHome', 'showOnWorks', 'updatedAt'],
    description: 'Add your story, upload images, preview and publish. Choose Home and Works placements independently.',
    components: { beforeList: ['/src/components/admin/Overview#ProjectGuide'] },
    group: 'Portfolio',
    preview: (doc) => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      if (doc?.slug) {
        return "/api/preview?slug=" + encodeURIComponent(String(doc.slug))
      }
      return null
    },
    livePreview: {
      url: ({ data }) => {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return "/api/preview?slug=" + encodeURIComponent(String(data.slug || ""))
      },
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => {
      // Authenticated users can read drafts; public can only read published docs
      if (['owner','editor'].includes(String(req.user?.role))) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
    create: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'editor',
  },
  hooks: {
    beforeValidate: [
      ({data,originalDoc,operation}) => {
        if (operation==='update' && data?.slug && originalDoc?.slug && data.slug!==originalDoc.slug) {
          data.previousSlugs=[...(originalDoc.previousSlugs||[]).filter((v:any)=>v.slug!==data.slug),{slug:originalDoc.slug}]
        }
        return data
      },
      ({ data, operation }) => {
        if (data) {
          if (!data.slug && data.title) {
            data.slug = formatSlug(data.title)
          } else if (data.slug) {
            data.slug = formatSlug(data.slug)
          }
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc }) => {
        try {
          revalidatePath('/work')
          revalidatePath('/')
          if (doc?.slug) {
            revalidatePath(`/work/${doc.slug}`)
          }
          if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
            revalidatePath(`/work/${previousDoc.slug}`)
          }
        } catch (e) {
          // Ignore cache revalidation errors outside request context
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidatePath('/work')
          revalidatePath('/')
          if (doc?.slug) {
            revalidatePath(`/work/${doc.slug}`)
          }
        } catch (e) {
          // Ignore
        }
      },
    ],
  },
  fields: [
    {name:'legacyVersionId',type:'text',admin:{hidden:true},access:{read:privateContent}},
    {name:'legacyId',type:'text',unique:true,admin:{hidden:true},access:{read:privateContent}},
    {name:'previousSlugs',type:'array',admin:{hidden:true},fields:[{name:'slug',type:'text',required:true}]},
    { name:'editorIntro', type:'ui', admin:{components:{Field:'/src/components/admin/ProjectFields#EditorIntro'}} },
    {
      type: 'tabs',
      tabs: [
        {
          label: '1. Project story',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Project Name',
              admin: {
                components: { Cell: '/src/components/admin/CoverCell#CoverCell' },
                description: 'Client or venue name (e.g. Tharavadu, 90’s Lounge)',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              label: 'Page address',
              admin: {
                components:{Field:'/src/components/admin/ProjectFields#SlugField'},
                description: 'Auto-formatted web slug (e.g. tharavadu). Visible at /work/[slug].',
              },
            },
            {
              name: 'editorialHeadline',
              type: 'text',
              label: 'Short Headline',
              admin: {
                description: 'One concise line summarizing the work (e.g. South Indian flavours, brought into focus.)',
              },
            },
            {
              name: 'overview',
              type: 'textarea',
              required: true,
              label: 'Project Overview',
              admin: {
                description: 'Confirmed project narrative and creative scope.',
              },
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              required: true,
              label: 'Categories',
              admin: {
                description: 'Select one or more active categories for public portfolio filtering.',
              },
            },
            {
              name: 'servicesSummary',
              type: 'text',
              label: 'Services Breakdown',
              admin: {
                description: 'Concise deliverables line (e.g. Social Strategy • Food Videography • Macro Photography)',
              },
            },
            {
              name: 'industry',
              type: 'text',
              defaultValue: 'Restaurant & Hospitality',
              label: 'Industry',
            },
            {
              name: 'clientName',
              type: 'text',
              label: 'Client Name (Optional)',
              admin: {
                description: 'Enter if distinct from project title.',
              },
            },
          ],
        },
        {
          label: '2. Build the page',
          fields: [
            { name: 'sectionTemplate', type: 'ui', admin: { components: { Field: '/src/components/admin/ProjectFields#SectionTemplate' } } },
            ...projectCoverFields,
            { name: 'externalLink', type: 'text', label: 'Client website or social link' },
            projectGalleryField,
          ],
        },
        { label:'3. Page appearance', fields:[
          {name:'layout',type:'select',defaultValue:'editorial',options:projectLayouts,admin:{components:{Field:'/src/components/admin/ProjectFields#LayoutPicker'}}},
          {name:'heroRatio',type:'select',defaultValue:'wide',admin:{condition:data=>data.layout!=='film'},options:[{label:'Wide · 2:1',value:'wide'},{label:'Cinematic · 21:9',value:'cinematic'},{label:'Classic · 4:3',value:'classic'}]},
          {name:'gallerySpacing',type:'select',defaultValue:'comfortable',options:[{label:'Comfortable',value:'comfortable'},{label:'Compact',value:'compact'}]},
        ]},
        {
          label: '4. Visibility & publish',
          fields: [
            {name:'showOnHome',type:'checkbox',defaultValue:false,label:'Show on Home',admin:{components:{Field:'/src/components/admin/ProjectFields#PlacementToggle'},description:'Include this published project in selected work. Projects are shown by Home order, up to the section limit.'}},
            {name:'showOnWorks',type:'checkbox',defaultValue:true,label:'Show on Works',admin:{components:{Field:'/src/components/admin/ProjectFields#PlacementToggle'},description:'Include this published project in the portfolio grid. To make the detail page private, unpublish the project.'}},
            {name:'homeOrder',type:'number',defaultValue:0,label:'Home order',admin:{description:'Lower numbers appear first.'}},
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              label: 'Feature on Homepage',
              admin: {
                hidden: true,
                description: 'Legacy Home flag; use Show on Home.',
              },
            },
            {
              name: 'displayOrder',
              type: 'number',
              defaultValue: 0,
              label: 'Works order',
              admin: {
                description: 'Lower numbers appear first (e.g. 1, 2, 3).',
              },
            },
            {
              name: 'nextProject',
              type: 'relationship',
              relationTo: 'projects',
              label: 'Recommended Next Project',
              admin: {
                description: 'Link displayed at bottom of page to continue the visitor journey.',
              },
            },
            {
              name: 'approach',
              type: 'textarea',
              label: 'Private production notes',
              access: { read: privateContent },
              admin: {
                description: 'Internal strategy notes (optional).',
              },
            },
            {
              type: 'collapsible',
              label: 'Search Engine Optimization (SEO)',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'SEO Meta Title',
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'SEO Meta Description',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
