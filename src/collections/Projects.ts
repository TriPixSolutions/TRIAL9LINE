import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { projectLayouts, galleryLayouts } from '../lib/project-presentation'
import { privateContent } from '../lib/access'
import { resolveProjectVideo } from '../lib/project-video'

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
          label: '2. Images & films',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover Image (Media Library)',
              admin: {
                description: 'Primary project cover image for the 4:3 portfolio grid and header.',
              },
            },
            {
              name: 'coverImageUrl',
              type: 'text',
              label: 'Cover Image URL (Direct / Fallback)',
              admin: {
                description: 'Enter a direct path (e.g. /images/tharavadu-case-study.png) or external image link.',
              },
            },
            {
              name: 'externalLink',
              type: 'text',
              label: 'Client Website / Social Link (Optional)',
              admin: {
                description: 'Verified external link to the client venue or published campaign.',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Project gallery',
              labels: {singular:'Gallery section', plural:'Gallery sections'},
              admin: {
                description: 'Add and reorder modular visual blocks for the project detail page.',
              },
              fields: [
                {
                  name: 'blockType',
                  type: 'select',
                  required: true,
                  defaultValue: 'wideImage',
                  options: galleryLayouts,
                },
                {
                  name: 'mediaItem',
                  type: 'relationship',
                  relationTo: 'media',
                  label: 'Image from Media Library',
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData?.blockType === 'wideImage' ||
                      siblingData?.blockType === 'captionedImage',
                  },
                },
                {
                  name: 'imageUrl',
                  type: 'text',
                  label: 'Image URL',
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData?.blockType === 'wideImage' ||
                      siblingData?.blockType === 'captionedImage',
                  },
                },
                {
                  name: 'mediaLeft',
                  type: 'relationship',
                  relationTo: 'media',
                  label: 'Left Image (Media Library)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.blockType === 'imagePair',
                  },
                },
                {
                  name: 'imageLeftUrl',
                  type: 'text',
                  label: 'Left Image URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.blockType === 'imagePair',
                  },
                },
                {
                  name: 'mediaRight',
                  type: 'relationship',
                  relationTo: 'media',
                  label: 'Right Image (Media Library)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.blockType === 'imagePair',
                  },
                },
                {
                  name: 'imageRightUrl',
                  type: 'text',
                  label: 'Right Image URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.blockType === 'imagePair',
                  },
                },
                {
                  name: 'stripImages',
                  type: 'array',
                  label: 'Vertical Strip Images (9:16)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.blockType === 'portraitStrip',
                  },
                  fields: [
                    { name: 'media', type: 'upload', relationTo: 'media', label: 'Media' },
                    { name: 'url', type: 'text', label: 'Image URL' },
                    { name: 'caption', type: 'text', label: 'Caption' },
                  ],
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  label: 'Video link',
                  validate: (value: string | null | undefined) => !value || resolveProjectVideo(value) !== null || 'Use a YouTube, Instagram post/reel, Vimeo, MP4 or WebM link.',
                  admin: {
                    description: 'Paste a YouTube watch/Shorts link, a public Instagram post/reel link, Vimeo, or a direct MP4/WebM URL. Social posts must allow embedding.',
                    condition: (data, siblingData) => siblingData?.blockType === 'video',
                  },
                },
                {name:'videoPoster',type:'upload',relationTo:'media',label:'Video poster image',admin:{condition:(_data,siblingData)=>siblingData?.blockType==='video'}},
                {name:'imageRatio',type:'select',defaultValue:'landscape',label:'Image shape',options:[{label:'Landscape · 16:9',value:'landscape'},{label:'Cinematic · 21:9',value:'cinematic'},{label:'Square · 1:1',value:'square'}],admin:{condition:(_data,siblingData)=>['wideImage','captionedImage'].includes(siblingData?.blockType)}},
                {
                  name: 'videoPosterUrl',
                  type: 'text',
                  label: 'Video Poster Image URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.blockType === 'video',
                  },
                },
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Heading / Callout',
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData?.blockType === 'textBlock' ||
                      siblingData?.blockType === 'video',
                  },
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption Note',
                },
                {
                  name: 'body',
                  type: 'textarea',
                  label: 'Narrative Text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.blockType === 'textBlock',
                  },
                },
              ],
            },
          ],
        },
        { label:'3. Appearance', fields:[
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
