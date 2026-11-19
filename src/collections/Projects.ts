import type { CollectionConfig } from 'payload'
import { normalizePortfolioCategory, normalizePortfolioSections, portfolioSections } from '../lib/portfolio-sections'
import { revalidatePath } from 'next/cache'
import { projectLayouts } from '../lib/project-presentation'
import { projectCoverFields, projectGalleryField } from './project-media-fields'
import { portfolioContentFields } from './portfolio-content-fields'
import { privateContent } from '../lib/access'

const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')

const portfolioCategoryOptions = [
  ...portfolioSections.map(({ slug, title }) => ({ value: slug, label: title })),
  { value: 'content-production', label: 'Legacy content production (defaults to Video Production)' },
]

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Portfolio work', plural: 'Portfolio work' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'portfolioCategory', 'showOnWorks', 'updatedAt'],
    description: 'Choose a portfolio category, upload the matching work and publish it to the website grids.',
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
      ({ data, originalDoc, operation }) => {
        if (data) {
          if (!data.portfolioCategory && originalDoc?.portfolioCategory) data.portfolioCategory = originalDoc.portfolioCategory
          if (!data.portfolioCategory) data.portfolioCategory = normalizePortfolioSections(data.portfolioSections || originalDoc?.portfolioSections)[0]
          const normalizedCategory = normalizePortfolioCategory(data.portfolioCategory)
          if (normalizedCategory && (operation === 'create' || data.portfolioCategory !== originalDoc?.portfolioCategory)) {
            data.portfolioCategory = normalizedCategory
          }
          if (data.portfolioCategory) data.portfolioSections = [normalizePortfolioCategory(data.portfolioCategory) || data.portfolioCategory]
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
          portfolioSections.forEach(({ slug }) => revalidatePath(`/work/sections/${slug}`))
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
          portfolioSections.forEach(({ slug }) => revalidatePath(`/work/sections/${slug}`))
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
    {
      name: 'portfolioCategory',
      type: 'select',
      required: true,
      label: 'Portfolio category',
      options: portfolioCategoryOptions,
      hooks: { afterRead: [({ value, data }) => normalizePortfolioCategory(value) || normalizePortfolioSections(data?.portfolioSections)[0]] },
      admin: {
        className: 'studio-category-select',
        description: 'This choice controls the upload fields and the public portfolio grid.',
        components: { Field: '/src/components/admin/ProjectFields#CategorySelector' },
      },
    },
    { name: 'portfolioSections', type: 'select', hasMany: true, options: portfolioCategoryOptions, admin: { hidden: true } },
    {name:'legacyVersionId',type:'text',admin:{hidden:true},access:{read:privateContent}},
    {name:'legacyId',type:'text',unique:true,admin:{hidden:true},access:{read:privateContent}},
    {name:'previousSlugs',type:'array',admin:{hidden:true},fields:[{name:'slug',type:'text',required:true}]},
    { name:'editorIntro', type:'ui', admin:{components:{Field:'/src/components/admin/ProjectFields#EditorIntro'}} },
    {
      type: 'tabs',
      tabs: [
        {
          label: '1. Work overview',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Internal work name',
              admin: {
                components: { Cell: '/src/components/admin/CoverCell#CoverCell' },
                description: 'Internal name for this body of work. Public portfolio cards use service names.',
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
              type: 'collapsible',
              label: 'Optional project page details',
              admin: { initCollapsed: true },
              fields: [
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
                hidden: true,
                description: 'Enter if distinct from project title.',
              },
            },
              ],
            },
          ],
        },
        {
          label: '2. Upload portfolio work',
          fields: [
            ...portfolioContentFields,
            {
              type: 'collapsible',
              label: 'Advanced project detail page',
              admin: { initCollapsed: true },
              fields: [
            { name: 'sectionTemplate', type: 'ui', admin: { components: { Field: '/src/components/admin/ProjectFields#SectionTemplate' } } },
            ...projectCoverFields,
            { name: 'externalLink', type: 'text', label: 'Client website or social link' },
            projectGalleryField,
              ],
            },
          ],
        },
        { label:'3. Advanced page', fields:[
          {name:'layout',type:'select',defaultValue:'editorial',options:projectLayouts,admin:{components:{Field:'/src/components/admin/ProjectFields#LayoutPicker'}}},
          {name:'heroRatio',type:'select',defaultValue:'wide',admin:{condition:data=>data.layout!=='film'},options:[{label:'Wide · 2:1',value:'wide'},{label:'Cinematic · 21:9',value:'cinematic'},{label:'Classic · 4:3',value:'classic'}]},
          {name:'gallerySpacing',type:'select',defaultValue:'comfortable',options:[{label:'Comfortable',value:'comfortable'},{label:'Compact',value:'compact'}]},
        ]},
        {
          label: '4. Visibility & publish',
          fields: [
            {name:'showOnHome',type:'checkbox',defaultValue:false,label:'Show on Home',admin:{components:{Field:'/src/components/admin/ProjectFields#PlacementToggle'},description:'Show this published work in the selected work section on the homepage.'}},
            {name:'showOnWorks',type:'checkbox',defaultValue:true,label:'Show on Works',admin:{components:{Field:'/src/components/admin/ProjectFields#PlacementToggle'},description:'Include this published project in the portfolio grid. To make the detail page private, unpublish the project.'}},
            {name:'homeOrder',type:'number',defaultValue:0,label:'Home order',admin:{description:'Lower numbers appear first on the homepage.'}},
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
